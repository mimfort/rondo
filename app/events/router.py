from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List
import os
from datetime import datetime, timezone
import logging
from pytz import timezone

from app.users.dao import UsersDao
from app.events.dao import EventDao
from app.events.schemas import EventCreate, EventResponse, UploadedImagesResponse
from app.users.dependencies import get_current_user
from app.users.model import User
from app.registration.dao import RegistrationDao
from app.tasks.tasks import send_about_new_event

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["События"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/", response_model=List[EventResponse])
async def get_all_events_with_tags():
    events = await EventDao.find_all_with_tags()
    result = []
    for event in events:
        count_members = await RegistrationDao.count(event_id=event.id)
        event_dict = {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "media_url": event.media_url,
            "max_members": event.max_members,
            "location": event.location,
            "start_time": event.start_time,
            "end_time": event.end_time,
            "count_members": count_members,
            "additional_members": event.additional_members,
            "created_at": event.created_at,
            "updated_at": event.updated_at,
            "is_active": event.is_active,
            "tags": [tag.name for tag in event.tags]
        }
        result.append(event_dict)
    return result

@router.get("/uploads", response_model=UploadedImagesResponse)
async def get_uploaded_images():
    """Получить список всех загруженных изображений"""
    if not os.path.exists(UPLOAD_DIR):
        return UploadedImagesResponse(images=[])
    
    files = os.listdir(UPLOAD_DIR)
    image_files = [f"/uploads/{f}" for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp'))]
    return UploadedImagesResponse(images=image_files)

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int):
    event = await EventDao.find_one_or_none(id=event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Событие не найдено",
        )
    count_members = await RegistrationDao.count(event_id=event_id)
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "media_url": event.media_url,
        "max_members": event.max_members,
        "location": event.location,
        "start_time": event.start_time,
        "end_time": event.end_time,
        "count_members": count_members,
        "additional_members": event.additional_members,
        "created_at": event.created_at,
        "updated_at": event.updated_at,
        "is_active": event.is_active,
        "tags": [tag.name for tag in event.tags]
    }

@router.post("/admin_create", response_model=EventResponse)
async def create_event(
    title: str = Form(...),
    description: str = Form(...),
    max_members: int = Form(...),
    location: str = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    image: UploadFile = File(None),
    media_url: str = Form(None),
    current_user: User = Depends(get_current_user)
):
    """
    Создание нового мероприятия
    """
    if current_user.admin_status != "admin":
        raise HTTPException(
            status_code=403,
            detail="Недостаточно прав для выполнения операции"
        )

    # Преобразуем строки в datetime
    try:
        # Добавляем московский часовой пояс к времени
        moscow_tz = timezone('Europe/Moscow')
        start_time_dt = datetime.fromisoformat(start_time)
        end_time_dt = datetime.fromisoformat(end_time)
        
        # Если время без часового пояса, добавляем московский
        if start_time_dt.tzinfo is None:
            start_time_dt = moscow_tz.localize(start_time_dt)
        if end_time_dt and end_time_dt.tzinfo is None:
            end_time_dt = moscow_tz.localize(end_time_dt)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Неверный формат даты: {str(e)}"
        )

    # Используем существующий URL или загружаем новое изображение
    final_media_url = media_url
    if image and not media_url:
        try:
            # Создаем уникальное имя файла
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{image.filename}"
            filepath = os.path.join(UPLOAD_DIR, filename)
            
            # Сохраняем файл
            with open(filepath, "wb") as buffer:
                content = await image.read()
                buffer.write(content)
            
            # Формируем URL для доступа к файлу
            final_media_url = f"/uploads/{filename}"
        except Exception as e:
            logger.error(f"Ошибка при загрузке изображения: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Ошибка при загрузке изображения: {str(e)}"
            )

    try:
        event = await EventDao.add(
            title=title,
            description=description,
            media_url=final_media_url,
            max_members=max_members,
            location=location,
            start_time=start_time_dt,
            end_time=end_time_dt,
            additional_members=0
        )
        
        # Получаем событие с загруженными тегами
        event_with_tags = await EventDao.find_one_or_none(id=event.id)
        count_members = await RegistrationDao.count(event_id=event.id)
        
        return {
            "id": event_with_tags.id,
            "title": event_with_tags.title,
            "description": event_with_tags.description,
            "media_url": event_with_tags.media_url,
            "max_members": event_with_tags.max_members,
            "location": event_with_tags.location,
            "start_time": event_with_tags.start_time,
            "end_time": event_with_tags.end_time,
            "count_members": count_members,
            "additional_members": event_with_tags.additional_members,
            "created_at": event_with_tags.created_at,
            "updated_at": event_with_tags.updated_at,
            "is_active": event_with_tags.is_active,
            "tags": [tag.name for tag in event_with_tags.tags]
        }
    except Exception as e:
        logger.error(f"Ошибка при создании мероприятия: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании мероприятия: {str(e)}"
        )

@router.delete("/{event_id}", response_model=EventResponse)
async def delete_event(
    event_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Удаление мероприятия
    """
    if current_user.admin_status != "admin":
        raise HTTPException(
            status_code=403,
            detail="Недостаточно прав для выполнения операции"
        )
    
    event = await EventDao.find_one_or_none(id=event_id)
    if not event:
        raise HTTPException(
            status_code=404,
            detail="Мероприятие не найдено"
        )
    
    try:
        count_members = await RegistrationDao.count(event_id=event_id)
        await EventDao.delete_event(event_id)
        return {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "media_url": event.media_url,
            "max_members": event.max_members,
            "location": event.location,
            "start_time": event.start_time,
            "end_time": event.end_time,
            "count_members": count_members,
            "additional_members": event.additional_members,
            "created_at": event.created_at,
            "updated_at": event.updated_at,
            "is_active": event.is_active,
            "tags": [tag.name for tag in event.tags]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при удалении мероприятия: {str(e)}"
        )

@router.post("/notification/{event_id}")
async def send_notification(event_id: int, current_user: User = Depends(get_current_user)):
    if current_user.admin_status == "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав для отправки уведомлений",
        )
    event = await EventDao.find_one_or_none(id=event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Событие не найдено",
        )
    users = await UsersDao.find_all()
    try:
        for user in users:
            # Преобразуем дату в datetime, если она не является datetime
            start_time = event.start_time
            if isinstance(start_time, str):
                start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
            send_about_new_event.delay(
                to=user.email,
                username=user.username,
                event_name=event.title,
                time_start=start_time
            )
        return {"message": "Уведомления успешно отправлены"}
    except Exception as e:
        logger.error(f"Ошибка при отправке уведомлений: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при отправке уведомлений: {str(e)}"
        )
        

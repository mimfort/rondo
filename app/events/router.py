from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List
import os
from datetime import datetime

from app.events.dao import EventDao
from app.events.schemas import EventCreate, EventResponse, UploadedImagesResponse
from app.users.dependencies import get_current_user
from app.users.model import User
from app.registration.dao import RegistrationDao
router = APIRouter(prefix="/events", tags=["События"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/", response_model=List[EventResponse])
async def get_all_events():
    events = await EventDao.find_all()
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
            "is_active": event.is_active
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
        "is_active": event.is_active
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
    print(f"Получены данные: title={title}, description={description}, max_members={max_members}, "
          f"location={location}, start_time={start_time}, end_time={end_time}, image={image}, media_url={media_url}")

    if current_user.admin_status == "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав для создания мероприятий",
        )

    # Преобразуем строки в datetime
    try:
        start_time_dt = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end_time_dt = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Неверный формат даты: {str(e)}"
        )

    # Используем существующий URL или загружаем новое изображение
    final_media_url = media_url
    if image and not media_url:
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

    try:
        print("Попытка создания события с параметрами:")
        print(f"title: {title} ({type(title)})")
        print(f"description: {description} ({type(description)})")
        print(f"max_members: {max_members} ({type(max_members)})")
        print(f"location: {location} ({type(location)})")
        print(f"start_time: {start_time_dt} ({type(start_time_dt)})")
        print(f"end_time: {end_time_dt} ({type(end_time_dt)})")
        print(f"media_url: {final_media_url} ({type(final_media_url)})")
        print(f"additional_members: 0 (int)")
        
        event = await EventDao.add(
            title=title,
            description=description,
            media_url=final_media_url,
            max_members=int(max_members),
            location=location,
            start_time=start_time_dt,
            end_time=end_time_dt,
            additional_members=0
        )
        print(f"Создано событие: {event}")
        return event
    except Exception as e:
        import traceback
        print(f"Ошибка при создании события: {str(e)}")
        print("Полный стек ошибки:")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при создании события: {str(e)}"
        )

@router.delete("/{event_id}")
async def delete_event(event_id: int, current_user: User = Depends(get_current_user)):
    if current_user.admin_status == "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав для удаления мероприятий",
        )
    event = await EventDao.find_one_or_none(id=event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Событие не найдено",
        )
    await EventDao.delete(id=event_id)
    return {"message": "Событие успешно удалено"}

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List
import os
from datetime import datetime

from app.events.dao import EventDao
from app.events.schemas import EventCreate, EventResponse
from app.users.dependencies import get_current_user
from app.users.model import User

router = APIRouter(prefix="/events", tags=["События"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.get("/", response_model=List[EventResponse])
async def get_all_events():
    events = await EventDao.find_all()
    return events

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int):
    event = await EventDao.find_one_or_none(id=event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Событие не найдено",
        )
    return event

@router.post("/admin_create", response_model=EventResponse)
async def create_event(
    title: str = Form(...),
    description: str = Form(...),
    max_members: int = Form(...),
    location: str = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    image: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    print(f"Получены данные: title={title}, description={description}, max_members={max_members}, "
          f"location={location}, start_time={start_time}, end_time={end_time}, image={image}")

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

    media_url = None
    if image:
        # Создаем уникальное имя файла
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        
        # Сохраняем файл
        with open(filepath, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        # Формируем URL для доступа к файлу
        media_url = f"/uploads/{filename}"

    try:
        print("Попытка создания события с параметрами:")
        print(f"title: {title} ({type(title)})")
        print(f"description: {description} ({type(description)})")
        print(f"max_members: {max_members} ({type(max_members)})")
        print(f"location: {location} ({type(location)})")
        print(f"start_time: {start_time_dt} ({type(start_time_dt)})")
        print(f"end_time: {end_time_dt} ({type(end_time_dt)})")
        print(f"media_url: {media_url} ({type(media_url)})")
        print(f"additional_members: 0 (int)")
        
        event = await EventDao.add(
            title=title,
            description=description,
            media_url=media_url,
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

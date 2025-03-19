from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.events.dao import EventDao
from app.events.schemas import EventCreate, EventResponse
from app.users.dependencies import get_current_user
from app.users.model import User

router = APIRouter(prefix="/events", tags=["События"])


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
    data: EventCreate, current_user: User = Depends(get_current_user)
):
    if current_user.admin_status == "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="У вас нет прав для создания мероприятий",
        )
    event = await EventDao.add(
        title=data.title,
        description=data.description,
        media_url=data.media_url,
        max_members=data.max_members,
        additional_members=data.additional_members,
        location=data.location,
        start_time=data.start_time,
        end_time=data.end_time,
    )
    return event


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

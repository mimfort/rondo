from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.event_tags.schemas import EventTagCreate, EventTagList, EventTagResponse, EventTag2List
from app.event_tags.dao import EventTagDao
from app.users.dependencies import get_current_user
from app.users.model import User
from app.events.dao import EventDao
from app.tags.dao import TagDao
router = APIRouter(prefix="", tags=["События и тэги"])

@router.post("/events/{event_id}/tags/{tag_id}", response_model=EventTagResponse)
async def create_event_tag(event_tag: EventTagCreate, current_user: User = Depends(get_current_user)):
    if current_user.admin_status!="admin":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="у вас нет прав")
    event = await EventDao.find_one_or_none(id=event_tag.event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Событие не найдено")
    tag = await TagDao.find_one_or_none(id=event_tag.tag_id)
    if not tag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Тэг не найден")
    if await EventTagDao.find_one_or_none(event_id=event_tag.event_id, tag_id=event_tag.tag_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Тэг уже существует")
    return await EventTagDao.add(event_id = event_tag.event_id,tag_id = event_tag.tag_id)
    
@router.get("/events/{event_id}/tags", response_model=EventTagList)
async def get_event_tags(event_id: int, current_user: User = Depends(get_current_user)):
    event = await EventDao.find_one_or_none(id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="событие не найдено")
    tags = await EventTagDao.find_all(event_id=event_id)
    return {"event_tags":tags}

@router.delete("/events/{event_id}/tags/{tag_id}")
async def delete_event_tag(event_id: int, tag_id: int, current_user: User = Depends(get_current_user)):
    if current_user.admin_status!="admin":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="у вас нет прав")
    event = await EventTagDao.find_one_or_none(event_id=event_id, tag_id=tag_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="событие или тэг не найден")
    await EventTagDao.delete(id=event.id)
    return {"message":"тэг удален"}
    
@router.get("/tags/{tag_id}/events", response_model=EventTag2List)
async def get_tag_events(tag_id: int, current_user: User = Depends(get_current_user)):
    tag = await TagDao.find_one_or_none(id=tag_id)
    if not tag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="тэг не найден")
    events = await EventTagDao.find_all(tag_id=tag_id)
    return {"events":events}



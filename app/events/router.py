from fastapi import APIRouter, Depends
from app.events.schemas import EventResponse, EventCreate
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.dependencies import get_async_session, get_current_user
from app.users.model import User
from fastapi import HTTPException, status
from app.events.dao import EventDao
router = APIRouter(
    prefix='/events',
    tags=["Соты создать ивент"]
)

@router.post("/admin_create", response_model=EventResponse)
async def create_event(data: EventCreate,
                       current_user: User = Depends(get_current_user)):
    if current_user.admin_status == "user":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав для создания мероприятий")
    event = await EventDao.add(title=data.title, description=data.description, media_url=data.media_url, max_members=data.max_members, additional_members=data.additional_members,location=data.location,start_time=data.start_time, end_time=data.end_time)
    return event



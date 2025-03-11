from fastapi import APIRouter, Depends, HTTPException, status
from app.additional_registration.schemas import RegistrationResponse
from app.additional_registration.dao import RegistrationAddDao
from app.users.dependencies import get_current_user
from app.events.dao import EventDao
from app.users.model import User
from datetime import datetime, timezone
from app.registration.dao import RegistrationDao
router = APIRouter(prefix='/events/additional', tags=['Соты регистрация на ивент (доп места)'])

@router.post("/registration/{event_id}", response_model=RegistrationResponse) 
async def registration_on_event(event_id: int,
                                current_user:User = Depends(get_current_user)):
    new_registration = await RegistrationAddDao.find_one_or_none(user_id=current_user.id, event_id=event_id)
    if new_registration:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="вы уже записаны на этот ивент")
    is_exist = await EventDao.find_one_or_none(id=event_id)
    if not is_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ивент не найден")
    count_users = await RegistrationAddDao.count(event_id=event_id)
    if is_exist.additional_members < count_users:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="места закончились")
    if is_exist.start_time < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="ивент уже начался или прошел")
    in_addreg = await RegistrationDao.find_one_or_none(event_id=event_id, user_id = current_user.id)
    if in_addreg:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="у вас уже есть запись на основные места")
    user_reg = await RegistrationAddDao.add(event_id=event_id, user_id=current_user.id)
    return user_reg

@router.post("/disregistration/{event_id}")
async def disregistration_on_event(event_id:int,
                                   current_user: User = Depends(get_current_user)):
    is_registration = await RegistrationAddDao.find_one_or_none(event_id=event_id, user_id=current_user.id)
    if not is_registration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="вы не зарегистрированы на этот ивент или его не существует")
    event = await EventDao.find_one_or_none(id=event_id)
    if event.start_time < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="ивент уже начался или прошел")
    await RegistrationAddDao.delete(is_registration.id)
    return "запись удалена"

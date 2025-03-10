from fastapi import APIRouter, Depends, HTTPException, status
from app.registration.schemas import RegistrationResponse
from app.registration.dao import RegistrationDao
from app.users.dependencies import get_current_user
from app.events.dao import EventDao
from app.users.model import User
router = APIRouter(prefix='/events', tags=['Соты регистрация на ивент'])

@router.post("/registration/{event_id}", response_model=RegistrationResponse) 
async def registration_on_event(event_id: int,
                                current_user:User = Depends(get_current_user)):
    new_registration = await RegistrationDao.find_one_or_none(user_id=current_user.id, event_id=event_id)
    if new_registration:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="вы уже записаны на этот ивент")
    is_exist = await EventDao.find_one_or_none(id=event_id)
    if not is_exist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ивент не найден")
    count_users = await RegistrationDao.count(event_id=event_id)
    if is_exist.max_members < count_users:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="места закончились")
    user_reg = await RegistrationDao.add(event_id=event_id, user_id=current_user.id)
    return user_reg

@router.post("/disregistration/{event_id}")
async def disregistration_on_event(event_id:int,
                                   current_user: User = Depends(get_current_user)):
    is_registration = await RegistrationDao.find_one_or_none(id=event_id, user_id=current_user.id)
    if not is_registration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="вы не зарегистрированы на этот ивент или его не существует")
    await RegistrationDao.delete(is_registration.id)
    return "запись удалена"

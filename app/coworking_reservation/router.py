from fastapi import APIRouter, Depends, HTTPException
from pytz import timezone
from app.coworking.dao import CoworkingDAO
from app.coworking_reservation.schemas import CoworkingReservationCreate, CoworkingReservationListAdmin, CoworkingReservationRead, CoworkingReservationList, CoworkingReservationClose, CoworkingReservationCloseAdmin
from app.coworking_reservation.dao import CoworkingReservationDAO
from app.users.router import get_current_user
from app.users.model import User
from app.coworking.model import Coworking
from datetime import datetime
router = APIRouter(
    prefix="/coworking_reservations",
    tags=["coworking_reservations"]
)
moscow_tz = timezone('Europe/Moscow')

@router.post("/")
async def create_coworking_reservation(
    coworking_reservation: CoworkingReservationCreate,
    current_user: User = Depends(get_current_user)
):
    
    if (datetime.now(moscow_tz).hour < 9) or (datetime.now(moscow_tz).hour > 16) and False:
        raise HTTPException(status_code=400, detail="Коворкинг работает с 9 до 17")
    coworking = await CoworkingDAO.find_one_or_none(
        id = coworking_reservation.coworking_id,
        is_available = True)
    if not coworking:
        raise HTTPException(status_code=400, detail="Место уже занято")
    find_any_reservation = await CoworkingReservationDAO.find_one_or_none(
        user_id = current_user.id,
        end_time = None
    )
    if find_any_reservation:
        raise HTTPException(status_code=400, detail="Можно забронировать только одно место одновременно")
    await CoworkingReservationDAO.add(
        coworking_id = coworking_reservation.coworking_id,
        user_id = current_user.id,
        start_time = datetime.now(moscow_tz),
        end_time = None)
    await CoworkingDAO.update_coworking(
        coworking_id = coworking_reservation.coworking_id,
        is_available = False,
        name = None,
        description = None
    )
    return {"message": "Бронь успешно создана"}

@router.post("/close")
async def close_coworking_reservation(
    coworking_reservation: CoworkingReservationClose,
    current_user: User = Depends(get_current_user)):
    reservation = await CoworkingReservationDAO.find_one_or_none(
        coworking_id = coworking_reservation.coworking_id,
        user_id = current_user.id,
        end_time = None
    )
    if not reservation:
        raise HTTPException(status_code=400, detail="Бронь не найдена")
    
    await CoworkingReservationDAO.update(
        reservation.id,
        "end_time",
        datetime.now(moscow_tz)
    )
    await CoworkingDAO.update_coworking(
        coworking_id = coworking_reservation.coworking_id,
        name = None,
        description = None,
        is_available = True
    )
    return {"message": "Бронь закрыта"}

@router.get("/get_all_reservations_by_user", response_model=CoworkingReservationList)
async def get_coworking_reservations(
    current_user: User = Depends(get_current_user)
):
    reservations = await CoworkingReservationDAO.find_all(
        user_id = current_user.id
    )
    return {"items": reservations}



@router.get("/get_all_reservations_active_by_user", response_model=CoworkingReservationList)
async def get_all_reservations_active_by_user(
    current_user: User = Depends(get_current_user)
):
    reservations = await CoworkingReservationDAO.find_all(
        end_time = None,
        user_id = current_user.id
    )
    return {"items": reservations}

@router.get("/get_all_reservations_active_admin", response_model=CoworkingReservationListAdmin)
async def get_all_reservations_active_admin(
    current_user: User = Depends(get_current_user)
):
    if not current_user.admin_status=="admin":
        raise HTTPException(status_code=400, detail="У вас нет прав на просмотр броней")
    reservations = await CoworkingReservationDAO.find_all(
        end_time = None
    )
    return {"items": reservations}

@router.post("/close_admin")
async def close_admin(
    coworking_reservation: CoworkingReservationCloseAdmin,
    current_user: User = Depends(get_current_user)
):
    if not current_user.admin_status=="admin":
        raise HTTPException(status_code=400, detail="У вас нет прав на закрытие брони")
    reservation = await CoworkingReservationDAO.find_one_or_none(
        coworking_id = coworking_reservation.coworking_id,
        end_time = None
    )
    if not reservation:
        raise HTTPException(status_code=400, detail="Бронь не найдена")
    await CoworkingReservationDAO.update(
        reservation.id,
        "end_time",
        datetime.now(tz=moscow_tz)
    )
    await CoworkingDAO.update_coworking(
        coworking_id = coworking_reservation.coworking_id,
        is_available = True,
        name = None,
        description = None
    )   
    return {"message": "Бронь закрыта"}
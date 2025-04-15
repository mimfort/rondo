from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.court_reservation.dao import CourtReservationDAO
from app.court_reservation.model import CourtReservation
from app.courts.dao import CourtDAO
from app.users.model import User
from app.court_reservation.schemas import ListCourtReservation, CourtReservationCreate, CourtReservationUpdate, CourtReservation_response
from app.users.dependencies import get_current_user
from datetime import date, datetime
from app.users.dao import UsersDao
from app.tasks.tasks import cancel_if_not_confirmed
from datetime import date
router = APIRouter(
    prefix="/court_reservations",
    tags=["court_reservations"]
)

@router.get("/all/{date}", response_model=ListCourtReservation | None)
async def get_court_reservations(
    date: date):
    courts_reservations = await CourtReservationDAO.find_all(date=date)
    return {"items": courts_reservations, "total": len(courts_reservations)}


@router.post("/temporary", response_model=CourtReservation_response)
async def create_temporary_reservation(
    data: CourtReservationCreate,
    current_user: User = Depends(get_current_user)
):
    court = await CourtDAO.find_one_or_none(id=data.court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Корт не найден")
    is_exists = await CourtReservationDAO.find_one_or_none(date=data.date, time=data.time, court_id=data.court_id)
    if is_exists:
        raise HTTPException(status_code=400, detail="Время уже занято")
    
    reservation = await CourtReservationDAO.add(user_id=current_user.id, date=data.date, time=data.time, court_id=data.court_id)
    cancel_if_not_confirmed.apply_async((reservation.id,), countdown=10)
    return reservation
    

@router.post("/{reservation_id}/confirm", response_model=CourtReservation_response)
async def confirm_reservation(
    reservation_id: int,
    current_user: User = Depends(get_current_user)
):
    reservation = await CourtReservationDAO.find_one_or_none(id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    if reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    if reservation.is_confirmed == True:
        raise HTTPException(status_code=409, detail="Оплата уже подтверждена")
    result = await CourtReservationDAO.update(id=reservation_id, field="is_confirmed", data=True)
    return result
@router.get("/my_reservations", response_model=ListCourtReservation)
async def get_my_reservations(
    current_user: User = Depends(get_current_user)
):
    reservations = await CourtReservationDAO.find_all(user_id=current_user.id, is_confirmed=True)
    return {"items": reservations, "total": len(reservations)}

@router.delete("/cancel/{reservation_id}", response_model=CourtReservation_response)
async def delete_reservation(
    reservation_id: int,
    current_user: User = Depends(get_current_user)
):
    reservation = await CourtReservationDAO.find_one_or_none(id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    if reservation.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    if reservation.is_confirmed == True:
        raise HTTPException(status_code=409, detail="Оплата уже подтверждена")
    await CourtReservationDAO.delete(id=reservation_id)
    return reservation

@router.get("/my_temporary_reservations", response_model=ListCourtReservation)
async def get_my_temporary_reservations(
    current_user: User = Depends(get_current_user)
):
    reservations = await CourtReservationDAO.find_all(user_id=current_user.id, is_confirmed=False)
    return {"items": reservations, "total": len(reservations)}

@router.post("/cancel_by_admin/{reservation_id}")
async def cancel_by_admin(
    reservation_id: int,
    current_user: User = Depends(get_current_user)
):
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    reservation = await CourtReservationDAO.find_by_id(id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    await CourtReservationDAO.delete(id=reservation_id)
    return {"message": "Бронирование отменено"}

@router.post("/create_by_admin", response_model=CourtReservation_response)
async def create_by_admin(
    data: CourtReservationCreate,
    current_user: User = Depends(get_current_user)
):
    court = await CourtDAO.find_one_or_none(id=data.court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Корт не найден")
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    is_exists = await CourtReservationDAO.find_one_or_none(date=data.date, time=data.time, court_id=data.court_id)
    if is_exists:
        raise HTTPException(status_code=400, detail="Время уже занято")
    user = await UsersDao.find_one_or_none(email=data.email) 
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    reservation = await CourtReservationDAO.add(user_id=user.id, date=data.date, time=data.time, court_id=data.court_id, is_confirmed=True)
    return reservation

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.court_reservation.dao import CourtReservationDAO
from app.court_reservation.model import CourtReservation
from app.courts.dao import CourtDAO
from app.users.model import User
from app.court_reservation.schemas import AdminListCourtReservation, ListCourtReservation, CourtReservationCreate, CourtReservationUpdate, CourtReservation_response, CourtReservationCreateByAdmin, CourtResrvationPayment    
from app.users.dependencies import get_current_user
from datetime import date, datetime
from app.users.dao import UsersDao
from app.tasks.tasks import cancel_if_not_confirmed
from datetime import date
from app.payments.service import create_payment, verify_rental_signature
import json
from app.config import settings
router = APIRouter(
    prefix="/court_reservations",
    tags=["court_reservations"]
)
from yookassa import Configuration, Payment

@router.get("/all/{date}", response_model=ListCourtReservation | None)
async def get_court_reservations(
    date: date):
    courts_reservations = await CourtReservationDAO.find_all(date=date)
    return {"items": courts_reservations, "total": len(courts_reservations)}

@router.get("/all_admin/{date}", response_model=AdminListCourtReservation | None)
async def get_court_reservations(
    date: date):
    courts_reservations = await CourtReservationDAO.find_all(date=date)
    return {"items": courts_reservations, "total": len(courts_reservations)}


@router.post("/temporary", response_model=CourtResrvationPayment)
async def create_temporary_reservation(
    data: CourtReservationCreate,
    current_user: User = Depends(get_current_user)
):
    if data.time < 10 or data.time > 21:
        raise HTTPException(status_code=400, detail="Время должно быть в диапазоне от 10 до 21")
    if data.date < date.today():
        raise HTTPException(status_code=400, detail="Дата должна быть больше текущей")
    court = await CourtDAO.find_one_or_none(id=data.court_id)
    if not court:
        raise HTTPException(status_code=404, detail="Корт не найден")
    is_exists = await CourtReservationDAO.find_one_or_none(date=data.date, time=data.time, court_id=data.court_id)
    if is_exists:
        raise HTTPException(status_code=400, detail="Время уже занято")
    reservation = await CourtReservationDAO.add(user_id=current_user.id, date=data.date, time=data.time, court_id=data.court_id)
    payment = create_payment(amount=court.price, rental_id=reservation.id, url=f"https://skkrondo.ru/courts", description=f"Оплата бронирования на корт {court.name} {data.date} {data.time}:00")
    await CourtReservationDAO.update(id=reservation.id, field="payment_id", data=payment[1])
    print(payment[1])
    cancel_if_not_confirmed.apply_async((reservation.id,), countdown=60*15)
    return {"payment_url": payment[0]}
     

@router.post("/{reservation_id}/confirm", response_model=CourtReservation_response)
async def confirm_reservation(
    reservation_id: int,
    current_user: User = Depends(get_current_user)
):
    reservation = await CourtReservationDAO.find_one_or_none(id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    if current_user.admin_status != "admin":
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

@router.delete("/cancel_by_admin/{reservation_id}")
async def cancel_by_admin(
    reservation_id: int,
    current_user: User = Depends(get_current_user)
):
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    reservation = await CourtReservationDAO.find_one_or_none(id=reservation_id)
    if not reservation:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    await CourtReservationDAO.delete(id=reservation_id)
    return {"message": "Бронирование отменено"}

@router.post("/create_by_admin", response_model=CourtReservation_response)
async def create_by_admin(
    data: CourtReservationCreateByAdmin,
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


@router.post("/yookassa/webhook")
async def yookassa_webhook(request: Request):
    data = await request.json()
    print("Получен вебхук от ЮKassa:", data)

    # Проверяем наличие необходимых полей
    if not data.get("object"):
        raise HTTPException(status_code=400, detail="Invalid webhook data")

    payment = data["object"]
    try:
        payment_id = payment.get("id")
        pay = Payment.find_one(payment_id)
        payment_data = json.loads(pay.json())
        if payment_data["status"] != "succeeded":
            return {"status": "ignored"}
        rental_id = payment_data["metadata"]["rental_id"]
        await CourtReservationDAO.update(id=int(rental_id), field="is_confirmed", data=True)
    except Exception as e:
        print("Ошибка при получении id и metadata:", e)
        raise HTTPException(status_code=400, detail="Invalid webhook data")
        


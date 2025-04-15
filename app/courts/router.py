from fastapi import APIRouter, Depends, HTTPException, status
from app.courts.schemas import CourtCreate, CourtRead, CourtUpdate, CourtDelete, CourtList, CourtAddNotAvailableDate
from app.courts.model import Court
from app.courts.dao import CourtDAO
from app.users.dependencies import get_current_user
from app.users.model import User
from datetime import date
router = APIRouter(prefix="/courts", tags=["Теннисные корты"])

@router.post("/admin_create", response_model=CourtRead)
async def create_court(court: CourtCreate, current_user: User = Depends(get_current_user)):
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на создание корты")
    return await CourtDAO.add(name=court.name, description=court.description, price=court.price, is_available=court.is_available, not_available_dates=court.not_available_dates)

@router.get("/", response_model=CourtList)
async def get_courts():
    courts = await CourtDAO.find_all()
    return {"items": courts, "total": len(courts)}

@router.get("/{court_id}", response_model=CourtRead)
async def get_court(court_id: int):
    court = await CourtDAO.find_one_or_none(id=court_id)
    if not court:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Корт не найден")
    return court

@router.put("/{court_id}", response_model=CourtRead)
async def update_court(court_id: int, court_update: CourtUpdate, current_user: User = Depends(get_current_user)):
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на обновление корты")
    existing_court = await CourtDAO.find_one_or_none(id=court_id)
    if not existing_court:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Корт не найден")
    return await CourtDAO.update_court(court_id, court_update.name, court_update.description, court_update.price, court_update.is_available, court_update.not_available_dates)

@router.delete("/{court_id}", response_model=CourtDelete)
async def delete_court(court_id: int, current_user: User = Depends(get_current_user)):
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на удаление корты")
    court = await CourtDAO.find_one_or_none(id=court_id)
    if not court:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Корт не найден")
    await CourtDAO.delete(id=court_id)
    return {"message": "Корт успешно удален"}

@router.post("/{court_id}/add_not_available_date")
async def add_not_available_date(court_id: int, court_add_not_available_date: CourtAddNotAvailableDate, current_user: User = Depends(get_current_user)):
    if current_user.admin_status != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на добавление недоступной даты")
    court_id = await CourtDAO.find_one_or_none(id=court_id)
    if not court_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Корт не найден")
    await CourtDAO.add_not_available_date(court_id.id, court_add_not_available_date.not_available_date)
    return {"message": "Недоступная дата успешно добавлена"}





    
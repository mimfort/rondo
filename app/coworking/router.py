from fastapi import APIRouter, Depends, HTTPException, status
from app.coworking.dao import CoworkingDAO
from app.coworking.schemas import CoworkingCreate, CoworkingRead, CoworkingUpdate, CoworkingList
from app.users.dependencies import get_current_user
from app.users.model import User


router = APIRouter(prefix="/coworking", tags=["Коворкинг"])

@router.get("/get_all_coworking", response_model=CoworkingList)
async def get_all_coworking():
    coworking = await CoworkingDAO.find_all()
    return {"items":coworking}


@router.post("/", response_model=CoworkingRead)
async def create_coworking(
    coworking: CoworkingCreate,
    current_user: User = Depends(get_current_user)
):
    if not current_user.admin_status=="admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на создание коворкинга")
    return await CoworkingDAO.add(name=coworking.name, description=coworking.description, is_available=coworking.is_available)

@router.put("/{coworking_id}", response_model=CoworkingRead)
async def update_coworking(
    coworking_id: int,
    coworking: CoworkingUpdate,
    current_user: User = Depends(get_current_user)
):
    if not current_user.admin_status=="admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на обновление коворкинга")
    coworking_data = await CoworkingDAO.find_one_or_none(id=coworking_id)
    if not coworking_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Коворкинг не найден")
    return await CoworkingDAO.update_coworking(coworking_id, name=coworking.name, description=coworking.description, is_available=coworking.is_available)

@router.delete("/{coworking_id}")
async def delete_coworking(
    coworking_id: int,
    current_user: User = Depends(get_current_user)
):
    if not current_user.admin_status=="admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="У вас нет прав на удаление коворкинга")
    coworking_data = await CoworkingDAO.find_one_or_none(id=coworking_id)
    if not coworking_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Коворкинг не найден")
    await CoworkingDAO.delete(coworking_id)
    return {"message":"Коворкинг удален"}


@router.get("/{coworking_id}", response_model=CoworkingRead)
async def get_coworking(coworking_id: int):
    coworking = await CoworkingDAO.find_one_or_none(id=coworking_id)
    if not coworking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Коворкинг не найден")
    return coworking



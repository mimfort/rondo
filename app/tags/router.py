from fastapi import APIRouter, Depends, HTTPException, status, Form
from app.tags.model import Tag
from app.tags.dao import TagDao
from app.tags.schemas import TagsResponse, TagResponse, TagCreate, TagUpdate
from app.users.dependencies import get_current_user
from app.users.model import User
router = APIRouter(prefix="/tags", tags=["Тэги"])

@router.get("/all", response_model=TagsResponse)
async def get_all_tags():
    """Получаем все тэги"""
    res = await TagDao.find_all()
    if res == []:
        return {"tags":[]}#TagsResponse(tags=[])
    return {"tags":res}#TagsResponse(tags=res)

@router.get("/{tag_id}", response_model=TagResponse)
async def get_tag_info(tag_id: int):
    tag = await TagDao.find_one_or_none(id=tag_id)
    if not tag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Тэг не найден")
    return tag


@router.post("/create", response_model=TagResponse)
async def create_tag(
    name: str,
    current_user: User = Depends(get_current_user)
):
    """
    Создание нового тега
    """
    if current_user.admin_status != "admin":
        raise HTTPException(
            status_code=403,
            detail="Недостаточно прав для выполнения операции"
        )

    try:
        new_tag = await TagDao.add(name=name)
        return new_tag
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка при создании тега: {str(e)}"
        )

@router.put("/update/{tag_id}", response_model=TagUpdate)
async def update_tag(
    tag_id: int,
    name: str ,
    description: str|None ,
    current_user: User = Depends(get_current_user)):
    if current_user.admin_status!="admin":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="у вас нет прав")
    tag = await TagDao.find_one_or_none(id=tag_id)
    if not tag:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Тэг не найден")
    tag = await TagDao.update_tag(tag_id, name, description)
    return tag

@router.delete("/delete/{tag_id}")
async def delete_tag(tag_id: int, current_user: User = Depends(get_current_user)):
    """Удалить тег"""
    if current_user.admin_status != "admin":
        raise HTTPException(
            status_code=403, detail="У вас нет прав для удаления тегов"
        )

    tag = await TagDao.find_one_or_none(id=tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Тег не найден")

    try:
        await TagDao.delete_tag(tag_id)
        return {"message": "Тег успешно удален"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ошибка при удалении тега: {str(e)}"
        )
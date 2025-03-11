from fastapi import APIRouter, Response, Request, Depends
from pydantic import EmailStr
from app.users.model import User
from app.users.schemas import RegistrationModel, UserResponse, UserCreateResponse, UserAuthResponse
from app.users.dao import UsersDao
from app.exceptions import UserAlreadyExist, UsernameAlreadyExist
from app.users.auth import get_password_hash, create_access_token, auth_user
from app.exceptions import UserIsNotPresentException
from app.users.dependencies import get_current_user, get_token

router = APIRouter(
    prefix='/users',
    tags=["Пользователи"]
)

@router.post('/registration',response_model=UserCreateResponse)
async def registration(user_data: RegistrationModel):
    user = await UsersDao.find_one_or_none(email=user_data.email)
    if user:
        raise UserAlreadyExist
    is_busy_username = await UsersDao.find_one_or_none(username=user_data.username)
    if is_busy_username:
        raise UsernameAlreadyExist
    new_user = await UsersDao.add(username=user_data.username,
                                  email=user_data.email,
                                  hashed_password=get_password_hash(user_data.password)
                                  )
    if new_user:
        return {"msg":"Пользователь создан", "user":new_user}
    else:
        return "Не создан"
    

@router.post("/auth")
async def login(response: Response, auth_model: UserAuthResponse):
    user = await auth_user(email=auth_model.email, password=auth_model.password)
    if user:
        cookie = create_access_token({"sub": str(user.id)})
        
        response.set_cookie("_user_cookie", cookie, httponly=True)
        return "Вы вошли в свою учетную запись"
    return "Вы не смогли войти в аккаунт"

@router.get("/quit")
async def quit_account(response: Response):
    response.delete_cookie("_user_cookie")

@router.get("/me")
async def about_me(response: Response,
                   current_user: User = Depends(get_current_user)):
    return {"email":current_user.email, "username":current_user.username, "avatar_url":current_user.avatar_url, "created_at": current_user.created_at}
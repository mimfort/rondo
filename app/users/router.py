from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse

from app.exceptions import UserAlreadyExist, UsernameAlreadyExist
from app.tasks.tasks import send_login_email, send_welcome_email
from app.users.auth import auth_user, create_access_token, get_password_hash
from app.users.dao import UsersDao
from app.users.dependencies import get_current_user
from app.users.model import User
from app.users.schemas import RegistrationModel, UserAuthResponse, UserCreateResponse

router = APIRouter(prefix="/users", tags=["Пользователи"])


@router.options("/registration")
async def registration_options():
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
        },
    )


@router.post("/registration", response_model=UserCreateResponse)
async def registration(user_data: RegistrationModel):
    user = await UsersDao.find_one_or_none(email=user_data.email)
    if user:
        raise UserAlreadyExist
    is_busy_username = await UsersDao.find_one_or_none(username=user_data.username)
    if is_busy_username:
        raise UsernameAlreadyExist
    new_user = await UsersDao.add(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
    )
    if new_user:
        send_welcome_email.delay(to=user_data.email, username=user_data.username)
        return {"msg": "Пользователь создан", "user": new_user}
    else:
        return "Не создан"


@router.post("/auth")
async def login(response: Response, auth_model: UserAuthResponse):
    user = await auth_user(email=auth_model.email, password=auth_model.password)
    if user:
        cookie = create_access_token({"sub": str(user.id)})

        response.set_cookie("_user_cookie", cookie, httponly=True)
        send_login_email.delay(to=user.email, username=user.username)
        return "Вы вошли в свою учетную запись"
    return "Вы не смогли войти в аккаунт"


@router.get("/quit")
async def quit_account(response: Response):
    response.delete_cookie("_user_cookie")


@router.get("/me")
async def about_me(response: Response, current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "username": current_user.username,
        "avatar_url": current_user.avatar_url,
        "created_at": current_user.created_at,
        "admin_status": current_user.admin_status,
    }

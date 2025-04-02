from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse

from app.exceptions import InvalidTokenException, UserAlreadyExist, UserIsNotActiveException, UserIsNotPresentException, UsernameAlreadyExist
from app.tasks.tasks import send_confirm_email, send_forgot_password_email, send_login_email, send_welcome_email
from app.users.auth import auth_user, confirm_reset_token, confirm_token, create_access_token, generate_reset_token, get_password_hash
from app.users.dao import UsersDao
from app.users.dependencies import get_current_user
from app.users.model import User
from app.users.schemas import RegistrationModel, ResetPassword, ResetRequest, UpdateProfile, UserAuthResponse, UserCreateResponse

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
        is_active=False
    )
    if new_user:
        send_welcome_email.delay(to=user_data.email, username=user_data.username)
        return {"msg": "Пользователь создан", "user": new_user}
    else:
        return "Не создан"


@router.post("/auth")
async def login(response: Response, auth_model: UserAuthResponse):
    user = await auth_user(email=auth_model.email, password=auth_model.password)
    print(user.is_active)
    print(type(user.is_active))
    if user.is_active==False:
        send_confirm_email.delay(to=user.email, username=user.username)
        raise UserIsNotActiveException
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
        "is_active": current_user.is_active,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
    }

@router.get("/confirm/{token}")
async def confirm_email(token: str):
    email = confirm_token(token)
    if not email:
        raise InvalidTokenException

    user = await UsersDao.find_one_or_none(email=email)
    if not user:
        raise UserIsNotPresentException

    await UsersDao.update(id=user.id, field="is_active", data=True)
    return {"msg": "Почта подтверждена"}


@router.post("/forgot_password")
async def forgot_password(reset_request: ResetRequest):
    user = await UsersDao.find_one_or_none(email=reset_request.email)
    if not user:
        raise UserIsNotPresentException
    token = generate_reset_token(user.email)
    send_forgot_password_email.delay(to=user.email, username=user.username, token=token)
    return {"msg": "Письмо с инструкциями по сбросу пароля отправлено"}

@router.post("/reset-password")
async def reset_password(reset_password: ResetPassword):
    email = confirm_reset_token(reset_password.token)
    if not email:
        raise InvalidTokenException
    user = await UsersDao.find_one_or_none(email=email)
    if not user:
        raise UserIsNotPresentException
    await UsersDao.update(id=user.id, field="hashed_password", data=get_password_hash(reset_password.new_password))
    return {"msg": "Пароль сброшен"}

@router.post("/update-profile")
async def update_profile(update_profile: UpdateProfile, current_user: User = Depends(get_current_user)):
    await UsersDao.update(id=current_user.id, field="first_name", data=update_profile.first_name)
    await UsersDao.update(id=current_user.id, field="last_name", data=update_profile.last_name)
    return {"msg": "Профиль обновлен"}


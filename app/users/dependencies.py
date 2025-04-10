from datetime import UTC, datetime

from fastapi import Depends, Request
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import async_session_maker
from app.exceptions import (
    ExpiredTokenException,
    IncorrectTokenFormatException,
    TokenAbsentException,
    UserIsNotPresentException,
)
from app.users.dao import UsersDao


def get_token(request: Request):
    token = request.cookies.get("_user_cookie")
    if not token:
        raise TokenAbsentException
    return token


async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.HASH_ALGO)
    except JWTError:
        raise IncorrectTokenFormatException

    expire: str = payload.get("exp")
    if not expire or (int(expire) < datetime.now(UTC).timestamp()):
        raise ExpiredTokenException

    user_id: str = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException

    user = await UsersDao.find_by_id(int(user_id))
    if not user:
        raise UserIsNotPresentException

    return user


async def get_async_session() -> AsyncSession:

    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()  # Коммит при успешном выполнении
        except Exception as e:
            await session.rollback()  # Откат при ошибке
            raise e
        finally:
            await session.close()  # Всегда закрываем сессию

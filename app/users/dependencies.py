from fastapi import Depends, Request 
from jose import jwt, JWTError 
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import async_session_maker
from app.exceptions import *
from app.config import settings
from app.users.dao import UsersDao
from datetime import datetime
import pytz

def get_token(request: Request):
    token = request.cookies.get("_user_cookie")
    if not token:
        raise TokenAbsentException
    return token


def format_datetime_moscow(dt: datetime) -> str:
    # Переводим дату в московский часовой пояс
    moscow_tz = pytz.timezone("Europe/Moscow")
    dt_msk = dt.astimezone(moscow_tz)
    
    # Форматируем дату в нужный вид
    months = {
        1: "января", 2: "февраля", 3: "марта", 4: "апреля",
        5: "мая", 6: "июня", 7: "июля", 8: "августа",
        9: "сентября", 10: "октября", 11: "ноября", 12: "декабря"
    }
    
    day = dt_msk.day
    month = months[dt_msk.month]
    time = dt_msk.strftime("%H:%M")  # Часы и минуты

    return f"{day} {month} в {time} МСК"

async def get_current_user(token: str = Depends(get_token)):
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, settings.HASH_ALGO
        )
    except JWTError:
        raise IncorrectTokenFormatException

    expire: str = payload.get("exp")
    if not expire or (int(expire) < datetime.now(timezone.utc).timestamp()):
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

from datetime import UTC, datetime, timedelta

from argon2 import PasswordHasher
from jose import jwt
from pydantic import EmailStr

from app.config import settings
from app.exceptions import IncorrectEMailOrPasswordException
from app.users.dao import UsersDao
from itsdangerous import URLSafeTimedSerializer
import secrets
pwd_context = PasswordHasher()


def get_password_hash(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(hashed_password, plain_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(UTC) + timedelta(minutes=60*8)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.HASH_ALGO
    )
    return encode_jwt


async def auth_user(email: EmailStr, password: str):
    user = await UsersDao.find_one_or_none(email=email)
    try:
        if user and verify_password(password, user.hashed_password):
            return user
    except Exception:
        raise IncorrectEMailOrPasswordException
    

SECRET_KEY = settings.SECRET_KEY
serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_confirmation_token(email: str) -> str:
    return serializer.dumps(email, salt="email-confirm")


def confirm_token(token: str, expiration: int = 3600) -> str | None:
    try:
        email = serializer.loads(token, salt="email-confirm", max_age=expiration)
        return email
    except Exception:
        return None
    
def generate_reset_token(email: str) -> str:
    return serializer.dumps(email, salt="forgot-password")

def confirm_reset_token(token: str, expiration: int = 3600) -> str | None:
    try:
        email = serializer.loads(token, salt="forgot-password", max_age=expiration)
        return email
    except Exception:
        return None

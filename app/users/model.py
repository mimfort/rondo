from sqlalchemy import String, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from pydantic import EmailStr
from datetime import datetime
from app.database import Base



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[EmailStr] = mapped_column(String(255), index=True, unique=True)
    username: Mapped[str] = mapped_column(String(255), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    avatar_url: Mapped[str] = mapped_column(String(2048), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    admin_status: Mapped[str] = mapped_column(String(255), nullable=False, server_default="user")
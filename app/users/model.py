# model.py (User)
from sqlalchemy import String, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from pydantic import EmailStr
from datetime import datetime
from app.database import Base
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.registration.model import Registration
    from app.additional_registration.model import Registration_additional

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

    # Relationships
    registrations: Mapped[list["Registration"]] = relationship(back_populates="user")
    additional_registrations: Mapped[list["Registration_additional"]] = relationship(back_populates="user")
    def __str__(self):
        return f"Пользователь {self.username}"
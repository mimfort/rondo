# model.py (User)
from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlalchemy import String, func, text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[EmailStr] = mapped_column(String(255), index=True, unique=True)
    username: Mapped[str] = mapped_column(String(255), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    avatar_url: Mapped[str] = mapped_column(String(2048), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=text("false"), default=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    admin_status: Mapped[str] = mapped_column(
        String(255), nullable=False, server_default="user"
    )
    first_name: Mapped[str] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relationships
    registrations = relationship("Registration", back_populates="user")
    registration_additional = relationship("Registration_additional", back_populates="user")
    coworking_reservations: Mapped[list["CoworkingReservation"]] = relationship(
        back_populates="user", lazy="selectin", cascade="all, delete"
    )

    court_reservations: Mapped[list["CourtReservation"]] = relationship(
        back_populates="user", 
        lazy="selectin", 
        cascade="all, delete"
    )

    def __str__(self):
        return f"Пользователь {self.username}"

# Импорты после определения всех моделей
from app.registration.model import Registration
from app.coworking_reservation.model import CoworkingReservation
from app.court_reservation.model import CourtReservation
from app.additional_registration.model import Registration_additional

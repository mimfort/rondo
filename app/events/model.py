# model.py (Event)
from datetime import datetime
from typing import List, Optional
from sqlalchemy import DateTime, String, Text, func, select, Integer, text, ForeignKey, Boolean, Float
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import Mapped, mapped_column, relationship, column_property
from sqlalchemy.ext.asyncio import AsyncSession

from app.additional_registration.model import Registration_additional
from app.database import Base
from app.registration.model import Registration


class Event(Base):
    __tablename__ = "event"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    media_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    max_members: Mapped[int] = mapped_column(Integer)
    location: Mapped[str] = mapped_column(String(255))
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    additional_members: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    count_members: Mapped[int] = mapped_column(Integer, default=0)
    # Relationships
    registrations: Mapped[List["Registration"]] = relationship(back_populates="event", cascade="all, delete-orphan")
    registration_additional: Mapped[List["Registration_additional"]] = relationship(back_populates="event", cascade="all, delete-orphan")



    def __repr__(self):
        return f"<Event {self.title}>"

    def __str__(self):
        return f"Ивент №{self.id}-{self.title}"

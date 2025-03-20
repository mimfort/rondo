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

    # Relationships
    registrations: Mapped[List["Registration"]] = relationship(back_populates="event", cascade="all, delete-orphan")
    registration_additional: Mapped[List["Registration_additional"]] = relationship(back_populates="event", cascade="all, delete-orphan")

    @hybrid_property
    def registration_count(self) -> int:
        """Получает количество регистраций из материализованного представления"""
        return self._get_registration_count()

    @registration_count.expression
    def registration_count(cls):
        return select(func.coalesce(
            select(func.count())
            .select_from(Event.__table__.join(
                "event_registration_counts",
                Event.__table__.c.id == "event_registration_counts.event_id",
                isouter=True
            ))
            .scalar_subquery(),
            0
        )).scalar_subquery()

    async def _get_registration_count(self) -> int:
        """Асинхронно получает количество регистраций из материализованного представления"""
        from sqlalchemy import text
        from app.database import async_session
        
        async with async_session() as session:
            result = await session.execute(
                text("SELECT registration_count FROM event_registration_counts WHERE event_id = :event_id"),
                {"event_id": self.id}
            )
            row = result.first()
            return row[0] if row else 0

    def __repr__(self):
        return f"<Event {self.title}>"

    def __str__(self):
        return f"Ивент №{self.id}-{self.title}"

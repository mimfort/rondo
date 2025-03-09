from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, column_property
from sqlalchemy import String, Text, DateTime, func,select
from app.database import Base
from app.registration.model import Registration

class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)  # Название мероприятия
    description: Mapped[str] = mapped_column(Text)  # Описание
    
    media_url: Mapped[str | None] = mapped_column(nullable=True)
    max_members: Mapped[int] = mapped_column(nullable=False)
    additional_members: Mapped[int | None] = mapped_column(nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)  # Место проведения
    
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    registration_count = column_property(
        select(func.count(Registration.id)).where(Registration.event_id == id).scalar_subquery()
    )
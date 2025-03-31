# model.py (Event)
from datetime import datetime, UTC
from typing import List, Optional

from sqlalchemy import DateTime, String, Text, func, select, Boolean, Integer, text
from sqlalchemy.orm import Mapped, column_property, mapped_column, relationship

from app.additional_registration.model import Registration_additional
from app.database import Base
from app.registration.model import Registration
from app.event_tags.model import EventTag
from app.tags.model import Tag


class Event(Base):
    __tablename__ = "event"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    media_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    max_members: Mapped[int] = mapped_column(Integer, nullable=False)
    count_members: Mapped[int] = mapped_column(Integer, default=0)
    additional_members: Mapped[int] = mapped_column(Integer, default=0)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("TIMEZONE('Europe/Moscow', CURRENT_TIMESTAMP)")
    )
    
    end_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text('CURRENT_TIMESTAMP AT TIME ZONE \'UTC\'')
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=text('CURRENT_TIMESTAMP AT TIME ZONE \'UTC\''), onupdate=text('CURRENT_TIMESTAMP AT TIME ZONE \'UTC\'')
    )

    # Relationships
    registrations: Mapped[list["Registration"]] = relationship(back_populates="event")
    registration_additional: Mapped[list["Registration_additional"]] = relationship(
        back_populates="event"
    )
    event_tags: Mapped[List["EventTag"]] = relationship(
        "EventTag",
        back_populates="event",
        cascade="all, delete-orphan",
        overlaps="tags"
    )
    tags: Mapped[List["Tag"]] = relationship(
        "Tag",
        secondary="event_tags",
        back_populates="events",
        overlaps="event_tags,event,tag"
    )

    registration_count = column_property(
        select(func.count(Registration.id))
        .where(Registration.event_id == id)
        .scalar_subquery()
    )

    def __str__(self):
        return f"Ивент №{self.id}-{self.title}"

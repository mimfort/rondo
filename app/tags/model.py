from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime
from typing import List
from app.event_tags.model import EventTag
from datetime import datetime


class Tag(Base):
    __tablename__ = "tag"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Отношения
    event_tags: Mapped[List["EventTag"]] = relationship(
        "EventTag",
        back_populates="tag",
        cascade="all, delete-orphan",
        overlaps="events"
    )
    events: Mapped[List["Event"]] = relationship(
        "Event",
        secondary="event_tags",
        back_populates="tags",
        overlaps="event_tags,event,tag"
    )
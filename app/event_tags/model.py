from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from app.events.model import Event
    from app.tags.model import Tag


class EventTag(Base):
    __tablename__ = "event_tags"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), index=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tag.id"), index=True)
    
    # Связи с моделями
    event = relationship("Event", back_populates="event_tags")
    tag = relationship("Tag", back_populates="event_tags")
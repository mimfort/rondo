from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from typing import List


class EventTag(Base):
    __tablename__ = "event_tags"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), index=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tag.id"), index=True)
    
    # Связи с моделями
    event: Mapped["Event"] = relationship(back_populates="event_tags")
    tag: Mapped["Tag"] = relationship(back_populates="event_tags")
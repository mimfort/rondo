# model.py (Event)
from datetime import datetime

from sqlalchemy import DateTime, String, Text, func, select
from sqlalchemy.orm import Mapped, column_property, mapped_column, relationship

from app.additional_registration.model import Registration_additional
from app.database import Base
from app.registration.model import Registration


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    media_url: Mapped[str | None] = mapped_column(nullable=True)
    max_members: Mapped[int] = mapped_column(nullable=False)
    additional_members: Mapped[int | None] = mapped_column(nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    end_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    registrations: Mapped[list["Registration"]] = relationship(back_populates="event")
    additional_registrations: Mapped[list["Registration_additional"]] = relationship(
        back_populates="event"
    )

    registration_count = column_property(
        select(func.count(Registration.id))
        .where(Registration.event_id == id)
        .scalar_subquery()
    )

    def __str__(self):
        return f"Ивент №{self.id}-{self.title}"

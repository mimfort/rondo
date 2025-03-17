# model.py (Registration_additional)
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.users.model import User

if TYPE_CHECKING:
    from app.events.model import Event


class Registration_additional(Base):
    __tablename__ = "registration_additional"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="additional_registrations")
    event: Mapped["Event"] = relationship(back_populates="additional_registrations")

    def __str__(self):
        return f"Юзер{self.user_id} предзапись на ивент {self.event_id}"

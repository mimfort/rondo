# model.py (Registration_additional)
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.events.model import Event
    from app.users.model import User


class Registration_additional(Base):
    __tablename__ = "registration_additional"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    event_id: Mapped[int] = mapped_column(ForeignKey("event.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="registration_additional")
    event: Mapped["Event"] = relationship(back_populates="registration_additional")

    def __str__(self):
        return f"Юзер{self.user_id} предзапись на ивент {self.event_id}"

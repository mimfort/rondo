from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean
from sqlalchemy.orm import relationship
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.coworking_reservation.model import CoworkingReservation
class Coworking(Base):
    __tablename__ = "coworking"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    reservations: Mapped[list["CoworkingReservation"]] = relationship(
        back_populates="coworking", lazy="selectin", cascade="all, delete"
    )
from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship
from app.users.model import User
from app.coworking.model import Coworking
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.users.model import User
    from app.coworking.model import Coworking
class CoworkingReservation(Base):
    __tablename__ = "coworking_reservation"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    coworking_id: Mapped[int] = mapped_column(ForeignKey("coworking.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    start_time: Mapped[datetime|None] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime|None] = mapped_column(DateTime(timezone=True))
    user: Mapped["User"] = relationship("User", back_populates="coworking_reservations", lazy="selectin", cascade="all, delete")
    coworking: Mapped["Coworking"] = relationship("Coworking", back_populates="reservations", lazy="selectin", cascade="all, delete")

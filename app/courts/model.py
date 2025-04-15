from sqlalchemy import Integer, String, Boolean, Column, ForeignKey, DateTime, Float, ARRAY, Date
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import datetime, date
from app.database import Base
from app.court_reservation.model import CourtReservation
class Court(Base):
    __tablename__ = "courts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    not_available_dates: Mapped[list[date]] = mapped_column(ARRAY(Date), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)
    reservations: Mapped[list["CourtReservation"]] = relationship(
        back_populates="court", 
        lazy="selectin", 
        cascade="all, delete"
    )
    def __repr__(self):
        return f"<Court(id={self.id}, name='{self.name}', price={self.price})>"
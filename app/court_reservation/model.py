from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime, date

class CourtReservation(Base):
    __tablename__ = "court_reservations"

    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, ForeignKey("courts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)
    time = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_confirmed = Column(Boolean, default=False)

    court = relationship("Court", back_populates="reservations", lazy="selectin")
    user = relationship("User", back_populates="court_reservations", lazy="selectin")

    def __repr__(self):
        return f"<CourtReservation(id={self.id}, court_id={self.court_id}, user_id={self.user_id}, date={self.date}, time={self.time})>"

# Импорты после определения всех моделей
from app.courts.model import Court
from app.users.model import User
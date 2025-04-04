from app.dao.base import BaseDAO
from app.coworking_reservation.model import CoworkingReservation
from app.database import async_session_maker
from sqlalchemy import select

class CoworkingReservationDAO(BaseDAO):
    model = CoworkingReservation
    
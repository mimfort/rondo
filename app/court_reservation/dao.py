from app.dao.base import BaseDAO
from app.court_reservation.model import CourtReservation
from app.court_reservation.schemas import CourtReservationCreate
from sqlalchemy import select, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional

class CourtReservationDAO(BaseDAO):
    model = CourtReservation

   
    
    
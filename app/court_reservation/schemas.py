from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from datetime import date
class CourtReservationBase(BaseModel):
    court_id: int
    date: date
    time: int

class CourtReservationCreate(CourtReservationBase):
    pass

class CourtReservationCreateByAdmin(CourtReservationBase):
    email: str

class CourtReservationUpdate(BaseModel):
    is_confirmed: bool

class CourtReservation_response(CourtReservationBase):
    id: int
    user_id: int
    created_at: datetime
    is_confirmed: bool

class CourtResrvationPayment(BaseModel):
    payment_url: str

    class Config:
        from_attributes = True

class CourtReservationDelete(BaseModel):
    id: int

class ListCourtReservation(BaseModel):
    items: list[CourtReservation_response]
    total: int



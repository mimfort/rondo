from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from datetime import date
from pydantic import BaseModel, field_validator
from datetime import datetime, timedelta
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

class UserInfo(BaseModel):
    email: str
    last_name: str|None
    first_name: str|None

class CourtReservation_response(CourtReservationBase):
    id: int
    user_id: int
    created_at: datetime
    is_confirmed: bool
    @field_validator("created_at", mode="before")
    def adjust_created_at(cls, value):
        """Добавляет смещение +3 часа к created_at."""
        if isinstance(value, datetime):
            return value + timedelta(hours=3)
        return value

    class Config:
        from_attributes = True



class AdminCourtReservationresponse(CourtReservationBase):
    id: int
    user_id: int
    created_at: datetime
    is_confirmed: bool
    user: UserInfo
    @field_validator("created_at", mode="before")
    def adjust_created_at(cls, value):
        """Добавляет смещение +3 часа к created_at."""
        if isinstance(value, datetime):
            return value + timedelta(hours=3)
        return value

    class Config:
        from_attributes = True
  
class CourtResrvationPayment(BaseModel):
    payment_url: str

    class Config:
        from_attributes = True

class CourtReservationDelete(BaseModel):
    id: int

class ListCourtReservation(BaseModel):
    items: list[CourtReservation_response]
    total: int

class AdminListCourtReservation(BaseModel):
    items: list[AdminCourtReservationresponse]
    total: int



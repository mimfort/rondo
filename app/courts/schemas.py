from pydantic import BaseModel
from datetime import date

class CourtCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    is_available: bool
    not_available_dates: list[date] | None = None

    class Config:
        from_attributes = True

class CourtRead(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    is_available: bool
    not_available_dates: list[date] | None = None
    class Config:
        from_attributes = True

class CourtUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    is_available: bool | None = None
    not_available_dates: list[date] | None = None

    class Config:
        from_attributes = True

class CourtDelete(BaseModel):
    message: str

 
class CourtList(BaseModel):
    items: list[CourtRead]|None
    total: int

    class Config:
        from_attributes = True

class CourtAddNotAvailableDate(BaseModel):
    not_available_date: date



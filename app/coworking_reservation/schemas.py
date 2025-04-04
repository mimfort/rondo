from pydantic import BaseModel
from datetime import datetime
from typing import List
from app.coworking.schemas import CoworkingRead
from app.users.schemas import UserResponse
class CoworkingReservationCreate(BaseModel):
    coworking_id: int


class CoworkingReservationRead(BaseModel):
    id: int
    coworking_id: int
    user_id: int
    start_time: datetime
    end_time: datetime|None
    coworking: CoworkingRead

class CoworkingReservationList(BaseModel):
    items: List[CoworkingReservationRead]

class CoworkingReservationClose(BaseModel):
    coworking_id: int

class CoworkingReservationCloseAdmin(BaseModel):
    coworking_id: int   
    
class CoworkingReservationReadAdmin(BaseModel):
    id: int
    coworking_id: int
    user_id: int
    start_time: datetime
    end_time: datetime|None
    coworking: CoworkingRead
    user: UserResponse

class CoworkingReservationListAdmin(BaseModel):
    items: List[CoworkingReservationReadAdmin] 
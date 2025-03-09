from pydantic import BaseModel, Field
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: str = Field(min_length=1, max_length=2000)
    media_url: str|None
    max_members: int
    additional_members: int|None
    location: str|None
    start_time: datetime
    end_time: datetime|None


class EventCreate(EventBase):
    pass 

class EventUpdate(EventBase):
    pass 


class EventResponse(EventBase):
    id: int
    created_at: datetime


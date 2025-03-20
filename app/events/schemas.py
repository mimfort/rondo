from datetime import datetime

from pydantic import BaseModel, Field


class EventBase(BaseModel):
    title: str
    description: str = Field(min_length=1, max_length=2000)
    media_url: str | None
    max_members: int
    location: str | None
    start_time: datetime
    end_time: datetime | None


class EventCreate(EventBase):
    pass


class EventUpdate(EventBase):
    pass


class EventResponse(EventBase):
    id: int
    created_at: datetime

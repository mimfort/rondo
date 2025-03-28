from datetime import datetime, UTC
from pydantic import BaseModel, Field, field_validator
from typing import List


class EventBase(BaseModel):
    title: str
    description: str = Field(min_length=1, max_length=2000)
    media_url: str | None
    max_members: int
    location: str | None
    start_time: datetime
    end_time: datetime | None
    count_members: int

    @field_validator('start_time', 'end_time')
    def ensure_utc(cls, v):
        if v is not None and v.tzinfo is None:
            # Если время без часового пояса, считаем его UTC
            return v.replace(tzinfo=UTC)
        return v


class EventCreate(EventBase):
    pass


class EventUpdate(EventBase):
    pass


class EventResponse(EventBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
    additional_members: int
    tags: List[str]


class UploadedImage(BaseModel):
    url: str


class UploadedImagesResponse(BaseModel):
    images: List[str]

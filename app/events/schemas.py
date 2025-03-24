from datetime import datetime
from pydantic import BaseModel, Field
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

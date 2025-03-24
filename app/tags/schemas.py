from pydantic import BaseModel
from typing import List
from datetime import datetime


class TagBase(BaseModel):
    name: str


class TagCreate(TagBase):
    pass


class TagUpdate(TagBase):
    pass


class TagResponse(TagBase):
    id: int

    class Config:
        from_attributes = True


class TagsResponse(BaseModel):
    tags: List[TagResponse]

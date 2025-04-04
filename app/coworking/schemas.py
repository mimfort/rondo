from pydantic import BaseModel
from typing import List
class CoworkingCreate(BaseModel):
    name: str
    description: str
    is_available: bool

class CoworkingRead(BaseModel):
    id: int
    name: str
    description: str
    is_available: bool

class CoworkingUpdate(BaseModel):
    name: str
    description: str
    is_available: bool

class CoworkingList(BaseModel):
    items: List[CoworkingRead]

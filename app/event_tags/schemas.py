from pydantic import BaseModel

class EventTag(BaseModel):
    event_id: int
    tag_id: int
    
class EventTagResponse(EventTag):
    id: int
    
class EventTagList(BaseModel):
    event_tags: list[EventTagResponse]
    
class EventTag2List(BaseModel):
    events: list[EventTagResponse]
    
class EventTagCreate(EventTag):
    pass
    

from app.dao.base import BaseDAO
from app.event_tags.model import EventTag

class EventTagDao(BaseDAO):
    model = EventTag
    
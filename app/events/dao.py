from app.dao.base import BaseDAO
from app.events.model import Event


class EventDao(BaseDAO):
    model = Event

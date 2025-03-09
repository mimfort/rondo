from app.dao.base import BaseDAO
from app.registration.model import Registration

class RegistrationDao(BaseDAO):
    model = Registration
    # @classmethod
    # async def registration_on_event(cls,)
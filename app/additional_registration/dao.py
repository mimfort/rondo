from app.dao.base import BaseDAO
from app.additional_registration.model import Registration_additional
from sqlalchemy import insert, delete, select, update, func
from app.database import async_session_maker
class RegistrationAddDao(BaseDAO):
    model = Registration_additional
    @classmethod
    async def find_first_added(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by).order_by(cls.model.id.asc()).limit(1)
            result = await session.execute(query)
            return result.scalars().first()
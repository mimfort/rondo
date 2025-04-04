from app.dao.base import BaseDAO
from app.coworking.model import Coworking
from app.database import async_session_maker
from sqlalchemy import select

class CoworkingDAO(BaseDAO):
    model = Coworking
    @classmethod
    async def update_coworking(cls, coworking_id: int, name: str, description: str | None, is_available: bool):
        async with async_session_maker() as session:
            query = select(cls.model).where(cls.model.id == coworking_id)
            result = await session.execute(query)
            coworking = result.scalars().first()
            if not coworking:
                return None 
            if name:
                coworking.name = name
            if description:
                coworking.description = description
            coworking.is_available = is_available

            await session.commit()
            await session.refresh(coworking)  

            return coworking
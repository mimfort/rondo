from app.dao.base import BaseDAO
from app.courts.model import Court
from sqlalchemy import select
from app.database import async_session_maker 
from datetime import datetime, date

class CourtDAO(BaseDAO):
    model = Court
    @classmethod
    async def update_court(cls, court_id: int, name: str, description: str | None, price: float, is_available: bool, not_available_dates: list[datetime] | None):
        async with async_session_maker() as session:
            query = select(cls.model).where(cls.model.id == court_id)
            result = await session.execute(query)
            court = result.scalars().first()
            if not court:
                return None
            if name is not None:
                court.name = name
            if description is not None:
                court.description = description
            if price is not None:
                court.price = price
            if is_available is not None:
                court.is_available = is_available
            if not_available_dates is not None:
                court.not_available_dates = not_available_dates
            await session.commit()
            await session.refresh(court)
            return court
    @classmethod
    async def add_not_available_date(cls, court_id: int, not_available_date: date):
        async with async_session_maker() as session:
            query = select(cls.model).where(cls.model.id == court_id)
            result = await session.execute(query)
            court = result.scalars().first()
            if not court:
                return None
            if court.not_available_dates is None:
                court.not_available_dates = []
            if not_available_date not in court.not_available_dates:     
                court.not_available_dates = court.not_available_dates + [not_available_date]
            await session.commit()
            await session.refresh(court)
            return court
            
            

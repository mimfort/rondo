from app.dao.base import BaseDAO
from app.events.model import Event
from sqlalchemy.orm import joinedload
from sqlalchemy import select, delete
from app.database import async_session_maker
from typing import List, Optional
from app.event_tags.model import EventTag
from datetime import datetime


class EventDao(BaseDAO):
    model = Event

    @classmethod
    async def find_all_with_tags(cls, **filter_by):
        async with async_session_maker() as session:
            query = (
                select(cls.model)
                .filter_by(**filter_by)
                .order_by(cls.model.start_time.asc())  # Сортировка по времени начала
            )
            if hasattr(cls.model, 'tags'):
                query = query.options(joinedload(cls.model.tags))
            result = await session.execute(query)
            return result.unique().scalars().all()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        async with async_session_maker() as session:
            query = (
                select(cls.model)
                .options(joinedload(cls.model.tags))
                .filter_by(**filter_by)
            )
            result = await session.execute(query)
            return result.unique().scalars().one_or_none()

    @classmethod
    async def delete_event(cls, event_id: int) -> bool:
        """Удалить событие и все его связи"""
        async with async_session_maker() as session:
            try:
                # Удаляем все связанные записи из event_tags
                await session.execute(
                    delete(EventTag).where(EventTag.event_id == event_id)
                )
                await session.commit()

                # Удаляем сам event
                await session.execute(
                    delete(cls.model).where(cls.model.id == event_id)
                )
                await session.commit()
                return True
            except Exception as e:
                await session.rollback()
                raise e

    async def get_event_with_tags(self, event_id: int) -> Optional[Event]:
        """Получить событие с тегами"""
        query = select(self.model).where(self.model.id == event_id).options(
            selectinload(self.model.tags)
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    @classmethod
    async def add(cls, **kwargs):
        """
        Добавление записи в таблицу
        """
        print("Попытка добавления записи в таблицу event")
        print(f"Данные для вставки: {kwargs}")
        
        # Добавляем временные метки
        kwargs['created_at'] = datetime.now()
        kwargs['updated_at'] = datetime.now()
        
        try:
            async with async_session_maker() as session:
                event = cls.model(**kwargs)
                session.add(event)
                await session.commit()
                await session.refresh(event)
                return event
        except Exception as e:
            print(f"Ошибка при добавлении записи: {str(e)}")
            import traceback
            print(f"Полный стек ошибки: {traceback.format_exc()}")
            if 'session' in locals():
                await session.rollback()
            raise
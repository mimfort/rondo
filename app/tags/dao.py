from app.dao.base import BaseDAO
from app.tags.model import Tag
from app.database import async_session_maker
from sqlalchemy import select, delete
from app.event_tags.model import EventTag

class TagDao(BaseDAO):
    model = Tag
    @classmethod
    async def update_tag(cls, tag_id: int, name: str, description: str | None):
        async with async_session_maker() as session:
            query = select(cls.model).where(cls.model.id == tag_id)
            result = await session.execute(query)
            tag = result.scalars().first()
            if not tag:
                return None  
            tag.name = name
            tag.description = description

            await session.commit()
            await session.refresh(tag)  

            return tag

    @classmethod
    async def delete_tag(cls, tag_id: int) -> bool:
        """Удалить тег и все его связи"""
        async with async_session_maker() as session:
            try:
                # Удаляем все связанные записи из event_tags
                await session.execute(
                    delete(EventTag).where(EventTag.tag_id == tag_id)
                )
                await session.commit()

                # Удаляем сам тег
                await session.execute(
                    delete(cls.model).where(cls.model.id == tag_id)
                )
                await session.commit()
                return True
            except Exception as e:
                await session.rollback()
                raise e
            
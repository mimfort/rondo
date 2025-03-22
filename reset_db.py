import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings

async def reset_database():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.connect() as connection:
        # Удаляем все таблицы
        await connection.execute(text("DROP TABLE IF EXISTS registration CASCADE"))
        await connection.execute(text("DROP TABLE IF EXISTS registration_additional CASCADE"))
        await connection.execute(text("DROP TABLE IF EXISTS event CASCADE"))
        await connection.execute(text("DROP TABLE IF EXISTS events CASCADE"))
        await connection.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        await connection.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
        await connection.commit()

if __name__ == "__main__":
    asyncio.run(reset_database()) 
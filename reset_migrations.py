import asyncio
import asyncpg
from app.config import settings

async def reset_database():
    # Создаем подключение к базе данных
    conn = await asyncpg.connect(
        user=settings.DB_USER,
        password=settings.DB_PASS,
        database=settings.DB_NAME,
        host=settings.DB_HOST,
        port=settings.DB_PORT
    )
    
    try:
        # Удаляем таблицу alembic_version
        await conn.execute("DROP TABLE IF EXISTS alembic_version CASCADE")
        await conn.execute("DROP SCHEMA public CASCADE")
        await conn.execute("CREATE SCHEMA public")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(reset_database()) 
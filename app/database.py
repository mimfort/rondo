from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import NullPool
from app.config import settings

if settings.MODE == "TEST":
    DATABASE_URL = settings.TEST_DATABASE_URL
    DATABASE_PARAMS = {"poolclass":NullPool}
    
else:
    DATABASE_URL = settings.DATABASE_URL
    DATABASE_PARAMS = {}
    
async_engine = create_async_engine(
    DATABASE_URL,**DATABASE_PARAMS, echo=True, pool_pre_ping=True
)
async_session_maker = async_sessionmaker(
    bind=async_engine, expire_on_commit=False, autoflush=False, autocommit=False
)
class Base(DeclarativeBase):
    pass

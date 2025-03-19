import pytest
import json
from datetime import datetime
from sqlalchemy import insert, select
from httpx import AsyncClient, ASGITransport
from app.database import Base, async_session_maker, async_engine
from app.config import settings
from app.users.model import User
from app.events.model import Event
from app.registration.model import Registration
from app.additional_registration.model import Registration_additional
from app.main import app as fastapi_app
import asyncio

def parse_datetime(value: str):
    """Конвертирует строку в объект datetime."""
    try:
        return datetime.fromisoformat(value) if value else None
    except (ValueError, TypeError):
        return None

def open_mock_json(model: str):
    """Читает JSON и конвертирует даты."""
    try:
        with open(f"app/tests/mock_{model}.json", "r") as file:
            data = json.load(file)
            print(f"\nЗагружены raw-данные для {model}: {data}")
            
            datetime_fields = ["start_time", "end_time", "created_at", "updated_at"]
            for item in data:
                for field in datetime_fields:
                    if field in item:
                        item[field] = parse_datetime(item[field])
            
            print(f"Данные после парсинга ({model}): {data}")
            return data
    except Exception as e:
        pytest.fail(f"Ошибка в open_mock_json({model}): {str(e)}")

@pytest.fixture(scope="session", autouse=True)
async def prepare_database():
    """Фикстура для инициализации тестовой БД с данными"""
    assert settings.MODE == "TEST", "Должен использоваться TEST-режим"
    
    # Пересоздаем все таблицы
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Загружаем тестовые данные
    test_data = {
        "users": open_mock_json("users"),
        "events": open_mock_json("events"),
        "registration": open_mock_json("registration"),
        "additional_registration": open_mock_json("additional_registration"),
    }

    # Вставляем данные в правильном порядке зависимостей
    async with async_session_maker() as session:
        try:
            # 1. Пользователи
            if test_data["users"]:
                await session.execute(insert(User).values(test_data["users"]))
                await session.commit()
                print(f"\nДобавлено {len(test_data['users'])} пользователей")
                
                # Проверка вставки
                result = await session.execute(select(User))
                users_in_db = result.scalars().all()
                print(f"В БД находится {len(users_in_db)} пользователей")

            # 2. События
            if test_data["events"]:
                await session.execute(insert(Event).values(test_data["events"]))
                await session.commit()
                print(f"\nДобавлено {len(test_data['events'])} событий")

            # 3. Основные регистрации
            if test_data["registration"]:
                await session.execute(insert(Registration).values(test_data["registration"]))
                await session.commit()
                print(f"\nДобавлено {len(test_data['registration'])} регистраций")

            # 4. Дополнительные регистрации
            if test_data["additional_registration"]:
                await session.execute(insert(Registration_additional).values(test_data["additional_registration"]))
                await session.commit()
                print(f"\nДобавлено {len(test_data['additional_registration'])} доп. регистраций")

        except Exception as e:
            await session.rollback()
            pytest.fail(f"Ошибка при заполнении БД: {str(e)}")
        finally:
            await session.close()

    # Финальная проверка
    async with async_session_maker() as session:
        try:
            users_count = len((await session.execute(select(User))).scalars().all())
            events_count = len((await session.execute(select(Event))).scalars().all())
            print(f"\nФинальная проверка: {users_count} пользователей, {events_count} событий в БД")
        finally:
            await session.close()

@pytest.fixture(scope="function")
async def ac():
    """Фикстура для асинхронного клиента"""
    async with AsyncClient(
        transport=ASGITransport(app=fastapi_app),
        base_url="http://test"
    ) as client:
        yield client

# @pytest.fixture(scope="function", autouse=True)
# async def clear_cache():
#     """Очистка кеша перед каждым тестом"""
#     from fastapi_cache import caches
#     #from app.database import cache
#     caches.set("default", cache)
#     #await cache.clear()

@pytest.fixture(scope="session")
def event_loop():
    """Переопределяем event_loop для session scope"""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()
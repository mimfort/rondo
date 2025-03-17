import pytest
import json
from datetime import datetime
from sqlalchemy import insert
from app.database import Base, async_session_maker, async_engine
from app.config import settings
from app.additional_registration.model import Registration_additional
from app.events.model import Event
from app.registration.model import Registration
from app.users.model import User

def parse_datetime(value: str):
    """Конвертирует строку в объект datetime, если это возможно."""
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return value  # Вернём как есть, если это не дата

def open_mock_json(model: str):
    """Читает JSON и конвертирует строки с датами в datetime."""
    try:
        with open(f"app/tests/mock_{model}.json", "r") as file:
            data = json.load(file)
            for item in data:
                for field in ["start_time", "end_time", "created_at", "updated_at"]:
                    if field in item:
                        item[field] = parse_datetime(item[field])
            return data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        pytest.fail(f"Ошибка при чтении файла mock_{model}.json: {e}")

@pytest.fixture(scope="session", autouse=True)
async def prepare_database():
    """Фикстура для подготовки тестовой базы данных."""
    assert settings.MODE == "TEST"

    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    # Загружаем данные из JSON-файлов
    users = open_mock_json("users")
    events = open_mock_json("events")
    registration = open_mock_json("registration")
    additional_registration = open_mock_json("additional_registration")

    async with async_session_maker() as session:
        # Вставляем пользователей и события первыми
        if users:
            await session.execute(insert(User).values(users))
            await session.commit()  # Подтверждаем транзакцию, чтобы пользователи были записаны в БД

        if events:
            await session.execute(insert(Event).values(events))
            await session.commit()  # Подтверждаем транзакцию, чтобы события были записаны в БД

        # Проверяем, что пользователи и события существуют перед вставкой Registration
        if registration:
            await session.execute(insert(Registration).values(registration))
            await session.commit()  # Подтверждаем транзакцию

        # Наконец вставляем дополнительные регистрации
        if additional_registration:
            await session.execute(insert(Registration_additional).values(additional_registration))
            await session.commit()  # Подтверждаем транзакцию
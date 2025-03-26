FROM python:3.12-slim

WORKDIR /rondo

# Копирование файлов зависимостей
COPY pyproject.toml .
COPY uv.lock .

# Установка зависимостей Python через uv
RUN pip install uv && uv sync && pip install -e .

# Копирование конфигурации production
COPY .env-non-dev .env

# Копирование исходного кода
COPY app/ app/
COPY alembic.ini .
COPY alembic/ alembic/
COPY main.py .

# Создание директории для загрузок
RUN mkdir -p uploads && chmod 777 uploads

# Установка переменных окружения для production
ENV ENVIRONMENT=production
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Запуск миграций и приложения
CMD python -c "from alembic.config import Config; from alembic import command; config = Config('alembic.ini'); command.upgrade(config, 'head')" && gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120 
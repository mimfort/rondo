from celery import Celery

from app.config import settings

celery = Celery(
    "tasks",
    broker=settings.BROKER,
    include=["app.tasks.tasks"],
    backend=settings.BACKEND,
)
celery.conf.update(
    smtp_server=settings.SMTP_SERVER,
    smtp_port=settings.SMTP_PORT,
    smtp_username=settings.SMTP_USERNAME,
    smtp_password=settings.SMTP_PASSWORD,
    email_from=settings.EMAIL_FROM,
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='Europe/Moscow',
    enable_utc=True,
    worker_max_tasks_per_child=1,
    worker_prefetch_multiplier=1,
    task_ignore_result=True,
    task_store_errors_even_if_ignored=True,
    telegram_token=settings.TELEGRAM_TOKEN,
    telegram_chat_id=settings.TELEGRAM_CHAT_ID
)

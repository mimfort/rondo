from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin

from app.additional_registration.router import router as additional_reg_router
from app.admin.auth import authentication_backend
from app.admin.view import (
    EventAdmin,
    RegistrationAddAdmin,
    RegistrationAdmin,
    UserAdmin,
)
from app.database import async_engine as engine
from app.events.router import router as event_router
from app.registration.router import router as registration_router
from app.users.router import router as users_router
from app.event_tags.router import router as event_tags_router
from app.tags.router import router as tags_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создаем директорию для загрузки файлов при запуске приложения
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
    yield


app = FastAPI(lifespan=lifespan)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://rondo.scvnotready.ru", "http://localhost:80"],  # Разрешаем запросы с фронтенда
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Монтируем статическую директорию для загруженных файлов
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

admin = Admin(app, engine, authentication_backend=authentication_backend)

admin.add_view(UserAdmin)
admin.add_view(EventAdmin)
admin.add_view(RegistrationAdmin)
admin.add_view(RegistrationAddAdmin)


app.include_router(event_router)
app.include_router(users_router)
app.include_router(registration_router)
app.include_router(additional_reg_router)
app.include_router(event_tags_router)
app.include_router(tags_router)
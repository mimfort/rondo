from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware

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
from app.coworking.router import router as coworking_router
from app.coworking_reservation.router import router as coworking_reservation_router
from app.courts.router import router as courts_router
from app.court_reservation.router import router as court_reservation_router

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
    allow_origins=["https://skkrondo.ru", "http://localhost:80", "http://localhost:5173", "https://yookassa.ru"],  # Разрешаем запросы с фронтенда
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

# Монтируем статическую директорию для загруженных файлов
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

async def https_redirect_middleware(request, call_next):
    if request.url.scheme == "https":
        return await call_next(request)
    return Response(
        status_code=301,
        headers={"Location": str(request.url.replace(scheme="https"))}
    )

admin = Admin(
    app, 
    engine, 
    authentication_backend=authentication_backend,
    base_url="/admin",
    title="Rondo Admin",
    debug=False
)

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
app.include_router(coworking_router)
app.include_router(coworking_reservation_router)
app.include_router(courts_router)
app.include_router(court_reservation_router)
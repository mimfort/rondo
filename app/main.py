from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    # redis = aioredis.from_url("redis://localhost")
    # FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    print("-------начало---------")
    yield
    print("-------конец---------")


app = FastAPI(lifespan=lifespan)

# Настройка CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

admin = Admin(app, engine, authentication_backend=authentication_backend)

admin.add_view(UserAdmin)
admin.add_view(EventAdmin)
admin.add_view(RegistrationAdmin)
admin.add_view(RegistrationAddAdmin)


app.include_router(event_router)
app.include_router(users_router)
app.include_router(registration_router)
app.include_router(additional_reg_router)

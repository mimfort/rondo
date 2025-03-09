from fastapi import FastAPI
from app.users.router import router as users_router
from app.events.router import router as event_router
from app.registration.router import router as registration_router

app = FastAPI()
app.include_router(event_router)
app.include_router(users_router)
app.include_router(registration_router)
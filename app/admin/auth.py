from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request

from app.config import settings
from app.users.auth import auth_user, create_access_token
from app.users.dependencies import get_current_user


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        email, password = form["username"], form["password"]
        user = await auth_user(email, password)
        if user.admin_status == "admin":
            cookie = create_access_token({"sub": str(user.id)})
            request.session.update({"token": cookie})
            return True
        return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")
        if not token:
            return False
        try:
            user = await get_current_user(token)
            return user.admin_status == "admin"
        except Exception:
            return False


authentication_backend = AdminAuth(secret_key=settings.SECRET_KEY)
# admin = Admin(app=..., authentication_backend=authentication_backend، ...)

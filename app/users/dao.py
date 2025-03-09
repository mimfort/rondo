from app.dao.base import BaseDAO
from app.users.model import User

class UsersDao(BaseDAO):
    model = User
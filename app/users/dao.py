from app.dao.base import BaseDAO
from app.users.model import User

class UsersDAO(BaseDAO):
    model = User
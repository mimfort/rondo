from sqladmin import ModelView
from app.users.model import User
from app.events.model import Event
from app.registration.model import Registration
from app.additional_registration.model import Registration_additional
class UserAdmin(ModelView, model=User):
    #column_list = "__all__"
    can_delete = False
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-user"
    column_details_exclude_list = [User.hashed_password]
    column_exclude_list = [User.hashed_password]

class EventAdmin(ModelView, model=Event):
    column_list = "__all__"
    can_delete = False
    name = "Ивент"
    name_plural = "Ивенты"
    icon = "fa-solid fa-user"
    #column_exclude_list = []

class RegistrationAdmin(ModelView, model=Registration):
    column_list = "__all__"
    can_delete = False
    name = "Регистрация"
    name_plural = "Регистрации"
    icon = "fa-solid fa-user"
    #column_exclude_list = []

class RegistrationAddAdmin(ModelView, model=Registration_additional):
    column_list = "__all__"
    can_delete = False
    name = "Пред регистрация"
    name_plural = "Пред регистрация"
    icon = "fa-solid fa-user"
    #column_exclude_list = []


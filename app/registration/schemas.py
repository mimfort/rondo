from pydantic import BaseModel


class RegistrationResponse(BaseModel):
    id: int
    user_id: int
    event_id: int

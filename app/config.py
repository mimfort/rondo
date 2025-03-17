from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal

class Settings(BaseSettings):
    MODE: Literal["DEV","TEST","PROD"]
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASS: str
    DB_NAME: str
    DB_DRIVER: str
    DATABASE_URL: str

    TEST_DB_HOST: str
    TEST_DB_PORT: int
    TEST_DB_USER: str
    TEST_DB_PASS: str
    TEST_DB_NAME: str
    TEST_DB_DRIVER: str
    TEST_DATABASE_URL: str
    
    SECRET_KEY: str
    HASH_ALGO: str
    BROKER: str
    BACKEND: str
    SMTP_SERVER: str
    SMTP_PORT: str
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    EMAIL_FROM: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

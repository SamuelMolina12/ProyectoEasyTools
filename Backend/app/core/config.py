from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "EasyTool API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = "mssql+pyodbc://@localhost/EasyToolDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"

    SECRET_KEY: str = "easytool-super-secret-jwt-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    CORS_ORIGINS: str = "*"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()

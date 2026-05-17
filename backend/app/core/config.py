from functools import lru_cache
from typing import Literal

from pydantic import Field, computed_field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEFAULT_DEV_SECRET = "performly-local-dev-only-do-not-use-in-production-env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Performly"
    app_env: Literal["local", "test", "staging", "production"] = "local"
    backend_cors_origins: str = "http://localhost:3000"
    database_url: str = "postgresql+asyncpg://performly:performly@localhost:5432/performly"
    sync_database_url: str = "postgresql://performly:performly@localhost:5432/performly"
    # No default in production — validator below enforces this
    session_secret: str = Field(default=_DEFAULT_DEV_SECRET, min_length=32)
    access_token_expire_days: int = 7  # Reduced from 30

    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/api/v1/auth/google/callback"

    resend_api_key: str = ""
    email_from: str = "Performly <noreply@example.com>"

    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    razorpay_webhook_secret: str = ""
    razorpay_mode: str = "test"

    @computed_field
    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]

    @model_validator(mode="after")
    def _enforce_production_secret(self) -> "Settings":
        if self.app_env in {"production", "staging"} and self.session_secret == _DEFAULT_DEV_SECRET:
            raise ValueError(
                "SESSION_SECRET must be explicitly set to a strong secret "
                "in production/staging environments. "
                "The default dev-only value is not acceptable."
            )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

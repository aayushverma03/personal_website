"""Runtime configuration loaded from environment."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/dev.db"
    session_secret: str = "dev-insecure-change-me"
    session_cookie_name: str = "pl_session"
    session_cookie_secure: bool = False
    session_ttl_days: int = 14
    google_client_id: str = ""
    google_client_secret: str = ""
    openai_api_key: str = ""
    openai_model: str = "gpt-5.4-mini"

    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")


settings = Settings()

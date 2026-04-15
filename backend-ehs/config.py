"""Configuration from environment variables."""
import os

DATABASE_URL = os.getenv(
    "EHS_DATABASE_URL",
    "postgresql+asyncpg://ehs_user:ehspass@db:5432/ehs_platform",
)
JWT_SECRET = os.getenv("EHS_JWT_SECRET", "dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.4-mini")

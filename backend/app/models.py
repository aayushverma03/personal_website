"""Database models."""
from datetime import UTC, datetime

from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str | None = None
    google_sub: str | None = Field(default=None, index=True, unique=True)
    created_at: datetime = Field(default_factory=utcnow)


class Session(SQLModel, table=True):
    token: str = Field(primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=utcnow)
    expires_at: datetime


class DocumentDraft(SQLModel, table=True):
    __tablename__ = "document_draft"
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    title: str = "Untitled draft"
    document_type_id: str | None = None
    fields_json: str = "{}"
    messages_json: str = "[]"
    is_active: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

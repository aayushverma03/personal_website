"""Database engine and session helpers."""
from collections.abc import Iterator

from sqlalchemy import text
from sqlmodel import Session as DbSession, SQLModel, create_engine

from .config import settings

_connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
engine = create_engine(settings.database_url, connect_args=_connect_args)


def init_db() -> None:
    # PL-5: obsolete mnda_draft (pre-multi-document)
    with engine.begin() as conn:
        conn.execute(text("DROP TABLE IF EXISTS mnda_draft"))

    preserved = _pl6_capture_legacy_drafts()
    SQLModel.metadata.create_all(engine)
    _pl6_restore_legacy_drafts(preserved)


def _pl6_capture_legacy_drafts() -> list[tuple]:
    """PL-6: detect pre-multi-draft document_draft schema, snapshot rows, drop table.

    Returns the old rows so _pl6_restore_legacy_drafts can reinsert them after
    SQLModel rebuilds the table with the new schema.
    """
    with engine.begin() as conn:
        exists = conn.execute(
            text("SELECT 1 FROM sqlite_master WHERE type='table' AND name='document_draft'")
        ).first()
        if not exists:
            return []
        cols = {row[1] for row in conn.execute(text("PRAGMA table_info(document_draft)"))}
        if "is_active" in cols:
            return []
        rows = list(
            conn.execute(
                text(
                    "SELECT user_id, document_type_id, fields_json, messages_json, updated_at "
                    "FROM document_draft"
                )
            )
        )
        conn.execute(text("DROP TABLE document_draft"))
        return rows


def _pl6_restore_legacy_drafts(rows: list[tuple]) -> None:
    if not rows:
        return
    with engine.begin() as conn:
        for user_id, type_id, fields_json, messages_json, updated_at in rows:
            conn.execute(
                text(
                    "INSERT INTO document_draft "
                    "(user_id, title, document_type_id, fields_json, messages_json, "
                    " is_active, created_at, updated_at) "
                    "VALUES (:uid, :title, :tid, :fj, :mj, 1, :ts, :ts)"
                ),
                {
                    "uid": user_id,
                    "title": "Untitled draft",
                    "tid": type_id,
                    "fj": fields_json,
                    "mj": messages_json,
                    "ts": updated_at,
                },
            )


def get_db() -> Iterator[DbSession]:
    with DbSession(engine) as session:
        yield session

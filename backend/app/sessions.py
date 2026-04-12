"""Server-side session storage and cookie helpers."""
import secrets
from datetime import timedelta

from fastapi import Depends, HTTPException, Request, Response, status
from sqlmodel import Session as DbSession, select

from .config import settings
from .db import get_db
from .models import Session, User, utcnow


def _new_token() -> str:
    return secrets.token_urlsafe(32)


def create_session(db: DbSession, user_id: int) -> str:
    token = _new_token()
    row = Session(
        token=token,
        user_id=user_id,
        expires_at=utcnow() + timedelta(days=settings.session_ttl_days),
    )
    db.add(row)
    db.commit()
    return token


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        secure=settings.session_cookie_secure,
        max_age=settings.session_ttl_days * 24 * 60 * 60,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(settings.session_cookie_name, path="/")


def current_user(
    request: Request,
    db: DbSession = Depends(get_db),
) -> User:
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "not authenticated")
    row = db.get(Session, token)
    if row is None or row.expires_at < utcnow():
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "session expired")
    user = db.get(User, row.user_id)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "user missing")
    return user


def delete_session(db: DbSession, token: str) -> None:
    row = db.get(Session, token)
    if row is not None:
        db.delete(row)
        db.commit()

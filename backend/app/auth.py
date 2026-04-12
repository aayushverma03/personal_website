"""Auth routes: signup, login, logout, me, Google OAuth stubs."""
import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session as DbSession, select

from .config import settings
from .db import get_db
from .models import User
from .sessions import (
    clear_session_cookie,
    create_session,
    current_user,
    delete_session,
    set_session_cookie,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class UserOut(BaseModel):
    id: int
    email: str


def _to_out(user: User) -> UserOut:
    return UserOut(id=user.id, email=user.email)  # type: ignore[arg-type]


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(
    creds: Credentials,
    response: Response,
    db: DbSession = Depends(get_db),
) -> UserOut:
    existing = db.exec(select(User).where(User.email == creds.email)).first()
    if existing is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "email already registered")
    user = User(email=creds.email, password_hash=_hash_password(creds.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_session(db, user.id)  # type: ignore[arg-type]
    set_session_cookie(response, token)
    return _to_out(user)


@router.post("/login", response_model=UserOut)
def login(
    creds: Credentials,
    response: Response,
    db: DbSession = Depends(get_db),
) -> UserOut:
    user = db.exec(select(User).where(User.email == creds.email)).first()
    if user is None or not user.password_hash or not _verify_password(
        creds.password, user.password_hash
    ):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid credentials")
    token = create_session(db, user.id)  # type: ignore[arg-type]
    set_session_cookie(response, token)
    return _to_out(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    request: Request,
    response: Response,
    db: DbSession = Depends(get_db),
) -> Response:
    token = request.cookies.get(settings.session_cookie_name)
    if token:
        delete_session(db, token)
    clear_session_cookie(response)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)) -> UserOut:
    return _to_out(user)


@router.get("/google/start", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def google_start() -> dict[str, str]:
    raise HTTPException(
        status.HTTP_501_NOT_IMPLEMENTED,
        "Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
    )


@router.get("/google/callback", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def google_callback() -> dict[str, str]:
    raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, "Google OAuth not configured.")

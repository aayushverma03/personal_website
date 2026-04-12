"""FastAPI application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI

from .auth import router as auth_router
from .chat import documents_router, drafts_router, router as chat_router
from .db import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="LexDraft Backend", lifespan=lifespan)
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(drafts_router)
app.include_router(documents_router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

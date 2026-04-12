"""Chat and draft management routes."""
from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session as DbSession, select

from . import llm
from .db import get_db
from .documents import get_document, list_documents
from .documents.registry import completion_count, field_is_filled, is_complete
from .models import DocumentDraft, User, utcnow
from .sessions import current_user

router = APIRouter(prefix="/api/chat", tags=["chat"])
drafts_router = APIRouter(prefix="/api/drafts", tags=["drafts"])
documents_router = APIRouter(prefix="/api/documents", tags=["documents"])


class ChatMessage(BaseModel):
    role: str
    content: str


class FieldOut(BaseModel):
    name: str
    label: str
    filled: bool


class SectionOut(BaseModel):
    heading: str
    body: list[str]


class DocumentSummaryOut(BaseModel):
    id: str
    name: str
    category: str
    short_description: str


class ChatState(BaseModel):
    draft_id: int
    title: str
    messages: list[ChatMessage]
    document_type_id: str | None
    document_name: str | None
    fields: dict[str, str | int]
    field_specs: list[FieldOut]
    sections: list[SectionOut]
    filename_slug: str
    is_complete: bool
    filled_count: int
    total_count: int


class ChatIn(BaseModel):
    content: str


class DraftSummary(BaseModel):
    id: int
    title: str
    document_type_id: str | None
    document_name: str | None
    is_active: bool
    is_complete: bool
    filled_count: int
    total_count: int
    updated_at: str


class DraftRenameIn(BaseModel):
    title: str


def _require_llm() -> None:
    if not llm.is_configured():
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "OPENAI_API_KEY is not set on the server",
        )


def _active_draft(db: DbSession, user_id: int) -> DocumentDraft:
    draft = db.exec(
        select(DocumentDraft)
        .where(DocumentDraft.user_id == user_id)
        .where(DocumentDraft.is_active.is_(True))
    ).first()
    if draft is not None:
        return draft
    return _new_draft(db, user_id)


def _new_draft(db: DbSession, user_id: int) -> DocumentDraft:
    """Create a new draft for this user and mark it as the active one."""
    existing = db.exec(
        select(DocumentDraft)
        .where(DocumentDraft.user_id == user_id)
        .where(DocumentDraft.is_active.is_(True))
    ).all()
    for d in existing:
        d.is_active = False
        db.add(d)
    seed_messages = [{"role": "assistant", "content": llm.initial_greeting()}]
    draft = DocumentDraft(
        user_id=user_id,
        title="Untitled draft",
        document_type_id=None,
        fields_json="{}",
        messages_json=json.dumps(seed_messages),
        is_active=True,
    )
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft


def _to_state(draft: DocumentDraft) -> ChatState:
    messages = [ChatMessage(**m) for m in json.loads(draft.messages_json)]
    fields: dict[str, str | int] = json.loads(draft.fields_json)

    doc = get_document(draft.document_type_id) if draft.document_type_id else None
    if doc is None:
        return ChatState(
            draft_id=draft.id,  # type: ignore[arg-type]
            title=draft.title,
            messages=messages,
            document_type_id=None,
            document_name=None,
            fields=fields,
            field_specs=[],
            sections=[],
            filename_slug="document",
            is_complete=False,
            filled_count=0,
            total_count=0,
        )

    filled, total = completion_count(doc, fields)
    specs = [
        FieldOut(name=s.name, label=s.label, filled=field_is_filled(fields, s.name))
        for s in doc.fields
    ]
    complete = is_complete(doc, fields)
    sections = [
        SectionOut(heading=s.heading, body=list(s.body))
        for s in (doc.render(fields) if complete else [])
    ]
    return ChatState(
        draft_id=draft.id,  # type: ignore[arg-type]
        title=draft.title,
        messages=messages,
        document_type_id=doc.id,
        document_name=doc.name,
        fields=fields,
        field_specs=specs,
        sections=sections,
        filename_slug=doc.filename_slug,
        is_complete=complete,
        filled_count=filled,
        total_count=total,
    )


def _save(db: DbSession, draft: DocumentDraft) -> None:
    draft.updated_at = utcnow()
    db.add(draft)
    db.commit()
    db.refresh(draft)


def _summary(draft: DocumentDraft) -> DraftSummary:
    fields: dict[str, str | int] = json.loads(draft.fields_json)
    doc = get_document(draft.document_type_id) if draft.document_type_id else None
    if doc is None:
        return DraftSummary(
            id=draft.id,  # type: ignore[arg-type]
            title=draft.title,
            document_type_id=None,
            document_name=None,
            is_active=draft.is_active,
            is_complete=False,
            filled_count=0,
            total_count=0,
            updated_at=draft.updated_at.isoformat(),
        )
    filled, total = completion_count(doc, fields)
    return DraftSummary(
        id=draft.id,  # type: ignore[arg-type]
        title=draft.title,
        document_type_id=doc.id,
        document_name=doc.name,
        is_active=draft.is_active,
        is_complete=is_complete(doc, fields),
        filled_count=filled,
        total_count=total,
        updated_at=draft.updated_at.isoformat(),
    )


def _owned(db: DbSession, draft_id: int, user_id: int) -> DocumentDraft:
    draft = db.get(DocumentDraft, draft_id)
    if draft is None or draft.user_id != user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "draft not found")
    return draft


# --------------------------------------------------------------------------- #
# Chat routes — operate on the user's active draft
# --------------------------------------------------------------------------- #

@router.get("/state", response_model=ChatState)
def get_state(
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> ChatState:
    draft = _active_draft(db, user.id)  # type: ignore[arg-type]
    return _to_state(draft)


@router.post("/message", response_model=ChatState)
def post_message(
    body: ChatIn,
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> ChatState:
    content = body.content.strip()
    if not content:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "message is empty")
    _require_llm()

    draft = _active_draft(db, user.id)  # type: ignore[arg-type]
    history: list[dict[str, str]] = json.loads(draft.messages_json)
    fields: dict[str, str | int] = json.loads(draft.fields_json)

    try:
        if draft.document_type_id is None:
            result = llm.run_selection_turn(history, content)
            draft.messages_json = json.dumps(result.messages)
            if result.document_type_id is not None:
                draft.document_type_id = result.document_type_id
                draft.fields_json = "{}"
                selected = get_document(result.document_type_id)
                if selected is not None and draft.title == "Untitled draft":
                    draft.title = selected.name
            _save(db, draft)
        else:
            doc = get_document(draft.document_type_id)
            if doc is None:
                raise HTTPException(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    f"draft references unknown document type '{draft.document_type_id}'",
                )
            result = llm.run_collection_turn(doc, fields, history, content)
            draft.fields_json = json.dumps(result.fields)
            draft.messages_json = json.dumps(result.messages)
            _save(db, draft)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY, f"LLM request failed: {exc}"
        ) from exc

    return _to_state(draft)


@router.post("/reset", response_model=ChatState)
def reset(
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> ChatState:
    draft = _active_draft(db, user.id)  # type: ignore[arg-type]
    draft.document_type_id = None
    draft.fields_json = "{}"
    draft.title = "Untitled draft"
    draft.messages_json = json.dumps(
        [{"role": "assistant", "content": llm.initial_greeting()}]
    )
    _save(db, draft)
    return _to_state(draft)


# --------------------------------------------------------------------------- #
# Drafts management
# --------------------------------------------------------------------------- #

@drafts_router.get("", response_model=list[DraftSummary])
def list_drafts(
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> list[DraftSummary]:
    rows = db.exec(
        select(DocumentDraft)
        .where(DocumentDraft.user_id == user.id)
        .order_by(DocumentDraft.updated_at.desc())
    ).all()
    return [_summary(d) for d in rows]


@drafts_router.post("", response_model=ChatState)
def create_draft(
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> ChatState:
    draft = _new_draft(db, user.id)  # type: ignore[arg-type]
    return _to_state(draft)


@drafts_router.post("/{draft_id}/activate", response_model=ChatState)
def activate_draft(
    draft_id: int,
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> ChatState:
    target = _owned(db, draft_id, user.id)  # type: ignore[arg-type]
    if not target.is_active:
        others = db.exec(
            select(DocumentDraft)
            .where(DocumentDraft.user_id == user.id)
            .where(DocumentDraft.is_active.is_(True))
        ).all()
        for d in others:
            d.is_active = False
            db.add(d)
        target.is_active = True
        db.add(target)
        db.commit()
        db.refresh(target)
    return _to_state(target)


@drafts_router.patch("/{draft_id}", response_model=DraftSummary)
def rename_draft(
    draft_id: int,
    body: DraftRenameIn,
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> DraftSummary:
    target = _owned(db, draft_id, user.id)  # type: ignore[arg-type]
    title = body.title.strip()
    if not title:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "title is empty")
    target.title = title[:120]
    target.updated_at = utcnow()
    db.add(target)
    db.commit()
    db.refresh(target)
    return _summary(target)


@drafts_router.delete("/{draft_id}", status_code=204)
def delete_draft(
    draft_id: int,
    user: User = Depends(current_user),
    db: DbSession = Depends(get_db),
) -> None:
    target = _owned(db, draft_id, user.id)  # type: ignore[arg-type]
    was_active = target.is_active
    db.delete(target)
    db.commit()
    if not was_active:
        return
    successor = db.exec(
        select(DocumentDraft)
        .where(DocumentDraft.user_id == user.id)
        .order_by(DocumentDraft.updated_at.desc())
    ).first()
    if successor is not None:
        successor.is_active = True
        db.add(successor)
        db.commit()


# --------------------------------------------------------------------------- #
# Supported documents listing
# --------------------------------------------------------------------------- #

@documents_router.get("", response_model=list[DocumentSummaryOut])
def list_supported_documents() -> list[DocumentSummaryOut]:
    return [
        DocumentSummaryOut(
            id=d.id,
            name=d.name,
            category=d.category,
            short_description=d.short_description,
        )
        for d in list_documents()
    ]

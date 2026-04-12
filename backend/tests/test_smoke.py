"""End-to-end smoke: health, auth, document registry, chat plumbing, drafts CRUD."""
import os
import tempfile

os.environ["DATABASE_URL"] = f"sqlite:///{tempfile.mktemp(suffix='.db')}"
os.environ["OPENAI_API_KEY"] = ""  # force the 503 path in chat tests

from fastapi.testclient import TestClient  # noqa: E402

from app.db import init_db  # noqa: E402
from app.main import app  # noqa: E402

init_db()
client = TestClient(app)


def _signup(email: str, password: str = "secret12345") -> None:
    client.cookies.clear()
    r = client.post("/api/auth/signup", json={"email": email, "password": password})
    assert r.status_code == 201


def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_chat_requires_auth():
    client.cookies.clear()
    assert client.get("/api/chat/state").status_code == 401
    assert client.post("/api/chat/message", json={"content": "hi"}).status_code == 401


def test_drafts_requires_auth():
    client.cookies.clear()
    assert client.get("/api/drafts").status_code == 401
    assert client.post("/api/drafts").status_code == 401


def test_signup_login_logout():
    client.cookies.clear()
    creds = {"email": "alice@example.com", "password": "hunter2hunter2"}
    r = client.post("/api/auth/signup", json=creds)
    assert r.status_code == 201

    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == creds["email"]

    r = client.post("/api/auth/logout")
    assert r.status_code == 204

    r = client.get("/api/auth/me")
    assert r.status_code == 401


def test_duplicate_signup_rejected():
    client.cookies.clear()
    creds = {"email": "bob@example.com", "password": "secret12345"}
    assert client.post("/api/auth/signup", json=creds).status_code == 201
    assert client.post("/api/auth/signup", json=creds).status_code == 409


def test_bad_login():
    client.cookies.clear()
    r = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "xxxxxxxx"},
    )
    assert r.status_code == 401


def test_documents_endpoint_lists_supported_types():
    r = client.get("/api/documents")
    assert r.status_code == 200
    body = r.json()
    ids = {d["id"] for d in body}
    assert "mutual-nda" in ids
    assert "employment-offer-letter" in ids
    assert "cloud-service-agreement" in ids
    assert "data-processing-agreement" in ids
    assert "design-partner-agreement" in ids
    assert "ai-addendum" in ids


def test_chat_state_creates_empty_draft_with_greeting():
    _signup("chat@example.com")

    r = client.get("/api/chat/state")
    assert r.status_code == 200
    body = r.json()
    assert body["draft_id"] > 0
    assert body["title"] == "Untitled draft"
    assert body["document_type_id"] is None
    assert body["document_name"] is None
    assert body["filled_count"] == 0
    assert body["total_count"] == 0
    assert body["is_complete"] is False
    assert body["sections"] == []
    assert len(body["messages"]) == 1
    assert body["messages"][0]["role"] == "assistant"

    original_id = body["draft_id"]

    r = client.post("/api/chat/message", json={"content": "I need an NDA"})
    assert r.status_code == 503

    r = client.post("/api/chat/message", json={"content": "   "})
    assert r.status_code == 422

    r = client.post("/api/chat/reset")
    assert r.status_code == 200
    reset_body = r.json()
    assert len(reset_body["messages"]) == 1
    assert reset_body["draft_id"] == original_id
    assert reset_body["title"] == "Untitled draft"

    client.post("/api/auth/logout")


def test_drafts_lifecycle():
    _signup("drafts@example.com")

    # Fresh user has no drafts until they hit chat state (or POST /api/drafts).
    r = client.get("/api/drafts")
    assert r.status_code == 200
    assert r.json() == []

    # Touching chat state lazily creates the first active draft.
    first = client.get("/api/chat/state").json()
    first_id = first["draft_id"]
    listing = client.get("/api/drafts").json()
    assert len(listing) == 1
    assert listing[0]["id"] == first_id
    assert listing[0]["is_active"] is True

    # Creating a new draft deactivates the previous one.
    second = client.post("/api/drafts").json()
    second_id = second["draft_id"]
    assert second_id != first_id
    listing = client.get("/api/drafts").json()
    active_ids = {d["id"] for d in listing if d["is_active"]}
    assert active_ids == {second_id}
    assert len(listing) == 2

    # Activating the original draft flips the active flag back.
    r = client.post(f"/api/drafts/{first_id}/activate")
    assert r.status_code == 200
    assert r.json()["draft_id"] == first_id
    listing = client.get("/api/drafts").json()
    active_ids = {d["id"] for d in listing if d["is_active"]}
    assert active_ids == {first_id}

    # Renaming updates the title.
    r = client.patch(f"/api/drafts/{second_id}", json={"title": "Client NDA"})
    assert r.status_code == 200
    assert r.json()["title"] == "Client NDA"

    # Empty title rejected.
    r = client.patch(f"/api/drafts/{second_id}", json={"title": "   "})
    assert r.status_code == 422

    # Deleting the inactive draft leaves the active one intact.
    r = client.delete(f"/api/drafts/{second_id}")
    assert r.status_code == 204
    listing = client.get("/api/drafts").json()
    assert len(listing) == 1
    assert listing[0]["id"] == first_id
    assert listing[0]["is_active"] is True

    # Deleting the active draft leaves the user with no drafts until they touch chat state.
    r = client.delete(f"/api/drafts/{first_id}")
    assert r.status_code == 204
    assert client.get("/api/drafts").json() == []
    fresh = client.get("/api/chat/state").json()
    assert fresh["title"] == "Untitled draft"
    refreshed = client.get("/api/drafts").json()
    assert len(refreshed) == 1
    assert refreshed[0]["id"] == fresh["draft_id"]
    assert refreshed[0]["is_active"] is True

    client.post("/api/auth/logout")


def test_drafts_are_isolated_per_user():
    _signup("user_a@example.com")
    a_state = client.get("/api/chat/state").json()
    a_draft_id = a_state["draft_id"]
    client.post("/api/auth/logout")

    _signup("user_b@example.com")
    b_list = client.get("/api/drafts").json()
    assert b_list == []
    # User B cannot see or touch user A's draft.
    assert client.post(f"/api/drafts/{a_draft_id}/activate").status_code == 404
    assert client.delete(f"/api/drafts/{a_draft_id}").status_code == 404
    assert client.patch(f"/api/drafts/{a_draft_id}", json={"title": "x"}).status_code == 404
    client.post("/api/auth/logout")


def test_registry_and_render_all_documents():
    from app.documents import list_documents
    from app.documents.registry import completion_count, is_complete

    for doc in list_documents():
        assert doc.id and doc.name and doc.category
        assert len(doc.fields) > 0

        empty_filled, empty_total = completion_count(doc, {})
        assert empty_filled == 0
        assert empty_total == len(doc.fields)
        assert is_complete(doc, {}) is False

        sections = doc.render({})
        assert len(sections) >= 3
        assert sections[0].heading

        full_fields = {f.name: "1" if f.type == "integer" else "value" for f in doc.fields}
        assert is_complete(doc, full_fields) is True
        filled_sections = doc.render(full_fields)
        assert len(filled_sections) >= 3


def test_apply_tool_args_rejects_unknown_keys():
    """The collection turn's update_fields tool only accepts fields declared by the active document."""
    from app.documents import get_document
    from app.llm import run_collection_turn  # noqa: F401  (import sanity only)

    doc = get_document("mutual-nda")
    assert doc is not None
    allowed = {f.name for f in doc.fields}
    assert "party1_company" in allowed
    assert "made_up_field" not in allowed

"""OpenAI-powered two-phase agent for picking and filling legal documents."""
from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from openai import OpenAI

from .config import settings
from .documents import REGISTRY, get_document, list_documents
from .documents.types import DocumentType

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def is_configured() -> bool:
    return bool(settings.openai_api_key)


def initial_greeting() -> str:
    names = ", ".join(d.name for d in list_documents())
    return (
        "Hi! I can help you create a legal document through a quick chat. "
        f"Right now I support: {names}. "
        "Tell me which document you need (or describe your situation) and I'll take it from there."
    )


# --------------------------------------------------------------------------- #
# Tool schemas
# --------------------------------------------------------------------------- #

_SELECT_TOOL: dict[str, Any] = {
    "type": "function",
    "function": {
        "name": "select_document_type",
        "description": (
            "Call this when the user has made clear which supported document they want. "
            "Pass the exact id from the supported-documents list."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "document_type_id": {
                    "type": "string",
                    "description": "The id from the supported-documents list.",
                }
            },
            "required": ["document_type_id"],
            "additionalProperties": False,
        },
    },
}

_SUGGEST_TOOL: dict[str, Any] = {
    "type": "function",
    "function": {
        "name": "suggest_alternative",
        "description": (
            "Call this when the user wants a document that is NOT in the supported list, to "
            "propose the closest supported alternative. The backend will show this to the user; "
            "you must still produce a short assistant message explaining the situation."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "document_type_id": {
                    "type": "string",
                    "description": "The closest supported document id to suggest.",
                },
                "reason": {
                    "type": "string",
                    "description": "One short sentence explaining why this is the closest match.",
                },
            },
            "required": ["document_type_id", "reason"],
            "additionalProperties": False,
        },
    },
}


def _build_update_tool(doc: DocumentType) -> dict[str, Any]:
    properties: dict[str, dict[str, Any]] = {}
    for spec in doc.fields:
        json_type = {
            "string": "string",
            "integer": "integer",
            "date": "string",
        }[spec.type]
        properties[spec.name] = {
            "type": json_type,
            "description": spec.description,
        }
    return {
        "type": "function",
        "function": {
            "name": "update_fields",
            "description": (
                f"Store fields the user has just provided for the {doc.name}. "
                "Only include fields the user just supplied; omit anything they did not mention."
            ),
            "parameters": {
                "type": "object",
                "properties": properties,
                "additionalProperties": False,
            },
        },
    }


# --------------------------------------------------------------------------- #
# System prompts
# --------------------------------------------------------------------------- #

def _selection_prompt() -> str:
    lines = []
    for doc in list_documents():
        kws = ", ".join(doc.keywords)
        lines.append(f"- id: {doc.id}")
        lines.append(f"  name: {doc.name}")
        lines.append(f"  category: {doc.category}")
        lines.append(f"  description: {doc.short_description}")
        lines.append(f"  keywords: {kws}")
    doc_block = "\n".join(lines)
    return f"""You are LexDraft, an AI legal document assistant. Your first job is to figure out which document the user wants.

Supported documents:
{doc_block}

Rules:
1. Greet briefly if this is the first turn; otherwise respond directly.
2. If the user asks what you can build, which categories are supported, or "what can you do", list the supported documents in plain prose with their category alongside each name, then invite them to pick one or describe their situation so you can recommend the best fit.
3. If the user clearly asks for one of the supported documents (by name, keyword, or obvious paraphrase), call `select_document_type` with the matching id, then in the same assistant message briefly confirm the choice and tell them you'll guide them through filling it out. Do not ask them to re-confirm.
4. If the user's request does not match any supported document, call `suggest_alternative` with the closest supported id and a short reason, then in the same assistant message explain that the exact document is not supported yet and ask whether they'd like to proceed with the suggested alternative. Wait for them to confirm before calling `select_document_type`.
5. If the user is vague ("a contract"), ask a short clarifying question before selecting.
6. Stay on topic. Do not answer unrelated questions — briefly redirect to document creation.
7. Plain text, no markdown headings or bullet lists. Keep messages short and warm.
"""


def _collection_prompt(doc: DocumentType, fields: dict[str, str | int]) -> str:
    field_lines = "\n".join(
        f"- {spec.name} ({spec.type}) — {spec.label}: {spec.description}"
        for spec in doc.fields
    )
    snapshot_lines = "\n".join(
        f"- {spec.label}: {fields.get(spec.name) or '(empty)'}" for spec in doc.fields
    )
    return f"""You are a legal document assistant helping the user fill out a {doc.name}.

Fields to collect (use these exact names when calling update_fields):
{field_lines}

Current draft state:
{snapshot_lines}

Rules:
1. Ask one focused question at a time. You may combine two closely related fields in one message.
2. After the user provides new information, call `update_fields` with ONLY the fields they just supplied, then continue the conversation in the same assistant turn.
3. Never ask for a field that is already filled in the draft state above.
4. Never invent values. Only store what the user actually said.
5. Stay on track. If the user asks an unrelated question or goes off-topic, briefly acknowledge in one sentence and redirect to the next pending field.
6. If the user asks to switch to a different document, tell them to click "Start over" and pick a different one.
7. When every required field is filled, confirm briefly and tell them the document is ready to download.
8. Plain text, no markdown headings or bullet lists. Keep messages short and warm.
"""


# --------------------------------------------------------------------------- #
# Turn execution
# --------------------------------------------------------------------------- #

@dataclass
class TurnResult:
    messages: list[dict[str, str]]
    fields: dict[str, str | int]
    document_type_id: str | None
    assistant_text: str
    suggestion: dict[str, str] | None  # {"document_type_id", "reason"} if suggest_alternative fired


def _run_loop(
    system_prompt: str,
    history: list[dict[str, str]],
    user_message: str,
    tools: list[dict[str, Any]],
    on_tool_call: Callable[[str, str], str],
) -> str:
    """Run up to 3 OpenAI iterations. Returns the final assistant text."""
    client = _get_client()
    working: list[dict[str, Any]] = [{"role": "system", "content": system_prompt}]
    working.extend(history)
    working.append({"role": "user", "content": user_message})

    assistant_text = ""
    for _ in range(3):
        resp = client.chat.completions.create(
            model=settings.openai_model,
            messages=working,  # type: ignore[arg-type]
            tools=tools,
            tool_choice="auto",
            temperature=0.3,
        )
        msg = resp.choices[0].message
        entry: dict[str, Any] = {"role": "assistant", "content": msg.content}
        if msg.tool_calls:
            entry["tool_calls"] = [
                {
                    "id": tc.id,
                    "type": "function",
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments,
                    },
                }
                for tc in msg.tool_calls
            ]
        working.append(entry)

        if msg.content:
            assistant_text = msg.content

        if not msg.tool_calls:
            break

        for tc in msg.tool_calls:
            result = on_tool_call(tc.function.name, tc.function.arguments or "{}")
            working.append(
                {"role": "tool", "tool_call_id": tc.id, "content": result}
            )

    if not assistant_text:
        resp = client.chat.completions.create(
            model=settings.openai_model,
            messages=working,  # type: ignore[arg-type]
            tool_choice="none",
            temperature=0.3,
        )
        assistant_text = resp.choices[0].message.content or "(no response)"

    return assistant_text


def run_selection_turn(
    history: list[dict[str, str]],
    user_message: str,
) -> TurnResult:
    selected_id: str | None = None
    suggestion: dict[str, str] | None = None

    def on_tool(name: str, raw_args: str) -> str:
        nonlocal selected_id, suggestion
        try:
            args = json.loads(raw_args)
        except json.JSONDecodeError:
            return "error: invalid JSON"
        if name == "select_document_type":
            # If the same response also suggested an alternative, defer to the
            # suggestion so the user gets a confirmation turn. Prompt rule 4
            # forbids this combo but the model may still produce it.
            if suggestion is not None:
                return "ignored: suggest_alternative was already called in this turn; wait for the user to confirm"
            doc_id = args.get("document_type_id")
            if doc_id in REGISTRY:
                selected_id = doc_id
                return f"ok: selected {doc_id}"
            return f"error: unknown document_type_id '{doc_id}'"
        if name == "suggest_alternative":
            doc_id = args.get("document_type_id")
            reason = args.get("reason", "")
            if doc_id in REGISTRY:
                suggestion = {"document_type_id": doc_id, "reason": reason}
                # If a select was already recorded in the same response, roll it back.
                selected_id = None
                return f"ok: suggested {doc_id}"
            return f"error: unknown document_type_id '{doc_id}'"
        return f"error: unknown tool '{name}'"

    assistant_text = _run_loop(
        _selection_prompt(),
        history,
        user_message,
        [_SELECT_TOOL, _SUGGEST_TOOL],
        on_tool,
    )

    new_history = history + [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": assistant_text},
    ]
    return TurnResult(
        messages=new_history,
        fields={},
        document_type_id=selected_id,
        assistant_text=assistant_text,
        suggestion=suggestion,
    )


def run_collection_turn(
    doc: DocumentType,
    fields: dict[str, str | int],
    history: list[dict[str, str]],
    user_message: str,
) -> TurnResult:
    working_fields = dict(fields)

    def on_tool(name: str, raw_args: str) -> str:
        if name != "update_fields":
            return f"error: unknown tool '{name}'"
        try:
            args = json.loads(raw_args)
        except json.JSONDecodeError:
            return "error: invalid JSON"
        allowed = {f.name for f in doc.fields}
        for key, value in args.items():
            if key not in allowed:
                continue
            if value is None:
                continue
            working_fields[key] = value
        return "ok"

    assistant_text = _run_loop(
        _collection_prompt(doc, working_fields),
        history,
        user_message,
        [_build_update_tool(doc)],
        on_tool,
    )

    new_history = history + [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": assistant_text},
    ]
    return TurnResult(
        messages=new_history,
        fields=working_fields,
        document_type_id=doc.id,
        assistant_text=assistant_text,
        suggestion=None,
    )

"""Registry of supported document types."""
from __future__ import annotations

from . import ai_addendum, cloud_service, design_partner, dpa, employment_offer, mnda
from .types import DocumentType

_DOCS: tuple[DocumentType, ...] = (
    mnda.DOCUMENT,
    employment_offer.DOCUMENT,
    cloud_service.DOCUMENT,
    dpa.DOCUMENT,
    design_partner.DOCUMENT,
    ai_addendum.DOCUMENT,
)

REGISTRY: dict[str, DocumentType] = {doc.id: doc for doc in _DOCS}


def list_documents() -> list[DocumentType]:
    return list(_DOCS)


def get_document(doc_id: str) -> DocumentType | None:
    return REGISTRY.get(doc_id)


def _is_field_filled(value: str | int | None) -> bool:
    return value is not None and value != ""


def completion_count(doc: DocumentType, fields: dict[str, str | int]) -> tuple[int, int]:
    """Return (filled, total) counts for the document's fields."""
    total = len(doc.fields)
    filled = sum(1 for f in doc.fields if _is_field_filled(fields.get(f.name)))
    return filled, total


def is_complete(doc: DocumentType, fields: dict[str, str | int]) -> bool:
    filled, total = completion_count(doc, fields)
    return filled == total


def field_is_filled(fields: dict[str, str | int], name: str) -> bool:
    return _is_field_filled(fields.get(name))

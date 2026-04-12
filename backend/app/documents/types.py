"""Shared types and helpers for document definitions."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import date
from typing import Literal

FieldType = Literal["string", "integer", "date"]


@dataclass(frozen=True)
class FieldSpec:
    name: str
    label: str
    description: str
    type: FieldType = "string"


@dataclass(frozen=True)
class Section:
    heading: str
    body: list[str]


@dataclass(frozen=True)
class DocumentType:
    id: str
    name: str
    category: str
    short_description: str
    keywords: tuple[str, ...]
    fields: tuple[FieldSpec, ...]
    render: Callable[[dict[str, str | int]], list[Section]]
    filename_slug: str
    source_url: str | None = None


def field_value(fields: dict[str, str | int], name: str, placeholder: str = "") -> str:
    """Read a field value as a non-empty string, falling back to the placeholder."""
    raw = fields.get(name)
    if raw is None or raw == "":
        return placeholder
    return str(raw)


def fmt_long_date(iso: str, placeholder: str) -> str:
    """Format an ISO date as "Month D, YYYY", falling back to `placeholder` if missing."""
    if not iso:
        return placeholder
    try:
        d = date.fromisoformat(iso)
    except ValueError:
        return iso
    return f"{d.strftime('%B')} {d.day}, {d.year}"


def coerce_int(raw: str | int | None, default: int) -> int:
    if raw in (None, ""):
        return default
    try:
        return int(raw)
    except (TypeError, ValueError):
        return default


def unit_word(n: int, singular: str) -> str:
    """Pluralize a unit: unit_word(1, "year") -> "1 year", unit_word(3, "year") -> "3 years"."""
    return f"{n} {singular}" if n == 1 else f"{n} {singular}s"

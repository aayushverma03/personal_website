"""Supported legal document types for LexDraft."""
from .registry import REGISTRY, get_document, list_documents

__all__ = ["REGISTRY", "get_document", "list_documents"]

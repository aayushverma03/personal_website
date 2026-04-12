"""Design Partner Agreement (Common Paper Design Partner Agreement)."""
from __future__ import annotations

from .types import (
    DocumentType,
    FieldSpec,
    Section,
    coerce_int,
    field_value,
    fmt_long_date,
    unit_word,
)

FIELDS: tuple[FieldSpec, ...] = (
    FieldSpec("provider_company", "Provider company", "The company making the early product available"),
    FieldSpec("provider_notice_address", "Provider notice address", "Notice address for the Provider"),
    FieldSpec("partner_company", "Design partner company", "The company acting as the early design partner"),
    FieldSpec("partner_notice_address", "Partner notice address", "Notice address for the Partner"),
    FieldSpec("product_name", "Product", "Name and one-line description of the product being piloted"),
    FieldSpec("program_description", "Program description", 'What the design partnership entails, e.g. "Weekly feedback calls + shared product roadmap"'),
    FieldSpec("effective_date", "Effective date", "First day of the program (YYYY-MM-DD)", type="date"),
    FieldSpec(
        "term_months",
        "Term (months)",
        "Length of the design partnership in months",
        type="integer",
    ),
    FieldSpec("fees", "Fees", 'Amount the Partner pays the Provider, "None" if free'),
    FieldSpec("governing_law", "Governing law", "US state whose law governs"),
    FieldSpec("chosen_courts", "Chosen courts", "Courts with exclusive jurisdiction over disputes"),
)

def render(fields: dict[str, str | int]) -> list[Section]:
    provider = field_value(fields, "provider_company", "[Provider]")
    partner = field_value(fields, "partner_company", "[Partner]")
    eff = fmt_long_date(field_value(fields, "effective_date"), "[Effective Date]")
    term = unit_word(coerce_int(fields.get("term_months"), 6), "month")

    return [
        Section(
            heading="Design Partner Agreement",
            body=[
                f"This Design Partner Agreement is entered into as of {eff} between {provider} "
                f'(the "Provider") and {partner} (the "Partner"). It consists of this Cover Page '
                "and the Common Paper Design Partner Agreement Standard Terms, which are "
                "incorporated by reference."
            ],
        ),
        Section(
            heading="Cover Page",
            body=[
                f"Provider: {provider}",
                f"Provider Notice Address: {field_value(fields, 'provider_notice_address', '[Provider Notice Address]')}",
                f"Partner: {partner}",
                f"Partner Notice Address: {field_value(fields, 'partner_notice_address', '[Partner Notice Address]')}",
                f"Product: {field_value(fields, 'product_name', '[Product]')}",
                f"Program: {field_value(fields, 'program_description', '[Program Description]')}",
                f"Effective Date: {eff}",
                f"Term: {term}",
                f"Fees: {field_value(fields, 'fees', '[Fees]')}",
                f"Governing Law: {field_value(fields, 'governing_law', '[Governing Law]')}",
                f"Chosen Courts: {field_value(fields, 'chosen_courts', '[Chosen Courts]')}",
            ],
        ),
        Section(
            heading="Standard Terms Summary",
            body=[
                "1. Design Partner Overview. Partner will have early access to the Product during "
                "the Term for its internal business purposes and will participate in the Program "
                "by giving Feedback to Provider.",
                "2. Product Improvement. Provider may use all Feedback and insights from the "
                "Program freely, without restriction, to develop and improve the Product for "
                "general availability.",
                "3. Fees. Partner will pay Provider the Fees listed on the Cover Page, if any.",
                "4. Term and Termination. The Agreement starts on the Effective Date and continues "
                "for the Term. Either party may terminate by giving 30 days advance notice.",
                "5. Confidentiality. Each party will protect the other party's Confidential "
                "Information, use it only to fulfill this Agreement, and return or destroy it on "
                "termination.",
                "6. Intellectual Property. Provider retains all rights to the Product. Provider "
                "owns all Feedback and any improvements created in response to the Program.",
                "7. Disclaimer of Warranties. The Product is provided AS IS without warranties of "
                "any kind, to the extent permitted by law.",
                "8. Governing Law. Disputes are governed by the Governing Law and resolved "
                "exclusively in the Chosen Courts listed on the Cover Page.",
            ],
        ),
        Section(
            heading="Signatures",
            body=[
                "By signing below, each party agrees to enter into this Design Partner Agreement "
                "as of the Effective Date.",
                f"Provider: {provider}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
                f"Partner: {partner}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
            ],
        ),
        Section(
            heading="Attribution",
            body=[
                "Based on the Common Paper Design Partner Agreement Standard Terms "
                "(https://commonpaper.com/standards/design-partner-agreement/), licensed under "
                "CC BY 4.0. Modified by LexDraft. Not legal advice."
            ],
        ),
    ]


DOCUMENT = DocumentType(
    id="design-partner-agreement",
    name="Design Partner Agreement",
    category="Partnership",
    short_description="Early-customer design partnership for co-developing a product, covering feedback rights and IP ownership.",
    keywords=(
        "design partner",
        "early access",
        "pilot partner",
        "beta",
        "co-development",
        "feedback agreement",
    ),
    fields=FIELDS,
    render=render,
    filename_slug="design-partner-agreement",
    source_url="https://commonpaper.com/standards/design-partner-agreement/",
)

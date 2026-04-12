"""Data Processing Agreement (Common Paper DPA) — cover page."""
from __future__ import annotations

from .types import DocumentType, FieldSpec, Section, field_value

FIELDS: tuple[FieldSpec, ...] = (
    FieldSpec("customer_company", "Customer (Controller) company", "The company sending personal data"),
    FieldSpec("customer_notice_address", "Customer notice address", "Notice address for the Customer"),
    FieldSpec("provider_company", "Provider (Processor) company", "The company processing personal data on behalf of the Customer"),
    FieldSpec("provider_notice_address", "Provider notice address", "Notice address for the Provider"),
    FieldSpec("service_name", "Service covered", "Name of the service whose data this DPA governs"),
    FieldSpec(
        "data_subjects",
        "Categories of data subjects",
        'Who the personal data is about, e.g. "Customer end users, Customer employees"',
    ),
    FieldSpec(
        "personal_data_categories",
        "Categories of personal data",
        'What personal data is processed, e.g. "Contact info, account credentials, usage data"',
    ),
    FieldSpec(
        "processing_purpose",
        "Nature and purpose of processing",
        'Why the data is processed, e.g. "To provide and maintain the Service"',
    ),
    FieldSpec(
        "processing_duration",
        "Duration of processing",
        'How long processing lasts, e.g. "For the duration of the Agreement plus retention period"',
    ),
    FieldSpec("governing_law", "Governing law", "US state whose law governs the DPA"),
)

def render(fields: dict[str, str | int]) -> list[Section]:
    customer = field_value(fields, "customer_company", "[Customer]")
    provider = field_value(fields, "provider_company", "[Provider]")

    return [
        Section(
            heading="Data Processing Agreement",
            body=[
                f"This Data Processing Agreement (DPA) is entered into between {customer} (the "
                f'"Customer") and {provider} (the "Provider"). It consists of this Cover Page and '
                "the Common Paper Data Processing Agreement Standard Terms Version 1.0, which are "
                "incorporated by reference."
            ],
        ),
        Section(
            heading="Cover Page",
            body=[
                f"Customer: {customer}",
                f"Customer Notice Address: {field_value(fields, 'customer_notice_address', '[Customer Notice Address]')}",
                f"Provider: {provider}",
                f"Provider Notice Address: {field_value(fields, 'provider_notice_address', '[Provider Notice Address]')}",
                f"Service: {field_value(fields, 'service_name', '[Service Name]')}",
                f"Governing Law: {field_value(fields, 'governing_law', '[Governing Law]')}",
            ],
        ),
        Section(
            heading="Annex I — Processing Details",
            body=[
                f"Categories of Data Subjects: {field_value(fields, 'data_subjects', '[Data Subjects]')}",
                f"Categories of Personal Data: {field_value(fields, 'personal_data_categories', '[Personal Data Categories]')}",
                f"Nature and Purpose of Processing: {field_value(fields, 'processing_purpose', '[Processing Purpose]')}",
                f"Duration of Processing: {field_value(fields, 'processing_duration', '[Processing Duration]')}",
                f"Roles: {customer} is the Controller. {provider} is the Processor.",
            ],
        ),
        Section(
            heading="Standard Terms Summary",
            body=[
                "1. Processing. Provider will process Personal Data only on Customer's documented "
                "instructions, as described in this DPA and the underlying Agreement.",
                "2. Confidentiality. Provider will ensure that personnel processing Personal Data "
                "are bound by appropriate confidentiality obligations.",
                "3. Security. Provider will implement appropriate technical and organizational "
                "measures to protect Personal Data against unauthorized or unlawful processing, "
                "loss, or destruction.",
                "4. Subprocessors. Provider may engage subprocessors only with Customer's general "
                "authorization and will impose equivalent data-protection obligations on them.",
                "5. International Transfers. Cross-border transfers will be governed by the "
                "applicable standard contractual clauses as described in the Standard Terms.",
                "6. Data Subject Requests. Provider will assist Customer in responding to requests "
                "from data subjects exercising their rights under applicable data protection laws.",
                "7. Personal Data Breach. Provider will notify Customer without undue delay after "
                "becoming aware of a Personal Data breach and will cooperate in responding.",
                "8. Deletion or Return. Upon termination, Provider will delete or return Personal "
                "Data as directed by Customer, subject to applicable legal retention requirements.",
                "9. Audits. Customer may audit Provider's compliance as described in the Standard "
                "Terms, typically through third-party certifications and reports.",
            ],
        ),
        Section(
            heading="Signatures",
            body=[
                "By signing below, each party agrees to enter into this DPA.",
                f"Customer: {customer}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
                f"Provider: {provider}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
            ],
        ),
        Section(
            heading="Attribution",
            body=[
                "Based on the Common Paper Data Processing Agreement Version 1.0 "
                "(https://commonpaper.com/standards/data-processing-agreement/1.0), licensed under "
                "CC BY 4.0. Modified by LexDraft. Not legal advice."
            ],
        ),
    ]


DOCUMENT = DocumentType(
    id="data-processing-agreement",
    name="Data Processing Agreement",
    category="Data Privacy",
    short_description="GDPR-compatible DPA addendum defining processor obligations for personal data handled on behalf of a controller.",
    keywords=(
        "dpa",
        "data processing",
        "gdpr",
        "data protection",
        "personal data",
        "controller",
        "processor",
    ),
    fields=FIELDS,
    render=render,
    filename_slug="data-processing-agreement",
    source_url="https://commonpaper.com/standards/data-processing-agreement/1.0",
)

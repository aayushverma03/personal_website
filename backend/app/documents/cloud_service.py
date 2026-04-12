"""Cloud Service Agreement (Common Paper CSA) — cover page + Standard Terms reference."""
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
    FieldSpec("provider_company", "Provider company", "The company offering the cloud service"),
    FieldSpec("provider_notice_address", "Provider notice address", "Email or postal address for legal notices to the Provider"),
    FieldSpec("customer_company", "Customer company", "The company subscribing to the cloud service"),
    FieldSpec("customer_notice_address", "Customer notice address", "Email or postal address for legal notices to the Customer"),
    FieldSpec("service_name", "Cloud Service name", 'Product name of the service, e.g. "Acme Analytics Cloud"'),
    FieldSpec("service_description", "Service description", "One-sentence description of what the service does"),
    FieldSpec(
        "subscription_start_date",
        "Subscription start date",
        "First day of the subscription (YYYY-MM-DD)",
        type="date",
    ),
    FieldSpec(
        "subscription_term_months",
        "Subscription term (months)",
        "Length of the initial subscription period in months",
        type="integer",
    ),
    FieldSpec("fees", "Fees", 'Total or recurring fees, e.g. "$12,000/year" or "$1,000/month"'),
    FieldSpec(
        "payment_terms",
        "Payment terms",
        'How and when Customer pays, e.g. "Net 30 after invoice"',
    ),
    FieldSpec("governing_law", "Governing law", "US state whose law governs the agreement"),
    FieldSpec("jurisdiction", "Jurisdiction", "Courts with exclusive jurisdiction"),
)

def render(fields: dict[str, str | int]) -> list[Section]:
    provider = field_value(fields, "provider_company", "[Provider]")
    customer = field_value(fields, "customer_company", "[Customer]")
    start = fmt_long_date(field_value(fields, "subscription_start_date"), "[Start Date]")
    term = unit_word(coerce_int(fields.get("subscription_term_months"), 12), "month")

    return [
        Section(
            heading="Cloud Service Agreement",
            body=[
                f"This Cloud Service Agreement is entered into between {provider} and {customer}. "
                "It consists of this Order Form and the Common Paper Cloud Service Agreement "
                "Standard Terms Version 1.0, which are incorporated by reference."
            ],
        ),
        Section(
            heading="Order Form",
            body=[
                f"Provider: {provider}",
                f"Provider Notice Address: {field_value(fields, 'provider_notice_address', '[Provider Notice Address]')}",
                f"Customer: {customer}",
                f"Customer Notice Address: {field_value(fields, 'customer_notice_address', '[Customer Notice Address]')}",
                f"Cloud Service: {field_value(fields, 'service_name', '[Service Name]')}",
                f"Service Description: {field_value(fields, 'service_description', '[Service Description]')}",
                f"Subscription Start Date: {start}",
                f"Subscription Period: {term}",
                f"Fees: {field_value(fields, 'fees', '[Fees]')}",
                f"Payment Process: {field_value(fields, 'payment_terms', '[Payment Terms]')}",
                f"Governing Law: {field_value(fields, 'governing_law', '[Governing Law]')}",
                f"Jurisdiction: {field_value(fields, 'jurisdiction', '[Jurisdiction]')}",
            ],
        ),
        Section(
            heading="Standard Terms Summary",
            body=[
                "1. Service. Customer may access and use the Cloud Service for its internal "
                "business purposes during the Subscription Period. Provider will offer support as "
                "described in the Order Form.",
                "2. Restrictions. Customer will not reverse engineer, resell, interfere with, or "
                "use the Service to build a competing product, or submit prohibited data.",
                "3. Privacy and Security. Provider will maintain reasonable administrative, "
                "physical, and technical safeguards. If personal data governed by GDPR is "
                "submitted, the parties will execute a Data Processing Agreement.",
                "4. Payment and Taxes. Customer will pay Fees in USD (unless otherwise specified) "
                "according to the Payment Process in the Order Form. Fees are exclusive of taxes.",
                "5. Term and Termination. The Agreement runs for the Subscription Period listed "
                "and may auto-renew per the Order Form. Either party may terminate for uncured "
                "material breach.",
                "6. Warranties and Disclaimers. Provider warrants it will deliver the Service in a "
                "professional manner. EXCEPT AS EXPRESSLY STATED, THE SERVICE IS PROVIDED \"AS IS\" "
                "AND PROVIDER DISCLAIMS ALL OTHER WARRANTIES.",
                "7. Indemnification and Liability. Each party's indemnification obligations and "
                "limitation of liability are as described in the Standard Terms.",
                "8. Governing Law. Disputes are governed by the law of the state listed, and the "
                "parties submit to the exclusive jurisdiction of the courts listed in the Order "
                "Form.",
            ],
        ),
        Section(
            heading="Signatures",
            body=[
                "By signing below, each party agrees to enter into this Cloud Service Agreement.",
                f"Provider: {provider}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
                f"Customer: {customer}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
            ],
        ),
        Section(
            heading="Attribution",
            body=[
                "Based on the Common Paper Cloud Service Agreement Standard Terms Version 1.0 "
                "(https://commonpaper.com/standards/cloud-service-agreement/1.0), licensed under "
                "CC BY 4.0. Modified by LexDraft. Not legal advice."
            ],
        ),
    ]


DOCUMENT = DocumentType(
    id="cloud-service-agreement",
    name="Cloud Service Agreement",
    category="SaaS / Cloud Services",
    short_description="SaaS subscription agreement covering access, fees, data rights, and service terms.",
    keywords=(
        "saas",
        "cloud",
        "subscription",
        "csa",
        "service agreement",
        "terms of service",
        "cloud service",
    ),
    fields=FIELDS,
    render=render,
    filename_slug="cloud-service-agreement",
    source_url="https://commonpaper.com/standards/cloud-service-agreement/1.0",
)

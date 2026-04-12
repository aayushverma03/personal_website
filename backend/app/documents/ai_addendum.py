"""AI Addendum (Common Paper AI Addendum v1.0)."""
from __future__ import annotations

from .types import DocumentType, FieldSpec, Section, field_value

FIELDS: tuple[FieldSpec, ...] = (
    FieldSpec("provider_company", "Provider company", "The company offering the AI-enabled service"),
    FieldSpec("customer_company", "Customer company", "The company subscribing to the AI-enabled service"),
    FieldSpec(
        "underlying_agreement",
        "Underlying agreement",
        'Name and date of the base agreement this addendum supplements, e.g. "Cloud Service Agreement dated Jan 5, 2026"',
    ),
    FieldSpec(
        "ai_services",
        "AI services covered",
        'Which parts of the product include AI features, e.g. "Model-powered document summarization"',
    ),
    FieldSpec(
        "training_permitted",
        "Training permitted",
        'Whether Provider may train its models on Customer inputs/outputs. "Yes" or "No".',
    ),
    FieldSpec(
        "training_data",
        "Training data",
        'If training is permitted, which data. "None" if not permitted.',
    ),
    FieldSpec(
        "training_purposes",
        "Training purposes",
        'If training is permitted, the purposes. "None" if not permitted.',
    ),
    FieldSpec(
        "training_restrictions",
        "Training restrictions",
        'Any limits on training, e.g. "Must be aggregated and de-identified". "None" if not permitted.',
    ),
    FieldSpec(
        "improvement_restrictions",
        "Improvement restrictions",
        'Any limits on non-training use to improve the AI System, e.g. "Must not retain customer-identifiable data beyond 30 days"',
    ),
)

def render(fields: dict[str, str | int]) -> list[Section]:
    provider = field_value(fields, "provider_company", "[Provider]")
    customer = field_value(fields, "customer_company", "[Customer]")
    training = field_value(fields, "training_permitted", "[Training Permitted]")

    return [
        Section(
            heading="AI Addendum",
            body=[
                f"This AI Addendum supplements the agreement identified below between {provider} "
                f'(the "Provider") and {customer} (the "Customer") and is governed by the Common '
                "Paper AI Addendum Standard Terms Version 1.0, which are incorporated by reference."
            ],
        ),
        Section(
            heading="Cover Page",
            body=[
                f"Provider: {provider}",
                f"Customer: {customer}",
                f"Underlying Agreement: {field_value(fields, 'underlying_agreement', '[Underlying Agreement]')}",
                f"AI Services: {field_value(fields, 'ai_services', '[AI Services]')}",
                f"Training Permitted: {training}",
                f"Training Data: {field_value(fields, 'training_data', '[Training Data]')}",
                f"Training Purposes: {field_value(fields, 'training_purposes', '[Training Purposes]')}",
                f"Training Restrictions: {field_value(fields, 'training_restrictions', '[Training Restrictions]')}",
                f"Improvement Restrictions: {field_value(fields, 'improvement_restrictions', '[Improvement Restrictions]')}",
            ],
        ),
        Section(
            heading="1. AI Services",
            body=[
                "1.1 Using AI Services. The AI Services are part of the Product and subject to the "
                "underlying agreement as supplemented by this AI Addendum. Customer may use the AI "
                "Services by providing Input, and the AI Services may generate Output in response.",
                "1.2 Restrictions. Customer will not use the AI Services for regulated "
                "decision-making without human oversight, to infringe intellectual property rights, "
                "or to falsely state that Output was created by a human.",
                "1.3 Model Training. Unless the Cover Page permits Training, Provider will not use "
                "Customer's Inputs or Outputs to Train any Model. If Training is permitted, it is "
                "limited to the Training Data, Training Purposes, and Training Restrictions listed "
                "on the Cover Page.",
                "1.4 Non-Training Improvement. Subject to the Improvement Restrictions listed on "
                "the Cover Page, Provider may use Inputs, Outputs, and Training Data to maintain, "
                "develop, and improve the AI System in ways that do not constitute Training.",
            ],
        ),
        Section(
            heading="2. Intellectual Property and Privacy",
            body=[
                "2.1 Ownership. As between the parties, Customer retains all rights in Input and "
                "owns all Output. To the extent permitted by law, Provider assigns to Customer all "
                "rights in Output.",
                "2.2 Personal Data. Nothing in this AI Addendum reduces Provider's obligations "
                "under applicable data protection laws for any Personal Data contained in Input.",
                "2.3 Rights to Input. Customer represents that it and its Users have the rights "
                "necessary to submit Input to the AI Services.",
            ],
        ),
        Section(
            heading="3. Disclaimers",
            body=[
                "3.1 Nature of AI. Due to the nature of artificial intelligence, Output may be "
                "incorrect or inaccurate. The AI Services are not human and are not a substitute "
                "for human oversight. Output may not be protectable as intellectual property.",
                "3.2 Similarity of Output. Output may resemble or be duplicative of data or "
                "materials created by the AI Services for others. Provider does not warrant that "
                "Output will not incorporate third-party data or that Output will not be "
                "reproduced in similar form for other users.",
            ],
        ),
        Section(
            heading="Signatures",
            body=[
                "By signing below, each party agrees to this AI Addendum.",
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
                "Based on the Common Paper AI Addendum Standard Terms Version 1.0 "
                "(https://commonpaper.com/standards/ai-addendum/1.0/), licensed under CC BY 4.0. "
                "Modified by LexDraft. Not legal advice."
            ],
        ),
    ]


DOCUMENT = DocumentType(
    id="ai-addendum",
    name="AI Addendum",
    category="AI / Technology",
    short_description="Addendum covering AI-specific terms such as training-data use, model outputs, and AI disclosures.",
    keywords=(
        "ai",
        "artificial intelligence",
        "ml",
        "machine learning",
        "ai addendum",
        "model training",
        "generative ai",
    ),
    fields=FIELDS,
    render=render,
    filename_slug="ai-addendum",
    source_url="https://commonpaper.com/standards/ai-addendum/1.0/",
)

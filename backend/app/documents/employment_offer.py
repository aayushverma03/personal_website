"""Employment Offer Letter (OpenAgreements v1.1)."""
from __future__ import annotations

from .types import DocumentType, FieldSpec, Section, field_value, fmt_long_date

FIELDS: tuple[FieldSpec, ...] = (
    FieldSpec("employer_name", "Employer name", "Full legal name of the hiring company"),
    FieldSpec("employee_name", "Employee name", "Full name of the person being hired"),
    FieldSpec("position_title", "Position title", 'Job title, e.g. "Senior Software Engineer"'),
    FieldSpec(
        "employment_type",
        "Employment type",
        'Full-time, part-time, or contract, e.g. "Full-time, exempt"',
    ),
    FieldSpec("start_date", "Start date", "First day of employment (YYYY-MM-DD)", type="date"),
    FieldSpec(
        "reporting_manager",
        "Reporting manager",
        "Name or function of the person or team the employee reports to",
    ),
    FieldSpec("base_salary", "Base salary", 'Compensation with units, e.g. "$140,000 per year"'),
    FieldSpec(
        "bonus_terms",
        "Bonus terms",
        'Summary of bonus eligibility. "None" if not applicable.',
    ),
    FieldSpec(
        "equity_terms",
        "Equity terms",
        'Summary of equity grant. "None" if not applicable.',
    ),
    FieldSpec("work_location", "Primary work location", 'City/state, remote, or hybrid'),
    FieldSpec("governing_law", "Governing law", 'US state whose law governs, e.g. "Delaware"'),
    FieldSpec(
        "offer_expiration_date",
        "Offer expiration date",
        "Date by which the employee must accept (YYYY-MM-DD)",
        type="date",
    ),
)

def render(fields: dict[str, str | int]) -> list[Section]:
    employer = field_value(fields, "employer_name", "[Employer]")
    employee = field_value(fields, "employee_name", "[Employee]")
    start = fmt_long_date(field_value(fields, "start_date"), "[Start Date]")
    expires = fmt_long_date(field_value(fields, "offer_expiration_date"), "[Offer Expiration]")

    cover_terms = [
        f"Employer: {employer}",
        f"Employee: {employee}",
        f"Position Title: {field_value(fields, 'position_title', '[Position Title]')}",
        f"Employment Type: {field_value(fields, 'employment_type', '[Employment Type]')}",
        f"Start Date: {start}",
        f"Reporting Manager: {field_value(fields, 'reporting_manager', '[Reporting Manager]')}",
        f"Base Salary: {field_value(fields, 'base_salary', '[Base Salary]')}",
        f"Bonus Terms: {field_value(fields, 'bonus_terms', '[Bonus Terms]')}",
        f"Equity Terms: {field_value(fields, 'equity_terms', '[Equity Terms]')}",
        f"Primary Work Location: {field_value(fields, 'work_location', '[Work Location]')}",
        f"Governing Law: {field_value(fields, 'governing_law', '[Governing Law]')}",
        f"Offer Expiration Date: {expires}",
    ]

    return [
        Section(
            heading="Employment Offer Letter",
            body=[
                f"{employer} is pleased to offer {employee} employment on the terms described in "
                "this letter. This offer letter consists of the Cover Terms below and the "
                "OpenAgreements Employment Offer Letter Standard Terms (v1.1), which are "
                "incorporated by reference."
            ],
        ),
        Section(heading="Cover Terms", body=cover_terms),
        Section(
            heading="Standard Terms Summary",
            body=[
                "1. Position and Reporting. Employee will serve in the position listed in Cover "
                "Terms and report to the manager listed in Cover Terms, with duties reasonably "
                "aligned to the role.",
                "2. Employment Type and Schedule. Employee will be employed on the basis listed in "
                "Cover Terms, subject to reasonable scheduling and attendance expectations.",
                "3. Start Date and Onboarding. Employment begins on the start date listed, subject "
                "to completion of onboarding, background and work-authorization checks, and "
                "execution of confidentiality and inventions assignment documents.",
                "4. Compensation. Employer will pay the base salary listed in Cover Terms in "
                "accordance with standard payroll practices and applicable withholdings.",
                "5. Bonus and Equity. Any bonus or equity terms listed remain subject to applicable "
                "plan documents, board/committee approval, and separate award agreements.",
                "6. Benefits. Employee may be eligible for benefit and paid-time-off programs "
                "available to similarly situated employees, subject to plan terms.",
                "7. Work Location. Employee will primarily work from the location listed. "
                "Reasonable business travel may be required.",
                "8. Policies and Confidentiality. As a condition of employment, Employee must "
                "comply with written policies, confidentiality obligations, and lawful workplace "
                "rules.",
                "9. At-Will Employment. Unless otherwise required by law, employment is at-will: "
                "either Employer or Employee may end the employment relationship at any time, with "
                "or without cause or notice.",
                "10. Governing Law. This letter is governed by the law of the state listed in "
                "Cover Terms, without regard to conflicts-of-law principles.",
                "11. Offer Expiration and Acceptance. This offer expires on the date listed unless "
                "extended in writing. By accepting, Employee acknowledges this letter summarizes "
                "key terms and any changes must be in writing and signed by an authorized "
                "representative of Employer.",
            ],
        ),
        Section(
            heading="Signatures",
            body=[
                "By signing below, each party agrees to the Cover Terms and the OpenAgreements "
                "Employment Offer Letter Standard Terms (v1.1).",
                f"Employer: {employer}",
                "Signature: ______________________________",
                "Name: ______________________________",
                "Title: ______________________________",
                "Date: ______________________________",
                f"Employee: {employee}",
                "Signature: ______________________________",
                "Date: ______________________________",
            ],
        ),
        Section(
            heading="Attribution",
            body=[
                "Based on the OpenAgreements Employment Offer Letter v1.1, free to use under "
                "CC BY 4.0. Modified by LexDraft. Not legal advice."
            ],
        ),
    ]


DOCUMENT = DocumentType(
    id="employment-offer-letter",
    name="Employment Offer Letter",
    category="Employment / HR",
    short_description="Formal offer letter covering compensation, role, start date, and standard employment terms.",
    keywords=(
        "offer",
        "employment",
        "hire",
        "hiring",
        "job offer",
        "offer letter",
        "employment letter",
    ),
    fields=FIELDS,
    render=render,
    filename_slug="employment-offer-letter",
    source_url="https://openagreements.org/",
)

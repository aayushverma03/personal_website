"""Mutual Non-Disclosure Agreement (Common Paper MNDA v1.0)."""
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
    FieldSpec("party1_company", "Party 1 company", "Full legal name of Party 1 (the first entity)"),
    FieldSpec("party1_signatory_name", "Party 1 signatory", "Name of the person signing for Party 1"),
    FieldSpec("party1_title", "Party 1 signatory title", "Title of the Party 1 signer"),
    FieldSpec("party1_address", "Party 1 notice address", "Email or postal address for legal notices to Party 1"),
    FieldSpec("party2_company", "Party 2 company", "Full legal name of Party 2"),
    FieldSpec("party2_signatory_name", "Party 2 signatory", "Name of the person signing for Party 2"),
    FieldSpec("party2_title", "Party 2 signatory title", "Title of the Party 2 signer"),
    FieldSpec("party2_address", "Party 2 notice address", "Email or postal address for legal notices to Party 2"),
    FieldSpec("purpose", "Purpose", "Why confidential information is being shared (a short sentence)"),
    FieldSpec(
        "effective_date",
        "Effective date",
        "ISO date YYYY-MM-DD; defaults to today if not specified",
        type="date",
    ),
    FieldSpec("mnda_term_years", "MNDA term (years)", "How long the MNDA itself lasts. Default 1", type="integer"),
    FieldSpec(
        "confidentiality_term_years",
        "Confidentiality term (years)",
        "How long information stays confidential. Default 1",
        type="integer",
    ),
    FieldSpec("governing_law_state", "Governing law state", "US state whose law governs. Default Delaware"),
    FieldSpec(
        "jurisdiction",
        "Jurisdiction",
        'Courts with exclusive jurisdiction. Default "New Castle County, Delaware"',
    ),
)

def render(fields: dict[str, str | int]) -> list[Section]:
    p1 = field_value(fields, "party1_company", "[Party 1]")
    p2 = field_value(fields, "party2_company", "[Party 2]")
    purpose = field_value(fields, "purpose", "[Purpose]")
    date_str = fmt_long_date(field_value(fields, "effective_date"), "[Effective Date]")
    gov = field_value(fields, "governing_law_state", "[Governing Law]")
    jur = field_value(fields, "jurisdiction", "[Jurisdiction]")
    mnda_term = unit_word(coerce_int(fields.get("mnda_term_years"), 1), "year")
    conf_term = unit_word(coerce_int(fields.get("confidentiality_term_years"), 1), "year")

    return [
        Section(
            heading="Mutual Non-Disclosure Agreement",
            body=[
                f'This Mutual Non-Disclosure Agreement (the "MNDA") is entered into as of {date_str} '
                f'(the "Effective Date") by and between {p1} and {p2} (each a "Party" and together '
                f'the "Parties"). This MNDA consists of this Cover Page and the Common Paper Mutual '
                f'NDA Standard Terms Version 1.0 (the "Standard Terms").'
            ],
        ),
        Section(
            heading="Cover Page",
            body=[
                f"Purpose: {purpose}",
                f"Effective Date: {date_str}",
                f"MNDA Term: Expires {mnda_term} from the Effective Date.",
                f"Term of Confidentiality: {conf_term} from the Effective Date, but in the case of "
                "trade secrets until the Confidential Information is no longer considered a trade "
                "secret under applicable laws.",
                f"Governing Law: State of {gov}.",
                f"Jurisdiction: Courts located in {jur}.",
            ],
        ),
        Section(
            heading="1. Introduction",
            body=[
                'This MNDA allows each party ("Disclosing Party") to disclose or make available '
                "information in connection with the Purpose which (1) the Disclosing Party "
                'identifies to the receiving party ("Receiving Party") as "confidential", '
                '"proprietary", or the like or (2) should be reasonably understood as confidential '
                "or proprietary due to its nature and the circumstances of its disclosure "
                '("Confidential Information"). Each party\'s Confidential Information also includes '
                "the existence and status of the parties' discussions and information on the Cover "
                "Page. Confidential Information includes technical or business information, product "
                "designs or roadmaps, requirements, pricing, security and compliance documentation, "
                "technology, inventions and know-how."
            ],
        ),
        Section(
            heading="2. Use and Protection of Confidential Information",
            body=[
                "The Receiving Party shall: (a) use Confidential Information solely for the Purpose; "
                "(b) not disclose Confidential Information to third parties without the Disclosing "
                "Party's prior written approval, except that the Receiving Party may disclose "
                "Confidential Information to its employees, agents, advisors, contractors and other "
                "representatives having a reasonable need to know for the Purpose, provided these "
                "representatives are bound by confidentiality obligations no less protective of the "
                "Disclosing Party than the applicable terms in this MNDA and the Receiving Party "
                "remains responsible for their compliance with this MNDA; and (c) protect "
                "Confidential Information using at least the same protections the Receiving Party "
                "uses for its own similar information but no less than a reasonable standard of care."
            ],
        ),
        Section(
            heading="3. Exceptions",
            body=[
                "The Receiving Party's obligations in this MNDA do not apply to information that it "
                "can demonstrate: (a) is or becomes publicly available through no fault of the "
                "Receiving Party; (b) it rightfully knew or possessed prior to receipt from the "
                "Disclosing Party without confidentiality restrictions; (c) it rightfully obtained "
                "from a third party without confidentiality restrictions; or (d) it independently "
                "developed without using or referencing the Confidential Information."
            ],
        ),
        Section(
            heading="4. Disclosures Required by Law",
            body=[
                "The Receiving Party may disclose Confidential Information to the extent required "
                "by law, regulation or regulatory authority, subpoena or court order, provided (to "
                "the extent legally permitted) it provides the Disclosing Party reasonable advance "
                "notice of the required disclosure and reasonably cooperates, at the Disclosing "
                "Party's expense, with the Disclosing Party's efforts to obtain confidential "
                "treatment for the Confidential Information."
            ],
        ),
        Section(
            heading="5. Term and Termination",
            body=[
                f"This MNDA commences on the Effective Date and expires {mnda_term} after the "
                "Effective Date. Either party may terminate this MNDA for any or no reason upon "
                "written notice to the other party. The Receiving Party's obligations relating to "
                f"Confidential Information will survive for {conf_term} from the Effective Date, "
                "despite any expiration or termination of this MNDA."
            ],
        ),
        Section(
            heading="6. Return or Destruction of Confidential Information",
            body=[
                "Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier "
                "request, the Receiving Party will: (a) cease using Confidential Information; (b) "
                "promptly after the Disclosing Party's written request, destroy all Confidential "
                "Information in the Receiving Party's possession or control or return it to the "
                "Disclosing Party; and (c) if requested by the Disclosing Party, confirm its "
                "compliance with these obligations in writing. The Receiving Party may retain "
                "Confidential Information in accordance with its standard backup or record "
                "retention policies or as required by law, but the terms of this MNDA will continue "
                "to apply to the retained Confidential Information."
            ],
        ),
        Section(
            heading="7. Proprietary Rights",
            body=[
                "The Disclosing Party retains all of its intellectual property and other rights in "
                "its Confidential Information and its disclosure to the Receiving Party grants no "
                "license under such rights."
            ],
        ),
        Section(
            heading="8. Disclaimer",
            body=[
                'ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT '
                "WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS "
                "FOR A PARTICULAR PURPOSE."
            ],
        ),
        Section(
            heading="9. Governing Law and Jurisdiction",
            body=[
                "This MNDA and all matters relating hereto are governed by, and construed in "
                f"accordance with, the laws of the State of {gov}, without regard to the conflict "
                "of laws provisions of such state. Any legal suit, action, or proceeding relating "
                f"to this MNDA must be instituted in the courts located in {jur}. Each party "
                "irrevocably submits to the exclusive jurisdiction of such courts in any such suit, "
                "action, or proceeding."
            ],
        ),
        Section(
            heading="10. Equitable Relief",
            body=[
                "A breach of this MNDA may cause irreparable harm for which monetary damages are "
                "an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is "
                "entitled to seek appropriate equitable relief, including an injunction, in "
                "addition to its other remedies."
            ],
        ),
        Section(
            heading="11. General",
            body=[
                "Neither party has an obligation under this MNDA to disclose Confidential "
                "Information to the other or proceed with any proposed transaction. Neither party "
                "may assign this MNDA without the prior written consent of the other party, except "
                "that either party may assign this MNDA in connection with a merger, "
                "reorganization, acquisition or other transfer of all or substantially all its "
                "assets or voting securities. This MNDA (including the Cover Page) constitutes the "
                "entire agreement of the parties with respect to its subject matter, and supersedes "
                "all prior and contemporaneous understandings, agreements, representations, and "
                "warranties, whether written or oral, regarding such subject matter. This MNDA may "
                "only be amended, modified, waived, or supplemented by an agreement in writing "
                "signed by both parties. This MNDA may be executed in counterparts, including "
                "electronic copies, each of which is deemed an original and which together form "
                "the same agreement."
            ],
        ),
        Section(
            heading="Signatures",
            body=[
                "By signing below, each party agrees to enter into this MNDA as of the Effective Date.",
                p1,
                "Signature: ______________________________",
                f"Name: {field_value(fields, 'party1_signatory_name', '[Name]')}",
                f"Title: {field_value(fields, 'party1_title', '[Title]')}",
                f"Notice Address: {field_value(fields, 'party1_address', '[Address]')}",
                "Date: ______________________________",
                p2,
                "Signature: ______________________________",
                f"Name: {field_value(fields, 'party2_signatory_name', '[Name]')}",
                f"Title: {field_value(fields, 'party2_title', '[Title]')}",
                f"Notice Address: {field_value(fields, 'party2_address', '[Address]')}",
                "Date: ______________________________",
            ],
        ),
        Section(
            heading="Attribution",
            body=[
                "Based on the Common Paper Mutual NDA Version 1.0 "
                "(https://commonpaper.com/standards/mutual-nda/1.0), licensed under CC BY 4.0. "
                "Modified by LexDraft."
            ],
        ),
    ]


DOCUMENT = DocumentType(
    id="mutual-nda",
    name="Mutual Non-Disclosure Agreement",
    category="Confidentiality",
    short_description="Bilateral NDA protecting confidential information exchanged between two parties.",
    keywords=("nda", "non-disclosure", "confidentiality", "mutual nda", "mnda"),
    fields=FIELDS,
    render=render,
    filename_slug="mnda",
    source_url="https://commonpaper.com/standards/mutual-nda/1.0",
)

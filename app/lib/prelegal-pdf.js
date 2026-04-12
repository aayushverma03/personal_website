import { jsPDF } from "jspdf";

const MARGIN_X = 64;
const MARGIN_TOP = 64;
const MARGIN_BOTTOM = 72;

const TITLE_SIZE = 26;
const HEADING_SIZE = 12;
const BODY_SIZE = 11;
const BODY_LEADING = 16;
const PARA_GAP = 6;
const SECTION_GAP = 18;

const ATTR_LABEL_SIZE = 8;
const ATTR_BODY_SIZE = 9;
const ATTR_LEADING = 12;

const WORDMARK_SIZE = 8;
const FOOTER_SIZE = 8;

const INK_900 = [14, 21, 36];
const INK_700 = [42, 51, 80];
const INK_400 = [107, 112, 130];
const INK_200 = [194, 198, 211];
const BRASS_600 = [184, 137, 46];

function sanitizeFilename(value) {
  return (value || "document")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "document";
}

function setTextRgb(doc, rgb) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setDrawRgb(doc, rgb) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

export function generatePrelegalPdf(sections) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN_X * 2;
  const bottomLimit = pageHeight - MARGIN_BOTTOM;

  let cursorY = MARGIN_TOP;

  function ensureSpace(needed) {
    if (cursorY + needed > bottomLimit) {
      doc.addPage();
      cursorY = MARGIN_TOP;
    }
  }

  function writeParagraph(paragraph, size, leading, font, style, color) {
    doc.setFont(font, style);
    doc.setFontSize(size);
    setTextRgb(doc, color);
    const lines = doc.splitTextToSize(paragraph, contentWidth);

    for (const line of lines) {
      ensureSpace(leading);
      doc.text(line, MARGIN_X, cursorY);
      cursorY += leading;
    }
  }

  function writeBody(section, size, leading, font, style, color) {
    section.body.forEach((paragraph, index) => {
      writeParagraph(paragraph, size, leading, font, style, color);
      if (index < section.body.length - 1) cursorY += PARA_GAP;
    });
  }

  const titleSection = sections?.[0];
  if (!titleSection) return doc;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(WORDMARK_SIZE);
  setTextRgb(doc, BRASS_600);
  doc.text("LEXDRAFT", MARGIN_X, cursorY);
  cursorY += 28;

  doc.setFont("times", "bold");
  doc.setFontSize(TITLE_SIZE);
  setTextRgb(doc, INK_900);
  const titleLines = doc.splitTextToSize(titleSection.heading, contentWidth);

  for (const line of titleLines) {
    ensureSpace(TITLE_SIZE + 4);
    doc.text(line, MARGIN_X, cursorY);
    cursorY += TITLE_SIZE + 2;
  }

  cursorY += 14;
  setDrawRgb(doc, BRASS_600);
  doc.setLineWidth(1);
  doc.line(MARGIN_X, cursorY, MARGIN_X + contentWidth, cursorY);
  cursorY += 22;

  writeBody(titleSection, BODY_SIZE, BODY_LEADING, "helvetica", "normal", INK_700);
  cursorY += SECTION_GAP;

  for (let index = 1; index < sections.length; index += 1) {
    const section = sections[index];
    const isAttribution = section.heading.trim().toLowerCase() === "attribution";
    const isLast = index === sections.length - 1;

    if (isAttribution && isLast) {
      cursorY += 6;
      ensureSpace(40);
      setDrawRgb(doc, INK_200);
      doc.setLineWidth(0.5);
      doc.line(MARGIN_X, cursorY, MARGIN_X + contentWidth, cursorY);
      cursorY += 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(ATTR_LABEL_SIZE);
      setTextRgb(doc, BRASS_600);
      doc.text("ATTRIBUTION", MARGIN_X, cursorY);
      cursorY += 12;
      writeBody(section, ATTR_BODY_SIZE, ATTR_LEADING, "helvetica", "italic", INK_400);
      continue;
    }

    ensureSpace(HEADING_SIZE + 8 + BODY_LEADING * 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(HEADING_SIZE);
    setTextRgb(doc, INK_900);
    doc.text(section.heading, MARGIN_X, cursorY);
    cursorY += HEADING_SIZE + 8;

    writeBody(section, BODY_SIZE, BODY_LEADING, "helvetica", "normal", INK_700);
    cursorY += SECTION_GAP;
  }

  const docLabel = titleSection.heading;
  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    const ruleY = pageHeight - MARGIN_BOTTOM + 36;
    const textY = ruleY + 14;
    setDrawRgb(doc, INK_200);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_X, ruleY, MARGIN_X + contentWidth, ruleY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FOOTER_SIZE);
    setTextRgb(doc, INK_400);
    doc.text(`LexDraft  ·  ${docLabel}`, MARGIN_X, textY);
    const pageLabel = `Page ${page} of ${totalPages}`;
    const labelWidth = doc.getTextWidth(pageLabel);
    doc.text(pageLabel, MARGIN_X + contentWidth - labelWidth, textY);
  }

  return doc;
}

export function downloadPrelegalPdf(sections, filenameBase) {
  const doc = generatePrelegalPdf(sections);
  doc.save(`${sanitizeFilename(filenameBase)}.pdf`);
}

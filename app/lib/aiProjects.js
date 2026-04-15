export const AI_PROJECTS = [
  {
    slug: "career-ai-chatbot",
    name: "Career AI Chatbot",
    status: "Live",
    route: "/ai-projects/career-ai-chatbot",
    repoUrl: "https://github.com/aayushverma03/personal_website",
    summary:
      "An AI-powered Digital Twin experience that answers career-focused questions in Ayush Verma's voice using profile-grounded context.",
    problem:
      "Recruiters, collaborators, and leadership stakeholders need fast, accurate context on Ayush's experience without scanning full resumes or long profile documents.",
    solution:
      "A modern conversational interface backed by OpenAI and a curated context layer, so visitors can ask natural-language questions and get concise, professional answers.",
    capabilities: [
      "Profile-grounded answering with strict anti-hallucination behavior.",
      "Smart fallback mode for API quota, model, or key-related failures.",
      "Quick-prompt chips for commonly asked career and project questions.",
      "Production-ready API route structure with clear error handling.",
    ],
    stack: [
      "Next.js 16 (App Router)",
      "React 19",
      "OpenAI Responses API",
      "Custom profile context grounding",
      "Responsive modern CSS component system",
    ],
    outcomes: [
      "Created a scalable base to host multiple AI projects under one portfolio.",
      "Improved discoverability of career achievements through natural interaction.",
      "Enabled a reusable project-detail pattern for future AI initiatives.",
    ],
  },
  {
    slug: "verity-ehs-platform",
    name: "Verity : EHS AI Compliance Tool",
    status: "Live",
    route: "/ai-projects/verity-ehs-platform",
    repoUrl: "https://github.com/aayushverma03/verityEHS",
    summary:
      "Verity EHS is an AI-powered compliance platform that turns dense chemical-sector regulations into searchable answers, risk-aware work permits, and photo-verified proof submissions.",
    problem:
      "EHS teams in the chemical industry juggle thousands of pages of regulations, SOPs, and safety data sheets. Finding the right rule, pre-filling risk assessments, and proving compliance at the site level is slow, manual, and error-prone.",
    solution:
      "A RAG-backed workspace lets workers search regulations in natural language, auto-generates risk-assessed work permits, issues dynamic checklists, and produces photo-verified PDF proof reports with compliance gap detection.",
    capabilities: [
      "Regulatory Q&A grounded in 1,214 chunks from 34 ingested PDFs via pgvector + GPT retrieval.",
      "Work permit workflow with AI risk pre-fill, risk scoring, and supervisor approval chain.",
      "Dynamic AI-generated inspection checklists tailored to each permit's operation and hazards.",
      "Photo-evidenced submission flow that emits a signed PDF report and flags compliance gaps.",
      "Bilingual Korean/English UI with persistent locale preference.",
    ],
    stack: [
      "Next.js 14 App Router (TypeScript, Tailwind, shadcn/ui)",
      "FastAPI backend (Python 3.12) with SQLAlchemy async + asyncpg",
      "PostgreSQL 15 + pgvector for RAG retrieval",
      "OpenAI gpt-5.4-mini + text-embedding-3-small",
      "Dockerized multi-service deploy (Postgres + backend + Next.js)",
    ],
    outcomes: [
      "Collapsed multi-hour regulation lookups into seconds of guided Q&A.",
      "Standardized the chemical-sector permit flow around a single AI-risk-aware workflow.",
      "Delivered end-to-end proof-of-compliance artifacts without manual PDF assembly.",
    ],
  },
  {
    slug: "prelegal-document-curation",
    name: "LexDraft: Prelegal AI Document Curation",
    status: "Live",
    route: "/ai-projects/prelegal-document-curation",
    repoUrl: "https://github.com/aayushverma03/prelegal",
    summary:
      "LexDraft is a chat-first pre-legal drafting workspace that guides users from intent to downloadable document outputs.",
    problem:
      "Founders and operators often need structured legal drafts quickly, but gathering required clauses and fields manually is slow, inconsistent, and error-prone.",
    solution:
      "A two-stage AI workflow first identifies the right document type, then collects required inputs through guided chat and compiles a polished draft for export.",
    capabilities: [
      "Supports six document types including NDAs, offer letters, DPAs, cloud agreements, and AI addenda.",
      "Maintains multi-draft sessions with create, switch, rename, reset, and delete controls.",
      "Tracks completion across required fields and renders final sections when drafts are complete.",
      "Includes authentication, session-aware workflows, and browser-side PDF export.",
    ],
    stack: [
      "Next.js App Router frontend (TypeScript)",
      "FastAPI backend (Python)",
      "SQLModel with SQLite persistence",
      "OpenAI-powered selection and field-collection turns",
      "Dockerized local runtime scripts",
    ],
    outcomes: [
      "Reduced drafting friction through a guided conversational flow.",
      "Created a reusable architecture for additional legal templates.",
      "Delivered a production-style full-stack AI product that can be demoed locally.",
    ],
  },
];

export function getAiProjectBySlug(slug) {
  return AI_PROJECTS.find((project) => project.slug === slug) || null;
}

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

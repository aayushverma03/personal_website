export const AI_PROJECTS = [
  {
    slug: "career-ai-chatbot",
    name: "Career AI Chatbot",
    status: "Live",
    route: "/ai-projects/career-ai-chatbot",
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
];

export function getAiProjectBySlug(slug) {
  return AI_PROJECTS.find((project) => project.slug === slug) || null;
}

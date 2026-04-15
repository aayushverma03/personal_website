import Link from "next/link";
import { notFound } from "next/navigation";

import DigitalTwinChat from "../../components/digital-twin-chat";
import SiteHeader from "../../components/site-header";
import { AI_PROJECTS, getAiProjectBySlug } from "../../lib/aiProjects";

const PRELEGAL_PROJECT_SLUG = "prelegal-document-curation";
const PRELEGAL_PORTAL_ROUTE = "/ai-projects/prelegal";
const VERITY_EHS_PROJECT_SLUG = "verity-ehs-platform";
const VERITY_EHS_PORTAL_ROUTE = "/ai-projects/verity-ehs";

export async function generateStaticParams() {
  return AI_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getAiProjectBySlug(slug);

  if (!project) {
    return {
      title: "AI Project Not Found | Ayush Verma",
    };
  }

  return {
    title: `${project.name} | AI Projects | Ayush Verma`,
    description: project.summary,
  };
}

export default async function AIProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getAiProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const isCareerAiChatbot = project.slug === "career-ai-chatbot";
  const isPrelegalProject = project.slug === PRELEGAL_PROJECT_SLUG;
  const isVerityEhsProject = project.slug === VERITY_EHS_PROJECT_SLUG;

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <SiteHeader />

      <section className="hero section-reveal project-hero">
        <p className="kicker">AI PROJECT</p>
        <h1>{project.name}</h1>
        <p className="lead">{project.summary}</p>
        <div className="hero-actions">
          <Link href="/ai-projects" className="btn btn-secondary">
            Back to AI Projects
          </Link>
          {isPrelegalProject ? (
            <Link href={PRELEGAL_PORTAL_ROUTE} className="btn btn-primary">
              Open LexDraft Portal
            </Link>
          ) : isVerityEhsProject ? (
            <Link href={VERITY_EHS_PORTAL_ROUTE} className="btn btn-primary">
              Open Verity EHS
            </Link>
          ) : (
            <a href="#live-demo" className="btn btn-primary">
              Launch Live Demo
            </a>
          )}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-repo"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.63 7.63 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub Repo
            </a>
          ) : null}
        </div>
      </section>

      <section className="content-section section-reveal">
        <div className="project-detail-grid">
          <article className="glass-card">
            <p className="kicker">Problem</p>
            <h3>Why This Project Was Built</h3>
            <p>{project.problem}</p>
          </article>
          <article className="glass-card">
            <p className="kicker">Solution</p>
            <h3>How It Works</h3>
            <p>{project.solution}</p>
          </article>
        </div>
      </section>

      <section className="content-section section-reveal">
        <div className="project-detail-grid">
          <article className="glass-card">
            <h3>Core Capabilities</h3>
            <ul>
              {project.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="glass-card">
            <h3>Technology Stack</h3>
            <ul>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="glass-card">
            <h3>Project Outcomes</h3>
            <ul>
              {project.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="live-demo" className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">LIVE PROJECT</p>
          <h2>{project.name}</h2>
        </div>
        {isCareerAiChatbot ? (
          <>
            <p className="portfolio-note">
              Ask questions about career milestones, project impact, governance
              work, and analytics leadership. The chatbot is grounded in profile
              context.
            </p>
            <DigitalTwinChat />
          </>
        ) : null}

        {isPrelegalProject ? (
          <article className="external-demo-panel lexdraft-demo-panel">
            <p className="portfolio-note">
              LexDraft is available as a smooth in-domain experience. Open the
              portal to create pre-legal drafts through guided AI workflows.
            </p>
            <div className="external-demo-actions">
              <Link href={PRELEGAL_PORTAL_ROUTE} className="btn btn-primary">
                Open LexDraft Portal
              </Link>
            </div>

            <div className="lexdraft-preview-grid" aria-label="LexDraft flow preview">
              <article className="lexdraft-preview-card">
                <p className="lexdraft-preview-step">Step 1</p>
                <h3>Choose Document Type</h3>
                <p>
                  Start with the right draft from NDA, offer letter, DPA, cloud
                  agreement, and AI-specific templates.
                </p>
              </article>
              <article className="lexdraft-preview-card">
                <p className="lexdraft-preview-step">Step 2</p>
                <h3>Complete Guided Inputs</h3>
                <p>
                  LexDraft collects required fields in chat flow and tracks
                  completion so nothing critical is missed.
                </p>
              </article>
              <article className="lexdraft-preview-card">
                <p className="lexdraft-preview-step">Step 3</p>
                <h3>Generate Draft Output</h3>
                <p>
                  Review sectioned content and export polished output for quick
                  legal-review handoff.
                </p>
              </article>
            </div>

            <div className="lexdraft-mini-preview" aria-label="LexDraft homepage mini preview">
              <div className="lexdraft-mini-content">
                <p className="lexdraft-mini-brand">LexDraft</p>
                <h3>LexDraft : Prelegal AI Curration Tool</h3>
                <p className="lexdraft-mini-copy">
                  A guided, chat-first flow that helps teams generate complete
                  pre-legal drafts faster.
                </p>
                <div className="lexdraft-mini-actions">
                  <Link href={PRELEGAL_PORTAL_ROUTE} className="lexdraft-mini-btn is-primary">
                    Start Drafting
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ) : null}

        {isVerityEhsProject ? (
          <article className="external-demo-panel lexdraft-demo-panel">
            <p className="portfolio-note">
              Verity EHS is live as an in-domain workspace. Open the portal to
              search regulations, raise work permits, and generate
              compliance-verified proof reports.
            </p>
            <div className="external-demo-actions">
              <Link href={VERITY_EHS_PORTAL_ROUTE} className="btn btn-primary">
                Open Verity EHS
              </Link>
            </div>

            <div className="lexdraft-preview-grid" aria-label="Verity EHS flow preview">
              <article className="lexdraft-preview-card">
                <p className="lexdraft-preview-step">Step 1</p>
                <h3>Search Regulations</h3>
                <p>
                  Ask in natural language across 34 ingested PDFs; answers cite
                  the exact regulation and excerpt.
                </p>
              </article>
              <article className="lexdraft-preview-card">
                <p className="lexdraft-preview-step">Step 2</p>
                <h3>Raise a Work Permit</h3>
                <p>
                  AI pre-fills hazards, PPE, and risk score; a supervisor
                  reviews and approves before site work begins.
                </p>
              </article>
              <article className="lexdraft-preview-card">
                <p className="lexdraft-preview-step">Step 3</p>
                <h3>Submit Proof of Compliance</h3>
                <p>
                  Complete a dynamic checklist with photo evidence; get a
                  signed PDF report with compliance gaps flagged.
                </p>
              </article>
            </div>
          </article>
        ) : null}

        {!isCareerAiChatbot && !isPrelegalProject && !isVerityEhsProject ? (
          <p className="portfolio-note">
            Live demo module for this project will be attached in the next
            release.
          </p>
        ) : null}
      </section>
    </main>
  );
}

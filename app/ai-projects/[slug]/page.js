import Link from "next/link";
import { notFound } from "next/navigation";

import DigitalTwinChat from "../../components/digital-twin-chat";
import SiteHeader from "../../components/site-header";
import { AI_PROJECTS, getAiProjectBySlug } from "../../lib/aiProjects";

const PRELEGAL_PROJECT_SLUG = "prelegal-document-curation";
const PRELEGAL_PORTAL_ROUTE = "/ai-projects/prelegal";

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
          ) : (
            <a href="#live-demo" className="btn btn-primary">
              Launch Live Demo
            </a>
          )}
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

        {!isCareerAiChatbot && !isPrelegalProject ? (
          <p className="portfolio-note">
            Live demo module for this project will be attached in the next
            release.
          </p>
        ) : null}
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import DigitalTwinChat from "../../components/digital-twin-chat";
import SiteHeader from "../../components/site-header";
import { AI_PROJECTS, getAiProjectBySlug } from "../../lib/aiProjects";

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
          <a href="#live-demo" className="btn btn-primary">
            Launch Live Demo
          </a>
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
          <h2>Career AI Chatbot</h2>
        </div>
        <p className="portfolio-note">
          Ask questions about career milestones, project impact, governance work,
          and analytics leadership. The chatbot is grounded in profile context.
        </p>
        <DigitalTwinChat />
      </section>
    </main>
  );
}

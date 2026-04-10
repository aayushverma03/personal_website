import Link from "next/link";

import SiteHeader from "../components/site-header";
import { AI_PROJECTS } from "../lib/aiProjects";

export const metadata = {
  title: "AI Projects | Ayush Verma",
  description:
    "Explore AI projects by Ayush Verma, including production-ready applied builds.",
};

export default function AIProjectsPage() {
  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <SiteHeader />

      <section className="hero section-reveal project-landing">
        <p className="kicker">AI PROJECTS</p>
        <h1>Applied AI builds with business-first execution.</h1>
        <p className="lead">
          A growing collection of practical AI projects spanning copilots,
          governance-aligned assistants, and decision intelligence solutions.
        </p>
      </section>

      <section className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">PROJECT DIRECTORY</p>
          <h2>Current live project portfolio.</h2>
        </div>
        <div className="roadmap-grid ai-project-grid">
          {AI_PROJECTS.map((project) => (
            <article key={project.slug} className="roadmap-card">
              <p className="roadmap-tag">{project.status}</p>
              <h3>{project.name}</h3>
              <p className="roadmap-summary">{project.summary}</p>
              <div className="project-card-actions">
                <Link href={project.route} className="btn btn-secondary">
                  Open Project
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

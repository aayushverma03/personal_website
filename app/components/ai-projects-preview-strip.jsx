import Link from "next/link";

import { AI_PROJECTS } from "../lib/aiProjects";

export default function AIProjectsPreviewStrip() {
  return (
    <section className="ai-preview-strip section-reveal" aria-label="AI Projects Preview">
      <div className="ai-preview-track">
        {AI_PROJECTS.map((project) => (
          <Link key={project.slug} href={project.route} className="ai-preview-item">
            <span className="ai-preview-icon" aria-hidden />
            <span className="ai-preview-name">{project.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

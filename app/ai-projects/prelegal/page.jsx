import Link from "next/link";

export const metadata = {
  title: "LexDraft | Prelegal Workspace",
  description:
    "Chat-first legal draft creation workflow for NDAs, offer letters, DPAs, and more.",
};

export default function PrelegalLandingPage() {
  return (
    <main className="pl-landing-shell">
      <header className="pl-landing-header">
        <Link href="/ai-projects/prelegal" className="pl-logo-link">
          LexDraft
        </Link>
        <nav className="pl-landing-nav" aria-label="Prelegal actions">
          <Link href="/ai-projects/prelegal/login" className="pl-nav-link">
            Sign in
          </Link>
          <Link href="/ai-projects/prelegal/signup" className="pl-btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <section className="pl-hero">
        <p className="pl-hero-kicker">AI legal drafting</p>
        <h1>Draft sharp legal documents by chatting with AI.</h1>
        <p>
          LexDraft turns a conversation into a production-ready NDA, offer
          letter, DPA, and more, polished, attributable, and ready to
          download.
        </p>
        <div className="pl-hero-actions">
          <Link href="/ai-projects/prelegal/signup" className="pl-btn-primary">
            Start drafting
          </Link>
          <Link href="/ai-projects/prelegal/login" className="pl-btn-muted">
            Sign in
          </Link>
        </div>
      </section>

      <section className="pl-features-grid" aria-label="Core features">
        <article className="pl-feature-card">
          <h2>Six templates</h2>
          <p>
            Mutual NDA, offer letter, cloud service agreement, DPA, design
            partner agreement, and AI addendum.
          </p>
        </article>
        <article className="pl-feature-card">
          <h2>Chat-first workflow</h2>
          <p>
            Describe what you need. The assistant picks the best template and
            collects each required field through guided questions.
          </p>
        </article>
        <article className="pl-feature-card">
          <h2>Open-source sources</h2>
          <p>
            Built on Common Paper (CC BY 4.0) and Open Agreements (MIT).
            Attribution preserved in every export.
          </p>
        </article>
      </section>

      <footer className="pl-landing-footer">
        LexDraft is not a law firm and does not provide legal advice.
      </footer>
    </main>
  );
}

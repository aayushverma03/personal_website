import Image from "next/image";
import DigitalTwinChat from "./components/digital-twin-chat";

const navItems = [
  { label: "About", href: "#about" },
  { label: "AI Twin", href: "#digital-twin" },
  { label: "Journey", href: "#journey" },
  { label: "Expertise", href: "#expertise" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

const highlights = [
  { value: "10+", label: "Years in Data, Strategy & Analytics" },
  { value: "15+", label: "AI Use Cases Defined for Government Ops" },
  { value: "85%+", label: "Forecast Accuracy for High-Impact Models" },
  { value: "$20M+", label: "Daily GMV Targets Supported at noon" },
];

const journey = [
  {
    period: "Feb 2025 - Present",
    role: "Engagement Lead, Data & AI Consultant",
    org: "Contango",
    location: "Abu Dhabi",
    points: [
      "Defined 15+ AI use cases for Q Mobility through executive workshops with 25+ stakeholders.",
      "Led enterprise MDM rollout across 6+ domains with governance, steward onboarding, and data quality rules.",
      "Delivered real-time demand forecasting for ADREC using 50+ indicators with 85%+ accuracy.",
    ],
  },
  {
    period: "Aug 2023 - Jan 2025",
    role: "Manager, Data Strategy & Transformation",
    org: "Silal",
    location: "Dubai, UAE",
    points: [
      "Spearheaded organization-wide data and analytics strategy aligned to business growth priorities.",
      "Built CDE and governance foundations to improve quality and enable analytics and AI execution.",
      "Led BI implementations with CXOs and cross-functional teams to improve decision velocity.",
    ],
  },
  {
    period: "Apr 2022 - Aug 2023",
    role: "Analytics Manager, Growth & Strategy",
    org: "right farm / Namshi.com (Consulting)",
    location: "United Arab Emirates",
    points: [
      "Drove revenue acceleration and margin expansion through customer analytics and pricing strategies.",
      "Improved funnel and conversion outcomes via growth diagnostics, attribution improvements, and rapid execution.",
      "Built ETL and reporting foundations across Microsoft BC, MongoDB, AWS, and BigQuery for scalable insights.",
    ],
  },
  {
    period: "Jul 2019 - Mar 2022",
    role: "Senior Business Analyst -> Manager (Growth, Product & Marketing Analytics)",
    org: "noon",
    location: "Dubai, UAE",
    points: [
      "Developed a GMV first-touch attribution model to track channel contribution and improve commercial decision clarity.",
      "Led daily standups to track performance trends, campaign issues, and channel-level movement across onsite initiatives.",
      "Optimized customer journey and category strategy to reduce drop-offs and improve retention.",
      "Enabled $20M+ daily GMV targets through brand, assortment, onsite performance, and campaign optimization.",
      "Supported product, marketing, onsite, and commercial/pricing strategy decisions with data-led recommendations.",
    ],
  },
  {
    period: "2016 - 2019",
    role: "Consultant / Business Analyst",
    org: "EXL & Axtria",
    location: "Gurgaon, India",
    points: [
      "Delivered analytics, remediation, and customer-experience insights for Fortune 50 clients.",
      "Built reporting, scenario logic, and dashboard frameworks that improved operational clarity.",
      "Strengthened hands-on analytics depth in data engineering, model diagnostics, and business storytelling.",
    ],
  },
];

const expertise = [
  {
    title: "Data Strategy & Governance",
    body: "Enterprise data strategy, MDM, CDE design, stewardship models, and governance operating models.",
  },
  {
    title: "AI & Advanced Analytics",
    body: "Agentic AI development, Microsoft Copilot Studio, forecasting, attribution, and decision intelligence.",
  },
  {
    title: "Growth & Commercial Analytics",
    body: "Customer journey optimization, category strategy, campaign analytics, and revenue/margin acceleration.",
  },
  {
    title: "Execution Leadership",
    body: "Cross-functional delivery, stakeholder alignment, PMO rigor, and translating strategy into measurable outcomes.",
  },
];

const certifications = [
  "AI Coder: Vibe Coder to Agentic Engineer",
  "AI Leader: Generative AI & Agentic AI for Leaders & Founders",
  "Microsoft Copilot Studio: Low-Code AI Agent Development",
  "Microsoft Purview: Data Catalog & Data Governance",
  "Generative AI for Business Leaders",
  "R Programming",
  "Power BI: Dashboards for Beginners",
  "Using Power BI with Excel",
  "Foundation of Digital Marketing & E-commerce",
];

const education = [
  "IIT Roorkee - Bachelor's Degree (2012-2016)",
  "IIT Roorkee - McKinsey Forward Program: Management Consulting (2022-2023)",
  "Columbia Business School - Digital Strategies for Business Transformation (2024)",
];

const honors = [
  "Master Solver (2015)",
  "Gold Medal",
  "Green Olympiad",
  "Gold and Silver Medals in Hockey",
];

const portfolioProjects = [
  {
    title: "Enterprise MDM & Data Governance Program",
    tag: "Project",
    summary:
      "Designed and executed an enterprise data governance and MDM foundation across multiple domains and source systems.",
    outcomes: [
      "Defined golden-record strategy, matching and survivorship logic, and stewardship workflows.",
      "Operationalized CDEs, data quality rule design, and governance ownership model.",
      "Connected governance workflow to analytics-readiness and decision trust.",
    ],
  },
  {
    title: "Microsoft Copilot Studio Agent Development",
    tag: "Certification + Applied Capability",
    summary:
      "Built practical capability in low-code enterprise AI agent delivery using Copilot Studio and Azure OpenAI patterns.",
    outcomes: [
      "Worked across RAG grounding, connector strategy, workflow orchestration, and prompt design.",
      "Strengthened deployment considerations for testing, security, and tenant governance.",
      "Translated agent concepts into business-ready digital teammate workflows.",
    ],
  },
  {
    title: "Microsoft Purview Data Catalog & Governance",
    tag: "Certification + Applied Governance",
    summary:
      "Expanded hands-on governance practice across metadata, cataloging, lineage, profiling, and glossary design.",
    outcomes: [
      "Covered governance scanning patterns across Azure SQL, ADLS, Power BI, and Fabric workspaces.",
      "Improved understanding of discoverability, trust, and policy-aligned analytics.",
      "Reinforced implementation approach for enterprise catalog and semantic governance layers.",
    ],
  },
  {
    title: "Football Performance Analytics (Side Project)",
    tag: "Side Project",
    summary:
      "Built an AI-driven concept for football player evaluation using accessible mobile video and computer vision.",
    outcomes: [
      "Explored player tracking, motion analytics, and sports-specific metric extraction workflows.",
      "Designed product journey from capture to benchmark scorecards and coaching insight outputs.",
      "Structured benchmark thinking by age, level, region, and role for fair player comparison.",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a href="#" className="brand">
          <span className="brand-photo-wrap">
            <Image
              src="/ayush_photo.jpeg"
              alt="Ayush Verma"
              width={52}
              height={52}
              className="brand-photo"
              priority
            />
          </span>
          <span className="brand-text-block">
            <span className="brand-name">AYUSH VERMA</span>
            <span className="brand-subtitle">Data, Strategy & AI</span>
          </span>
        </a>
        <nav>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="hero section-reveal">
        <p className="kicker">DATA GOVERNANCE, STRATEGY & AI</p>
        <h1>
          Enterprise-grade execution
          <br />
          with a builder&apos;s edge.
        </h1>
        <p className="lead">
          I am Ayush Verma, a data and transformation leader based in Abu Dhabi.
          Over the last decade, I have partnered with government and commercial
          organizations to design scalable data foundations, unlock AI value, and
          convert complex signals into measurable business outcomes.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="mailto:aayushmuz3294@gmail.com">
            Connect via Email
          </a>
          <a
            className="btn btn-secondary"
            href="https://www.linkedin.com/in/ayush-v-a2899665"
            target="_blank"
            rel="noreferrer"
          >
            View LinkedIn
          </a>
        </div>
      </section>

      <section className="highlights section-reveal" aria-label="Career Highlights">
        {highlights.map((item) => (
          <article key={item.label} className="highlight-card">
            <p className="highlight-value">{item.value}</p>
            <p className="highlight-label">{item.label}</p>
          </article>
        ))}
      </section>

      <section id="about" className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">ABOUT</p>
          <h2>Strategic clarity. Operational depth. Lasting transformation.</h2>
        </div>
        <div className="about-grid">
          <article className="glass-card">
            <h3>What I Focus On</h3>
            <p>
              Building high-trust data ecosystems that connect strategy, execution,
              and intelligence across the enterprise.
            </p>
          </article>
          <article className="glass-card">
            <h3>How I Operate</h3>
            <p>
              I work at the intersection of C-suite priorities and delivery teams,
              translating business ambition into practical data and AI programs.
            </p>
          </article>
          <article className="glass-card">
            <h3>Where I Create Impact</h3>
            <p>
              Government, e-commerce, retail, agriculture, and mobility contexts
              where decisions must be fast, accurate, and scalable.
            </p>
          </article>
        </div>
      </section>

      <section id="journey" className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">CAREER JOURNEY</p>
          <h2>From analyst foundations to enterprise AI transformation.</h2>
        </div>
        <div className="timeline">
          {journey.map((item) => (
            <article key={`${item.org}-${item.period}`} className="timeline-card">
              <div className="timeline-meta">
                <p>{item.period}</p>
                <span>{item.location}</span>
              </div>
              <h3>{item.role}</h3>
              <p className="org">{item.org}</p>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="digital-twin" className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">DIGITAL TWIN</p>
          <h2>Ask my AI twin about my career journey and impact.</h2>
        </div>
        <p className="portfolio-note">
          This chat is grounded in my profile and experience. Ask about my roles,
          projects, skills, and outcomes across government and commercial sectors.
        </p>
        <DigitalTwinChat />
      </section>

      <section id="expertise" className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">EXPERTISE</p>
          <h2>Capabilities built for complex, high-stakes environments.</h2>
        </div>
        <div className="expertise-grid">
          {expertise.map((item) => (
            <article key={item.title} className="expertise-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">CREDENTIALS</p>
          <h2>Certifications, education, and recognition.</h2>
        </div>
        <div className="stacked-columns">
          <article className="glass-card">
            <h3>Certifications</h3>
            <ul>
              {certifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="glass-card">
            <h3>Education</h3>
            <ul>
              {education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="glass-card">
            <h3>Honors & Awards</h3>
            <ul>
              {honors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="portfolio" className="content-section section-reveal">
        <div className="section-head">
          <p className="kicker">PORTFOLIO</p>
          <h2>Selected projects, side work, and certification-backed builds.</h2>
        </div>
        <p className="portfolio-note">
          A snapshot of practical work spanning enterprise delivery, governance,
          AI agents, and experimental product development.
        </p>
        <div className="roadmap-grid">
          {portfolioProjects.map((item) => (
            <article key={item.title} className="roadmap-card">
              <p className="roadmap-tag">{item.tag}</p>
              <h3>{item.title}</h3>
              <p className="roadmap-summary">{item.summary}</p>
              <ul>
                {item.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact section-reveal">
        <p className="kicker">LET&apos;S BUILD</p>
        <h2>Open to strategic leadership, transformation, and AI mandates.</h2>
        <p>
          If you are scaling data capability or operationalizing AI in a complex
          organization, I would love to connect.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="mailto:aayushmuz3294@gmail.com">
            aayushmuz3294@gmail.com
          </a>
          <a className="btn btn-secondary" href="/Profile.pdf" target="_blank" rel="noreferrer">
            View Profile PDF
          </a>
        </div>
      </section>
    </main>
  );
}

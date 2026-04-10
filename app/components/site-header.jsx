import Image from "next/image";
import Link from "next/link";

import { AI_PROJECTS } from "../lib/aiProjects";

const NAV_ITEMS = [
  { label: "About", href: "/#about" },
  { label: "Journey", href: "/#journey" },
  { label: "Expertise", href: "/#expertise" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
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
      </Link>

      <nav aria-label="Primary">
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}

          <li className="nav-dropdown">
            <Link className="nav-dropdown-trigger" href="/ai-projects">
              AI Projects
            </Link>
            <div className="nav-dropdown-menu" role="menu" aria-label="AI Projects">
              {AI_PROJECTS.map((project) => (
                <Link
                  key={project.slug}
                  href={project.route}
                  className="nav-dropdown-item"
                  role="menuitem"
                >
                  <span className="nav-dropdown-item-title">{project.name}</span>
                  <span className="nav-dropdown-item-meta">{project.status}</span>
                </Link>
              ))}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

# AGENTS.md - Full Project Context for Future Sessions

This file is a durable project memory for the `SITE` project so that future chats/agents can continue work without re-discovery.

## 1) Project Identity

- Project name: `ayush-verma-website`
- Repository intent: personal portfolio website + AI project showcase + AI career assistant (Digital Twin) + in-domain Prelegal document curation portal
- Framework: Next.js App Router
- Runtime: Next.js (Node.js) + FastAPI (Python) with optional single Docker container
- Current local root: `/Users/ayush/Documents/Projects/SITE`
- Public domain target: `ayush-verma.com` and `www.ayush-verma.com`

## 2) Goals Completed

Primary goals completed during this project:

1. Build a high-end personal website with "enterprise meets edgy" visual direction.
2. Populate content using profile data from `Profile.pdf`.
3. Add future portfolio section, then upgrade it to real project/certification content using `extra_experience.pdf`.
4. Add AI chat section (Digital Twin) using OpenAI model `gpt-5.4-mini`.
5. Improve Digital Twin UI to a modern chat widget style.
6. Add profile photo and stronger personal branding in header.
7. Add additional `noon` experience details requested by user.
8. Prepare GitHub push workflow and deployment runbook for EC2 + GoDaddy + HTTPS.
9. Produce beginner tutorial documentation (`tutorial.md`).
10. Add an `AI Projects` top navigation tab with hover/focus dropdown behavior and dedicated project pages.
11. Add `Prelegal AI Document Curation` as an AI project entry under the shared AI Projects navigation and directory.
12. Build in-domain Prelegal routes under `SITE` (`/ai-projects/prelegal`, login, signup, creator) so the product can run under one domain.
13. Add API rewrite proxy in `next.config.mjs` from `/api/prelegal/*` to the external Prelegal backend (`PRELEGAL_BACKEND_URL`).
14. Embed Prelegal portal preview iframe in the AI project detail page.
15. Implement real PDF export for Prelegal creator in the `SITE` app using `jspdf`.
16. Add responsive/mobile optimization for the in-domain Prelegal UI while preserving original visual style.
17. Add PRELEGAL runtime parity in `SITE`:
    - copy backend source under `SITE/backend`
    - add Docker multi-stage build
    - add shared entrypoint to run FastAPI + Next.js in one container
    - add docker helper scripts (`scripts/start.sh`, `scripts/stop.sh`)

## 3) Current File Map (Critical)

```text
app/
  ai-projects/page.js
  ai-projects/[slug]/page.js
  ai-projects/prelegal/layout.jsx
  ai-projects/prelegal/page.jsx
  ai-projects/prelegal/login/page.jsx
  ai-projects/prelegal/signup/page.jsx
  ai-projects/prelegal/creator/page.jsx
  api/digital-twin/route.js
  components/digital-twin-chat.jsx
  components/prelegal/auth-form.jsx
  components/prelegal/creator-app.jsx
  components/site-header.jsx
  lib/aiProjects.js
  lib/digitalTwinContext.js
  lib/prelegal-api.js
  lib/prelegal-pdf.js
  globals.css
  layout.js
  page.js

public/
  Profile.pdf
  ayush_photo.jpeg

backend/
  app/main.py
  app/chat.py
  app/auth.py
  app/documents/*
  pyproject.toml
  uv.lock
  data/.gitkeep

scripts/
  entrypoint.sh
  start.sh
  stop.sh
  run-dev.sh

root:
  .dockerignore
  Dockerfile
  Profile.pdf
  extra_experience.pdf
  ayush_photo.jpeg
  package.json
  package-lock.json
  next.config.mjs
  README.md
  tutorial.md
  agents.md
```

## 4) Data Sources Used and What Was Extracted

### 4.1 `Profile.pdf`

Problem encountered:
- The PDF text was not directly extractable via standard tools available in environment (`pdftotext` missing).

Approach used:
- Decoded PDF streams manually via Python (`zlib` decompression + ToUnicode CMap mapping).
- Reconstructed text lines by parsing PDF text operators and glyph mappings.

Information extracted and used:
- Name, location, contact details, summary narrative.
- Experience timeline across Contango, Silal, right farm/Namshi, noon, EXL, Axtria.
- Skills and certifications.
- Education and honors.

### 4.2 `extra_experience.pdf`

Problem encountered:
- Different encoding format (ReportLab + `/ASCII85Decode` + `/FlateDecode`).

Approach used:
- Decoded stream content by ASCII85 decode then zlib decompress.
- Parsed PDF `Tj` text literals to reconstruct content.

Information extracted and used:
- Recent courses (AI Coder, AI Leader, Copilot Studio, Purview).
- Expanded MDM/governance and platform capability details.
- Football analytics side project details.
- Additional positioning themes and skills inventory.

## 5) Application Architecture

### 5.1 Frontend

- Main portfolio page rendered from `app/page.js`.
- Dedicated AI project pages:
  - Project directory page: `app/ai-projects/page.js`
  - Dynamic project detail page: `app/ai-projects/[slug]/page.js`
- In-domain Prelegal pages (ported into SITE):
  - Landing: `app/ai-projects/prelegal/page.jsx`
  - Auth: `app/ai-projects/prelegal/login/page.jsx`, `app/ai-projects/prelegal/signup/page.jsx`
  - Creator workspace: `app/ai-projects/prelegal/creator/page.jsx`
  - Route-local layout wrapper: `app/ai-projects/prelegal/layout.jsx`
- Data-driven sections defined as in-file arrays:
  - `highlights`
  - `journey`
  - `expertise`
  - `certifications`
  - `education`
  - `honors`
  - `portfolioProjects`
- AI projects directory data is centralized in `app/lib/aiProjects.js`.
- Shared top navigation/header is componentized in `app/components/site-header.jsx`.
- Includes `DigitalTwinChat` component and branding photo via Next.js `Image`.
- Prelegal UI logic/components in SITE:
  - `app/components/prelegal/auth-form.jsx`
  - `app/components/prelegal/creator-app.jsx`
- Prelegal client/runtime libraries in SITE:
  - `app/lib/prelegal-api.js`
  - `app/lib/prelegal-pdf.js`

### 5.2 Styling

- All styling centralized in `app/globals.css`.
- Uses CSS custom properties for design tokens (`--bg`, `--accent`, etc).
- Includes:
  - Sticky nav/header
  - Hover + keyboard-focus AI Projects dropdown (`:hover` + `:focus-within`)
  - Animated ambient background
  - Responsive cards/timelines
  - Modern twin-widget styles
  - Mobile breakpoint optimization (dropdown converts to visible stacked menu)
  - Prelegal-specific style scope via `.prelegal-route` and `pl-*` classes for landing/auth/creator experiences
  - Prelegal iframe embed styles for AI project detail page
  - Mobile breakpoints for Prelegal at `1200`, `980`, `760`, `560`, `430`, and `390` widths

### 5.3 Backend API

- Endpoint: `POST /api/digital-twin`
- File: `app/api/digital-twin/route.js`
- OpenAI SDK call:
  - Model: `gpt-5.4-mini`
  - Input includes system prompt + recent message history.
- Message normalization:
  - Accepts only `user` and `assistant`
  - Truncates each message to 4000 chars
  - Keeps last 14 messages
- In-domain Prelegal API proxy configured in `next.config.mjs`:
  - Source route: `/api/prelegal/:path*`
  - Destination: `${PRELEGAL_BACKEND_URL}/api/:path*`
  - Default backend URL when env var missing: `http://127.0.0.1:8000`

### 5.4 AI Context Grounding

- File: `app/lib/digitalTwinContext.js`
- Contains curated career context to prevent hallucinations.
- Includes updated noon details:
  - GMV first-touch attribution model
  - Daily standups and trend/campaign tracking
  - Product/marketing/onsite/commercial strategy support

### 5.5 Reliability Fallback

`route.js` includes local fallback behavior when OpenAI path is unavailable:
- Missing API key
- Insufficient quota
- Model unavailable
- Empty provider response
- Other API failures

Fallback behavior:
- Returns `reply` from `createLocalTwinReply(question)`.
- Sets `model: "local-profile-fallback"` and `fallback: true`.
- Provides `warning` for UI display.

### 5.6 In-Domain Prelegal Integration

- AI project slug: `prelegal-document-curation`
- AI project detail page behavior:
  - Displays project metadata/capabilities from `app/lib/aiProjects.js`
  - Shows CTA to open in-domain portal (`/ai-projects/prelegal`)
  - Shows embedded iframe preview (`src=/ai-projects/prelegal`)
  - Keeps optional external standalone URL support via `PRELEGAL_DEMO_URL`
- Prelegal creator behavior in SITE:
  - Session-aware auth flows via `/api/prelegal/auth/*`
  - Draft management (`create`, `switch`, `rename`, `delete`, `reset`) via `/api/prelegal/drafts/*` and `/api/prelegal/chat/*`
  - PDF export handled client-side using `jspdf` (`app/lib/prelegal-pdf.js`)

## 6) Digital Twin UI Behavior

File: `app/components/digital-twin-chat.jsx`

Features:
- Initial assistant welcome message.
- Quick prompt chips.
- Scroll-to-bottom transcript via ref/effect.
- Timestamp per message.
- Typing/processing indicator while awaiting response.
- Disabled states during request.
- Warning/notice rendering from API (for fallback mode).

State model:
- `messages`
- `draft`
- `isSending`
- `notice`

## 7) Branding and Content Updates Applied

### 7.1 Header improvements

- `AYUSH VERMA` made larger and bolder.
- Added profile image to brand block:
  - source file copied to `public/ayush_photo.jpeg`.

### 7.2 Hero text tuning

- Hero title font size reduced slightly for improved visual balance.

### 7.3 Portfolio section upgrade

- Removed placeholder/future language.
- Added concrete entries:
  - Enterprise MDM & Data Governance Program
  - Copilot Studio Agent Development
  - Purview Data Catalog & Governance
  - Football Performance Analytics side project

### 7.4 Noon experience enhancement

- Added requested details in both UI timeline and AI context:
  - GMV first-touch attribution
  - Standup leadership and trend issue tracking
  - Product, marketing, onsite, and pricing strategy support

### 7.5 AI Projects information architecture

- Added a new top-level `AI Projects` nav tab.
- Added hover/focus dropdown listing current AI project entries.
- Added dedicated page pattern for each project with route-driven content and live demo support.

### 7.6 Prelegal integration updates

- Added `Prelegal AI Document Curation` as a first-class AI project in nav + directory + slug route.
- Added in-domain Prelegal portal routes under `SITE`:
  - `/ai-projects/prelegal`
  - `/ai-projects/prelegal/login`
  - `/ai-projects/prelegal/signup`
  - `/ai-projects/prelegal/creator`
- Added AI project detail page embed block with:
  - In-domain portal CTA
  - Standalone app CTA
  - Embedded iframe preview
  - Local runbook commands
- Preserved original Prelegal visual direction while adding phone-first responsive behavior.

## 8) Build/Test Validation History

Repeated checks performed across iterations:

1. `npm run build`
- Status: passed after each major update.
- Verified app routes included:
  - `/`
  - `/_not-found`
  - `/ai-projects`
  - `/ai-projects/[slug]` with static params:
    - `career-ai-chatbot`
    - `prelegal-document-curation`
  - `/ai-projects/prelegal`
  - `/ai-projects/prelegal/login`
  - `/ai-projects/prelegal/signup`
  - `/ai-projects/prelegal/creator`
  - `/api/digital-twin`

2. Digital Twin endpoint smoke tests (local)
- `curl -X POST http://localhost:3000/api/digital-twin ...`
- Verified both:
  - OpenAI path responses
  - fallback responses with warning on provider limitations

3. Static/structure checks
- Verified file creation and references.
- Verified removal of placeholder terms when requested.

4. Unicode lint check
- Used regex scan to ensure edited files were ASCII-safe unless needed.

5. Deep route/API functional check after AI Projects rollout
- Started production server and validated:
  - Home renders `AI Projects` nav with dropdown item `Career AI Chatbot`.
  - `/ai-projects` renders project list page.
  - `/ai-projects/career-ai-chatbot` renders dedicated project detail page and live demo anchor.
  - `POST /api/digital-twin` returns valid JSON `reply`.

6. Prelegal in-domain route and embed validation
- Verified:
  - `/ai-projects/prelegal` landing content renders with CTA links
  - `/ai-projects/prelegal-document-curation` shows in-domain portal CTA + iframe block
  - Auth routes render without prerender errors (via Suspense wrapping around `useSearchParams`)

7. Prelegal API rewrite integration checks
- Ran Prelegal backend + SITE app together and verified:
  - `GET /api/prelegal/health` responds `{"status":"ok"}`
  - `GET /api/prelegal/documents` returns supported document metadata via SITE domain proxy

## 9) Tooling and Environment Constraints Encountered

Important constraints discovered during implementation:

- System had no global Node/npm initially.
- Installed local Node in project path: `.local/node`.
- Package installs required elevated network permission.
- Dev server port binding required elevated execution in this environment.
- `pdftotext` unavailable; custom PDF extraction scripts were required.
- Google Fonts fetch can fail in restricted/offline build environments; route-level styling uses robust fallback font stacks for Prelegal pages.

## 10) Local Development Runbook

### 10.1 SITE only (portfolio + AI project pages)

```bash
cd /Users/ayush/Documents/Projects/SITE
./scripts/run-dev.sh
```

### 10.2 Build check

```bash
cd /Users/ayush/Documents/Projects/SITE
PATH="$(pwd)/.local/node/bin:$PATH" npm run build
```

### 10.3 In-domain Prelegal mode (recommended local setup)

Terminal 1 (Prelegal backend):

```bash
cd /Users/ayush/Documents/Projects/PRELEGAL/backend
./.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Terminal 2 (SITE frontend):

```bash
cd /Users/ayush/Documents/Projects/SITE
PATH="$(pwd)/.local/node/bin:$PATH" npm run dev
```

Then open:
- `http://localhost:3000/ai-projects/prelegal`
- `http://localhost:3000/ai-projects/prelegal-document-curation`

### 10.4 Optional environment variables for Prelegal integration

- `PRELEGAL_BACKEND_URL` (default: `http://127.0.0.1:8000`)
- `PRELEGAL_DEMO_URL` (default: `http://127.0.0.1:3400`)

## 11) Deployment Runbook (EC2 + GoDaddy + HTTPS)

User-specific deployment context captured:
- EC2 public IPv4: `13.60.68.170`
- Host form shown by AWS: `ec2-13-60-68-170.eu-north-1.compute.amazonaws.com`
- Username likely: `ubuntu`
- Key filename shown by AWS: `websiter_server.pem`
- DNS provider: GoDaddy

### 11.1 DNS records expected in GoDaddy

- `A` record: `@ -> 13.60.68.170`
- `CNAME` record: `www -> ayush-verma.com`

Important cleanup note:
- Remove conflicting `A @ -> WebsiteBuilder Site` if present.

### 11.2 EC2 deployment command sequence (high level)

1. Install packages: nginx, git, curl, nodejs, certbot.
2. Clone repo on EC2.
3. Create `.env` with `OPENAI_API_KEY`.
4. Build app (`npm run build`).
5. Create and start systemd service (`personal-website.service`).
6. Configure nginx reverse proxy to `127.0.0.1:3000`.
7. Issue Let's Encrypt cert with certbot and enforce HTTP->HTTPS redirect.
8. Validate with `curl -I` checks.

### 11.3 Service name and paths

- service unit: `/etc/systemd/system/personal-website.service`
- app path on EC2: `/home/ubuntu/personal_website`
- reverse proxy upstream: `http://127.0.0.1:3000`

## 12) Git/GitHub State Notes

Actions completed in project history:
- Initial commit created with website files.
- Remote updated to `personal_website` repository URL.
- Push initially blocked by local auth constraints in tool sandbox; user later confirmed repo copy/push completed.

## 13) Security Notes

- `.env` is gitignored and should never be committed.
- OpenAI keys must remain secret and be rotated if exposed in plaintext anywhere.
- If running in-domain Prelegal locally, ensure backend secrets remain outside version control in PRELEGAL `.env`.
- Never expose `PRELEGAL_BACKEND_URL` to untrusted origins if backend is bound beyond localhost.
- On EC2, lock `.env` permissions:

```bash
chmod 600 /home/ubuntu/personal_website/.env
```

- Restart service after secret change:

```bash
sudo systemctl restart personal-website
```

## 14) Known Improvements (Backlog)

1. Add API rate limiting and abuse controls on `/api/digital-twin`.
2. Add authentication or session controls for public AI endpoint.
3. Add streaming responses for better chat UX.
4. Replace keyword fallback with retrieval-backed structured context.
5. Add persistence for chat history.
6. Add monitoring (uptime, latency, API error rate, fallback rate).
7. Add CI workflow for build and lint validation before deploy.
8. Add end-to-end tests for Prelegal in-domain auth/chat/draft lifecycle paths.
9. Add health indicator in UI when Prelegal backend proxy is unavailable.
10. Add deployment strategy for hosting Prelegal backend alongside SITE in production.
11. Add stronger security hardening for Prelegal auth/session flows before public launch.

## 15) Fast Recovery Checklist for Future Agents

If a future chat needs to restore project context quickly, do this:

1. Read this file (`agents.md`).
2. Read `README.md` and `tutorial.md`.
3. Verify `app/page.js` and `app/api/digital-twin/route.js` are aligned.
4. Verify AI project routing files (`app/ai-projects/page.js`, `app/ai-projects/[slug]/page.js`, `app/lib/aiProjects.js`).
5. Verify Prelegal in-domain files:
   - `app/ai-projects/prelegal/*`
   - `app/components/prelegal/*`
   - `app/lib/prelegal-api.js`
   - `app/lib/prelegal-pdf.js`
   - `next.config.mjs` rewrite for `/api/prelegal/:path*`
6. Run `npm run build`.
7. Validate:
   - `/ai-projects`
   - `/ai-projects/career-ai-chatbot`
   - `/ai-projects/prelegal-document-curation`
   - `/ai-projects/prelegal`
8. For in-domain Prelegal local checks:
   - Start Prelegal backend on `127.0.0.1:8000`
   - Verify `GET /api/prelegal/health` through SITE
9. If deployment issue:
   - Check `sudo systemctl status personal-website`
   - Check `sudo nginx -t`
   - Check cert status `sudo certbot certificates`
   - Confirm DNS records in GoDaddy.

## 16) What Must Never Be Lost in Future Edits

- Model requirement: `gpt-5.4-mini` (unless user requests change).
- Digital Twin grounding behavior and anti-hallucination prompt constraints.
- Noon-specific additions requested by user.
- Portfolio entries derived from `extra_experience.pdf`.
- Branded header with photo and stronger name typography.
- `AI Projects` navigation and dedicated project pages pattern (for scaling future AI builds).
- Prelegal project slug and route structure:
  - `/ai-projects/prelegal-document-curation`
  - `/ai-projects/prelegal`
  - `/ai-projects/prelegal/login`
  - `/ai-projects/prelegal/signup`
  - `/ai-projects/prelegal/creator`
- API rewrite contract in `next.config.mjs`: `/api/prelegal/:path*` -> `${PRELEGAL_BACKEND_URL}/api/:path*`
- In-domain Prelegal PDF export support (`jspdf` + `app/lib/prelegal-pdf.js`)
- AI project detail page embedded Prelegal preview block and in-domain portal CTA behavior

## 17) Chronological Delivery Log

This section is a practical sequence of what was delivered and why, from first build to production support.

1. Initialized a Next.js App Router project skeleton and verified baseline route rendering.
2. Defined brand direction as "enterprise meets edgy" with a dark premium palette, high-contrast typography, animated background, and card/timeline composition.
3. Built the first full portfolio page in `app/page.js` with sections for intro, highlights, journey, expertise, certifications, education, honors, and portfolio placeholder.
4. Improved responsive behavior (desktop + mobile) via media queries and component sizing in `app/globals.css`.
5. Extracted profile context from `Profile.pdf` using custom PDF stream decoding when `pdftotext` was unavailable.
6. Replaced generic biography text with profile-grounded content from the decoded resume data.
7. Added Digital Twin v1 (custom in-page chat component) and created API route `app/api/digital-twin/route.js`.
8. Integrated OpenAI path using model `gpt-5.4-mini` and `.env` key loading.
9. Added error handling + local fallback so chat continues even if provider returns quota/model/key issues.
10. Extracted `extra_experience.pdf` content (ReportLab stream decoding) and updated portfolio entries + certification details.
11. Removed placeholder/future wording from portfolio section title and cards.
12. Tuned hero headline size down for better balance based on feedback screenshot.
13. Upgraded Digital Twin styling to a more modern widget feel (chips, transcript styling, notices, timestamps, loading indicator).
14. Increased visual prominence of `AYUSH VERMA` and added photo from `ayush_photo.jpeg` into the hero brand block.
15. Added requested noon experience details:
    - GMV first-touch attribution model ownership.
    - Daily standup leadership and cross-channel performance issue tracking.
    - Product/marketing/onsite/commercial-pricing strategy support.
16. Synced noon context updates in both visible portfolio timeline and Digital Twin grounding text (`digitalTwinContext.js`).
17. Created `tutorial.md` with beginner walkthrough, tech stack summary, architecture explanation, code references, and future improvements.
18. Supported GitHub migration process to repository `personal_website`.
19. Guided EC2 + GoDaddy production deployment with HTTPS and canonical redirect strategy.
20. Diagnosed SSH confusion (`Permission denied (publickey)`) as key-path/session mismatch when attempting SSH from inside browser EC2 session instead of local machine.
21. Confirmed production build success logs (`next build`) including route output and API route registration.
22. Advised security hardening on secret handling and service restarts for rotated keys.
23. Implemented shared `SiteHeader` with `AI Projects` nav dropdown and project-item hover/focus behavior.
24. Added reusable AI projects data registry (`app/lib/aiProjects.js`) to support scaling with additional project entries.
25. Created `/ai-projects` project index page and `/ai-projects/career-ai-chatbot` dedicated project detail route.
26. Embedded live Career AI Chatbot experience in the dedicated project detail page.
27. Ran deep route/API validation in production mode for home nav labels, project listing page, project detail page, and chatbot endpoint response.
28. Added second AI project entry `prelegal-document-curation` to the shared AI project registry and dropdown/navigation.
29. Made AI project detail rendering project-aware so different slugs can render different live demo modules.
30. Added Prelegal-specific live demo panel on project detail page with:
    - in-domain portal CTA
    - standalone app CTA
    - embedded iframe preview
    - local run/stop instructions
31. Implemented in-domain Prelegal route tree in SITE:
    - `/ai-projects/prelegal`
    - `/ai-projects/prelegal/login`
    - `/ai-projects/prelegal/signup`
    - `/ai-projects/prelegal/creator`
32. Ported Prelegal auth and creator application logic into SITE components and libraries.
33. Added Next.js rewrite proxy in SITE for `/api/prelegal/:path*` to the Prelegal backend.
34. Verified rewrite integration by running both services and confirming:
    - `GET /api/prelegal/health` -> `{"status":"ok"}`
    - `GET /api/prelegal/documents` returns document catalog JSON.
35. Switched in-domain Prelegal export from text draft to real PDF via `jspdf` and a dedicated PDF renderer utility.
36. Refined Prelegal mobile responsiveness across multiple breakpoints while preserving original Prelegal design language.

## 18) Command Reference (Validated Paths)

These commands were used directly or are the exact operational equivalents used during implementation/support.

### 18.1 Local development (Mac)

```bash
cd /Users/ayush/Documents/Projects/SITE
./scripts/run-dev.sh
```

```bash
cd /Users/ayush/Documents/Projects/SITE
PATH="$(pwd)/.local/node/bin:$PATH" npm run build
```

### 18.2 Digital Twin API smoke test (local)

```bash
curl -sS -X POST http://localhost:3000/api/digital-twin \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Summarize Ayush in 3 lines"}]}'
```

### 18.3 EC2 initial setup

```bash
sudo apt update
sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 18.4 App deploy on EC2

```bash
cd /home/ubuntu
git clone <REPO_URL> personal_website
cd personal_website
npm ci
npm run build
```

### 18.5 Systemd service lifecycle

```bash
sudo systemctl daemon-reload
sudo systemctl enable personal-website
sudo systemctl restart personal-website
sudo systemctl status personal-website --no-pager
journalctl -u personal-website -n 100 --no-pager
```

### 18.6 Nginx + TLS

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ayush-verma.com -d www.ayush-verma.com
sudo certbot renew --dry-run
```

### 18.7 Endpoint verification (from anywhere)

```bash
curl -I http://ayush-verma.com
curl -I https://ayush-verma.com
curl -I https://www.ayush-verma.com
```

### 18.8 AI Projects route verification (local production mode)

```bash
PATH="$(pwd)/.local/node/bin:$PATH" npm run build
PATH="$(pwd)/.local/node/bin:$PATH" ./node_modules/.bin/next start -H 127.0.0.1 -p 3301
curl -sS http://127.0.0.1:3301/ | rg "AI Projects|Career AI Chatbot"
curl -sS http://127.0.0.1:3301/ai-projects | rg "Current live project portfolio"
curl -sS http://127.0.0.1:3301/ai-projects/career-ai-chatbot | rg "Launch Live Demo|Career AI Chatbot"
curl -sS -X POST http://127.0.0.1:3301/api/digital-twin -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What did Ayush lead at noon?"}]}'
```

### 18.9 In-domain Prelegal local run (two terminals)

Terminal 1:

```bash
cd /Users/ayush/Documents/Projects/PRELEGAL/backend
./.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Terminal 2:

```bash
cd /Users/ayush/Documents/Projects/SITE
PATH="$(pwd)/.local/node/bin:$PATH" npm run dev
```

Open:

```bash
http://localhost:3000/ai-projects/prelegal
http://localhost:3000/ai-projects/prelegal/creator
http://localhost:3000/ai-projects/prelegal-document-curation
```

### 18.10 Prelegal rewrite proxy checks (through SITE)

```bash
curl -sS http://127.0.0.1:3000/api/prelegal/health
curl -sS http://127.0.0.1:3000/api/prelegal/documents | head -c 400
```

## 19) Troubleshooting Playbook

Use this for quick diagnosis in future chats without rediscovering known failure modes.

### 19.1 `Permission denied (publickey)` during SSH

Likely cause:
- Trying to SSH from within AWS browser shell while referencing a local `.pem` file that does not exist on the instance.

Fix:
1. SSH from your local Mac terminal where `websiter_server.pem` exists.
2. Run:
   ```bash
   chmod 400 ~/path/to/websiter_server.pem
   ssh -i ~/path/to/websiter_server.pem ubuntu@ec2-13-60-68-170.eu-north-1.compute.amazonaws.com
   ```
3. If still blocked, verify EC2 security group allows inbound port `22` from your IP.

### 19.2 Domain resolves inconsistently

Likely cause:
- Conflicting GoDaddy DNS records (for example `A @ -> WebsiteBuilder Site` still present).

Fix:
1. Keep `A @ -> 13.60.68.170`.
2. Keep `CNAME www -> ayush-verma.com`.
3. Remove conflicting `A @` records.
4. Wait for TTL propagation and recheck with:
   ```bash
   dig +short ayush-verma.com
   dig +short www.ayush-verma.com
   ```

### 19.3 HTTPS not enabled or redirect not active

Likely cause:
- Certbot not executed successfully or Nginx site block missing redirect.

Fix:
1. Run `sudo certbot --nginx -d ayush-verma.com -d www.ayush-verma.com`.
2. Ensure Nginx has port `80` block redirecting to `https`.
3. Validate with `curl -I` checks.

### 19.4 App runs locally but fails as service

Likely cause:
- Missing `.env`, wrong working directory, or `ExecStart` mismatch in systemd unit.

Fix:
1. Check unit file path and commands.
2. Confirm `.env` exists at `/home/ubuntu/personal_website/.env`.
3. Inspect logs:
   ```bash
   journalctl -u personal-website -n 200 --no-pager
   ```

### 19.5 Digital Twin returns fallback unexpectedly

Likely cause:
- Missing/invalid API key, quota issue, or provider model availability issue.

Fix:
1. Verify `OPENAI_API_KEY` in `.env`.
2. Restart service.
3. Re-test `/api/digital-twin`.
4. Check logs for `warning` field returned by API.

### 19.6 Prelegal pages load but auth/chat API calls fail

Likely cause:
- Prelegal backend is not running or `PRELEGAL_BACKEND_URL` is incorrect for the current environment.

Fix:
1. Preferred (single-container run):
   ```bash
   cd /Users/ayush/Documents/Projects/SITE
   ./scripts/start.sh
   ```
2. Or start backend directly:
   ```bash
   cd /Users/ayush/Documents/Projects/SITE/backend
   ./.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
   ```
3. Verify proxy path through SITE:
   ```bash
   curl -sS http://127.0.0.1:3000/api/prelegal/health
   ```
4. If needed, set/update `PRELEGAL_BACKEND_URL` in SITE env and restart SITE server/container.

### 19.7 Prelegal login/signup page build error about `useSearchParams`

Likely cause:
- Auth form using `useSearchParams` is not wrapped in Suspense boundary at route page level.

Fix:
1. Ensure these pages wrap auth form in `<Suspense>`:
   - `app/ai-projects/prelegal/login/page.jsx`
   - `app/ai-projects/prelegal/signup/page.jsx`
2. Re-run build:
   ```bash
   PATH="$(pwd)/.local/node/bin:$PATH" npm run build
   ```

---

This document is intentionally detailed so future agent sessions can continue immediately with minimal re-discovery effort.

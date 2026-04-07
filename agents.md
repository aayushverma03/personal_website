# AGENTS.md - Full Project Context for Future Sessions

This file is a durable project memory for the `SITE` project so that future chats/agents can continue work without re-discovery.

## 1) Project Identity

- Project name: `ayush-verma-website`
- Repository intent: personal portfolio website + AI career assistant (Digital Twin)
- Framework: Next.js App Router
- Runtime: Node.js
- Current local root: `/Users/ayush/Documents/Projects/SITE`
- Public domain target: `ayush-verma.com` and `www.ayush-verma.com`

## 2) Goals Completed

Primary goals completed during this project:

1. Build a high-end personal website with "enterprise meets edgy" visual direction.
2. Populate content using profile data from `Profile.pdf`.
3. Add future portfolio section, then upgrade it to real project/certification content using `extra_experience.pdf`.
4. Add AI chat section (Digital Twin) using OpenAI model `gpt-5.3-codex`.
5. Improve Digital Twin UI to a modern chat widget style.
6. Add profile photo and stronger personal branding in header.
7. Add additional `noon` experience details requested by user.
8. Prepare GitHub push workflow and deployment runbook for EC2 + GoDaddy + HTTPS.
9. Produce beginner tutorial documentation (`tutorial.md`).

## 3) Current File Map (Critical)

```text
app/
  api/digital-twin/route.js
  components/digital-twin-chat.jsx
  lib/digitalTwinContext.js
  globals.css
  layout.js
  page.js

public/
  Profile.pdf
  ayush_photo.jpeg

scripts/
  run-dev.sh

root:
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

- Single-page portfolio rendered from `app/page.js`.
- Data-driven sections defined as in-file arrays:
  - `navItems`
  - `highlights`
  - `journey`
  - `expertise`
  - `certifications`
  - `education`
  - `honors`
  - `portfolioProjects`
- Includes `DigitalTwinChat` component and branding photo via Next.js `Image`.

### 5.2 Styling

- All styling centralized in `app/globals.css`.
- Uses CSS custom properties for design tokens (`--bg`, `--accent`, etc).
- Includes:
  - Sticky nav/header
  - Animated ambient background
  - Responsive cards/timelines
  - Modern twin-widget styles
  - Mobile breakpoint optimization

### 5.3 Backend API

- Endpoint: `POST /api/digital-twin`
- File: `app/api/digital-twin/route.js`
- OpenAI SDK call:
  - Model: `gpt-5.3-codex`
  - Input includes system prompt + recent message history.
- Message normalization:
  - Accepts only `user` and `assistant`
  - Truncates each message to 4000 chars
  - Keeps last 14 messages

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

## 8) Build/Test Validation History

Repeated checks performed across iterations:

1. `npm run build`
- Status: passed after each major update.
- Verified app routes included:
  - `/`
  - `/_not-found`
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

## 9) Tooling and Environment Constraints Encountered

Important constraints discovered during implementation:

- System had no global Node/npm initially.
- Installed local Node in project path: `.local/node`.
- Package installs required elevated network permission.
- Dev server port binding required elevated execution in this environment.
- `pdftotext` unavailable; custom PDF extraction scripts were required.

## 10) Local Development Runbook

From project root:

```bash
./scripts/run-dev.sh
```

Build check:

```bash
PATH="$(pwd)/.local/node/bin:$PATH" npm run build
```

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

## 15) Fast Recovery Checklist for Future Agents

If a future chat needs to restore project context quickly, do this:

1. Read this file (`agents.md`).
2. Read `README.md` and `tutorial.md`.
3. Verify `app/page.js` and `app/api/digital-twin/route.js` are aligned.
4. Run `npm run build`.
5. If deployment issue:
   - Check `sudo systemctl status personal-website`
   - Check `sudo nginx -t`
   - Check cert status `sudo certbot certificates`
   - Confirm DNS records in GoDaddy.

## 16) What Must Never Be Lost in Future Edits

- Model requirement: `gpt-5.3-codex` (unless user requests change).
- Digital Twin grounding behavior and anti-hallucination prompt constraints.
- Noon-specific additions requested by user.
- Portfolio entries derived from `extra_experience.pdf`.
- Branded header with photo and stronger name typography.

## 17) Chronological Delivery Log

This section is a practical sequence of what was delivered and why, from first build to production support.

1. Initialized a Next.js App Router project skeleton and verified baseline route rendering.
2. Defined brand direction as "enterprise meets edgy" with a dark premium palette, high-contrast typography, animated background, and card/timeline composition.
3. Built the first full portfolio page in `app/page.js` with sections for intro, highlights, journey, expertise, certifications, education, honors, and portfolio placeholder.
4. Improved responsive behavior (desktop + mobile) via media queries and component sizing in `app/globals.css`.
5. Extracted profile context from `Profile.pdf` using custom PDF stream decoding when `pdftotext` was unavailable.
6. Replaced generic biography text with profile-grounded content from the decoded resume data.
7. Added Digital Twin v1 (custom in-page chat component) and created API route `app/api/digital-twin/route.js`.
8. Integrated OpenAI path using model `gpt-5.3-codex` and `.env` key loading.
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

---

This document is intentionally detailed so future agent sessions can continue immediately with minimal re-discovery effort.

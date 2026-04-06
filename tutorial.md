# Tutorial: How This Personal Website Was Built (Beginner Friendly)

This tutorial explains, from scratch, what was built in this project, how it works, and how you can maintain or extend it.

## 1. What You Have Built

You now have a **Next.js 16 personal website** with:

- A premium single-page portfolio experience
- Sections for About, Journey, Expertise, Credentials, and Portfolio
- Your profile photo in the top branding area
- A modern Digital Twin chat widget
- A server-side API that talks to OpenAI (`gpt-5.3-codex`)
- A local fallback response mode if OpenAI is unavailable (for example quota/model/key issues)

---

## 2. Technology Summary

### Core stack

- **Framework**: Next.js (App Router)
- **UI**: React components + CSS (custom design system in `globals.css`)
- **AI SDK**: `openai` npm package
- **Runtime**: Node.js runtime for API route
- **Deployment mode today**: local development on port `3000`

### Why this stack

- Next.js gives both frontend pages and backend APIs in one codebase.
- React makes the chat widget interactive.
- Server-side AI calls protect your API key.
- A custom CSS system gives total visual control (instead of template-like look).

---

## 3. Project Structure (Important Files)

```text
app/
  api/digital-twin/route.js          # Backend API for chat
  components/digital-twin-chat.jsx   # Frontend chat widget
  lib/digitalTwinContext.js          # Grounding context for AI
  globals.css                        # Full site styling
  layout.js                          # Global metadata + wrapper
  page.js                            # Main homepage content

public/
  Profile.pdf                        # Resume PDF downloadable from site
  ayush_photo.jpeg                   # Profile image used in header

scripts/
  run-dev.sh                         # Helper to run dev server with local Node

package.json                         # Dependencies and scripts
```

---

## 4. How To Run It Locally

### 4.1 Environment variable

In `.env`, you should have:

```bash
OPENAI_API_KEY=your_key_here
```

### 4.2 Start dev server

```bash
cd /Users/ayush/Documents/Projects/SITE
./scripts/run-dev.sh
```

Open: `http://localhost:3000`

### 4.3 Production build check

```bash
PATH="$(pwd)/.local/node/bin:$PATH" npm run build
```

---

## 5. High-Level Architecture Walkthrough

When a user asks something in the Digital Twin widget:

1. User types in the chat box (`digital-twin-chat.jsx`)
2. Frontend sends `POST /api/digital-twin` with message history
3. API route (`route.js`) does this:
   - Validates/normalizes messages
   - Loads API key from environment
   - Builds a system prompt + profile context
   - Calls OpenAI model `gpt-5.3-codex`
4. API returns a reply JSON
5. Frontend appends response to transcript

If OpenAI is not available, API returns a **fallback profile-based reply** instead of failing hard.

---

## 6. Detailed Code Review (With Samples)

### 6.1 Global shell and metadata

File: `app/layout.js`

```jsx
import "./globals.css";

export const metadata = {
  title: "Ayush Verma | Data, Strategy & AI",
  description:
    "Professional website of Ayush Verma - Data Governance, Strategy, Analytics, and AI Transformation leader.",
};
```

### Why this matters

- Loads global styles once.
- Sets page title and description for browser/search metadata.

---

### 6.2 Main page content and sections

File: `app/page.js`

This is the main page component. It contains:

- Navigation labels (`navItems`)
- Career highlights (`highlights`)
- Journey timeline data (`journey`)
- Certifications, portfolio entries, etc.

Sample (header branding with photo):

```jsx
<header className="topbar">
  <a href="#" className="brand">
    <span className="brand-photo-wrap">
      <Image src="/ayush_photo.jpeg" alt="Ayush Verma" width={52} height={52} className="brand-photo" priority />
    </span>
    <span className="brand-text-block">
      <span className="brand-name">AYUSH VERMA</span>
      <span className="brand-subtitle">Data, Strategy & AI</span>
    </span>
  </a>
  ...
</header>
```

### Notes for beginners

- This page is mostly a data-driven UI composition.
- Changing section content is as easy as editing arrays at the top of this file.

---

### 6.3 Digital Twin UI component

File: `app/components/digital-twin-chat.jsx`

This is a **client component** (`"use client"`) because it uses React state and browser events.

### State used

- `messages`: chat transcript
- `draft`: current text area value
- `isSending`: loading state
- `notice`: warning/info text (like fallback mode notice)

Sample (API call from frontend):

```jsx
const response = await fetch("/api/digital-twin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: outgoingMessages }),
});

const payload = await response.json().catch(() => ({}));
if (!response.ok) {
  throw new Error(payload.error || "Unable to connect with Digital Twin.");
}
```

### UX patterns implemented

- Auto-scroll transcript on new messages
- Quick prompt chips to reduce friction
- Typing state bubble while waiting
- Disabled states on buttons during request
- Clear notice display for warnings

---

### 6.4 Digital Twin API route

File: `app/api/digital-twin/route.js`

This is the backend endpoint. Important points:

- Runs server-side (`runtime = "nodejs"`)
- Reads `OPENAI_API_KEY` securely from environment
- Calls model: `gpt-5.3-codex`
- Uses system prompt + profile context grounding
- Falls back to local profile responses on provider issues

Sample (OpenAI request):

```js
const response = await client.responses.create({
  model: MODEL,
  input: [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatMessages,
  ],
});
```

Sample (fallback when quota is exceeded):

```js
if (providerCode === "insufficient_quota") {
  return NextResponse.json({
    reply: createLocalTwinReply(question),
    model: "local-profile-fallback",
    fallback: true,
    warning:
      "OpenAI quota exceeded for the configured API key, switched to local profile fallback mode.",
  });
}
```

### Why this is good design

- Keeps API key secret
- Protects user experience with fallback behavior
- Gives structured warnings to frontend

---

### 6.5 Grounding context for AI answers

File: `app/lib/digitalTwinContext.js`

This file holds curated profile context used in system prompt grounding.

Why separate file is useful:

- Cleaner route code
- Easy to keep profile knowledge updated
- Lower risk of accidental UI/backend mismatch

When you add new achievements, update this file and (optionally) `app/page.js` in the same pass.

---

### 6.6 Styling system and visual design

File: `app/globals.css`

This file controls:

- Brand identity (colors, spacing, typography)
- Header and hero sizing
- Section cards and grids
- Timeline visuals
- Portfolio cards
- New 2026-style chat widget styles
- Responsive breakpoints

Sample (hero heading size tuning):

```css
.hero h1 {
  font-size: clamp(1.72rem, 4vw, 3.2rem);
  line-height: 1.04;
  max-width: 15ch;
}
```

Sample (modern twin widget container):

```css
.twin-widget {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: linear-gradient(160deg, rgba(12, 19, 34, 0.96), rgba(8, 15, 30, 0.92));
  padding: 1rem;
  display: grid;
  gap: 0.9rem;
}
```

---

## 7. How Data Flows Across Frontend and Backend

### Request payload sent by frontend

```json
{
  "messages": [
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "What did Ayush lead at noon?" }
  ]
}
```

### Response payload from API (OpenAI mode)

```json
{
  "reply": "At noon...",
  "model": "gpt-5.3-codex"
}
```

### Response payload from API (fallback mode)

```json
{
  "reply": "At noon, I led growth...",
  "model": "local-profile-fallback",
  "fallback": true,
  "warning": "OpenAI quota exceeded..."
}
```

---

## 8. Beginner Notes: Common Edits You Will Make

### Update personal content

Edit arrays in `app/page.js`:

- `journey`
- `certifications`
- `portfolioProjects`

### Update Digital Twin knowledge

Edit `app/lib/digitalTwinContext.js`.

### Update design

Edit `app/globals.css` classes.

### Add more pages

Create additional files in `app/` (for example `app/blog/page.js`).

---

## 9. Safety and Production Considerations

- API keys are server-only (good)
- Fallback prevents hard failure (good)
- No database persistence yet (currently chat is session-only in browser)
- No authentication yet (public endpoint)

If this goes public at scale, you should add rate limiting and bot protection.

---

## 10. Self-Review: 6 Future Improvements

1. **Add rate limiting and abuse protection**
   - Protect `/api/digital-twin` with per-IP throttling and bot checks.

2. **Add conversation persistence**
   - Store chat threads (for example in Postgres/Supabase) so sessions survive refresh.

3. **Add streaming responses**
   - Use token streaming so replies appear progressively and feel faster.

4. **Upgrade fallback engine quality**
   - Replace keyword rules with retrieval from a structured profile JSON/markdown knowledge base.

5. **Add observability and analytics**
   - Track endpoint latency, fallback rate, and common user questions for iterative improvements.

6. **Modularize content and styling further**
   - Move large arrays and repeated section UIs into dedicated modules/components for easier maintenance.

---

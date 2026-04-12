# Ayush Verma Website (Next.js)

Professional personal website designed with an enterprise-meets-edgy visual style.
Includes an OpenAI-powered "Digital Twin" chat assistant for career Q&A.
Also includes in-domain LexDraft (Prelegal AI) flows backed by FastAPI.

## Environment

Set your API key in `.env`:

```bash
OPENAI_API_KEY=your_key_here
```

The Digital Twin backend uses model `gpt-5.3-codex`.

## Run locally

Use the helper script (Node.js is bundled in `.local` for this workspace):

```bash
./scripts/run-dev.sh
```

Then open `http://localhost:3000`.

## Build

```bash
PATH="$(pwd)/.local/node/bin:$PATH" npm run build
```

## Run With Docker (Next.js + FastAPI Together)

This project now supports the same dual-process container pattern as PRELEGAL:
- FastAPI backend on `127.0.0.1:8000` (inside container)
- Next.js app on `0.0.0.0:3000` (container port exposed)

Start:

```bash
./scripts/start.sh
```

Stop:

```bash
./scripts/stop.sh
```

By default, it publishes to `http://localhost:3000` and mounts
`./backend/data` so draft/session database state persists across container restarts.

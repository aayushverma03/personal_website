# Ayush Verma Website (Next.js)

Professional personal website designed with an enterprise-meets-edgy visual style.
Includes an OpenAI-powered "Digital Twin" chat assistant for career Q&A.

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

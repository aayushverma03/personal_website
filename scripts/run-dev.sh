#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATH="$ROOT/.local/node/bin:$PATH"
cd "$ROOT"
npm run dev

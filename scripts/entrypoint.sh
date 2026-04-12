#!/bin/bash
set -euo pipefail

cleanup() {
    [ -n "${BACKEND_PID:-}" ] && kill "$BACKEND_PID" 2>/dev/null || true
    [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup INT TERM

cd /app/backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

cd /app/site
node server.js &
FRONTEND_PID=$!

wait -n "$BACKEND_PID" "$FRONTEND_PID"
code=$?
cleanup
exit "$code"

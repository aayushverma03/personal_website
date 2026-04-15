#!/bin/bash
set -euo pipefail

cleanup() {
    [ -n "${PRELEGAL_PID:-}" ] && kill "$PRELEGAL_PID" 2>/dev/null || true
    [ -n "${EHS_PID:-}" ] && kill "$EHS_PID" 2>/dev/null || true
    [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null || true
}
trap cleanup INT TERM

cd /app/backend
/app/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 &
PRELEGAL_PID=$!

cd /app/backend-ehs
/app/backend-ehs/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8001 &
EHS_PID=$!

cd /app/site
node server.js &
FRONTEND_PID=$!

wait -n "$PRELEGAL_PID" "$EHS_PID" "$FRONTEND_PID"
code=$?
cleanup
exit "$code"

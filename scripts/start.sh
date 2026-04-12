#!/bin/sh
set -e

IMAGE=ayush-site:dev
CONTAINER=ayush-site
PORT=${PORT:-3000}
DOCKER_WAIT_SECONDS=${DOCKER_WAIT_SECONDS:-60}
DOCKER_BIN=""
DOCKER_APP_BIN="/Applications/Docker.app/Contents/Resources/bin/docker"

cd "$(dirname "$0")/.."

if command -v docker >/dev/null 2>&1; then
    DOCKER_BIN="docker"
elif [ -x "$DOCKER_APP_BIN" ]; then
    DOCKER_BIN="$DOCKER_APP_BIN"
else
    echo "Docker CLI not found. Install Docker Desktop and retry."
    exit 1
fi

docker_server_ready() {
    "$DOCKER_BIN" version --format '{{.Server.Version}}' >/dev/null 2>&1
}

if ! docker_server_ready; then
    if [ -d /Applications/Docker.app ]; then
        echo "Starting Docker Desktop..."
        open -a Docker >/dev/null 2>&1 || true
    fi
    echo "Waiting for Docker daemon to become ready..."
    READY=0
    COUNT=0
    while [ "$COUNT" -lt "$DOCKER_WAIT_SECONDS" ]; do
        if docker_server_ready; then
            READY=1
            break
        fi
        COUNT=$((COUNT + 1))
        sleep 1
    done
    if [ "$READY" -ne 1 ]; then
        echo "Docker daemon is not ready. Open Docker Desktop, wait until it starts, then rerun ./scripts/start.sh"
        exit 1
    fi
fi

"$DOCKER_BIN" build -t "$IMAGE" .
"$DOCKER_BIN" rm -f "$CONTAINER" 2>/dev/null || true

ENV_ARGS=""
if [ -f .env ]; then
    ENV_ARGS="--env-file .env"
fi

"$DOCKER_BIN" run -d --name "$CONTAINER" -p "${PORT}:3000" \
    $ENV_ARGS \
    -v "$(pwd)/backend/data:/app/backend/data" \
    "$IMAGE"

echo "SITE + LexDraft backend running at http://localhost:${PORT}"

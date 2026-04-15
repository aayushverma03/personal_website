#!/bin/sh
set -e

DOCKER_APP_BIN="/Applications/Docker.app/Contents/Resources/bin/docker"

cd "$(dirname "$0")/.."

if command -v docker >/dev/null 2>&1; then
    DOCKER_BIN="docker"
elif [ -x "$DOCKER_APP_BIN" ]; then
    DOCKER_BIN="$DOCKER_APP_BIN"
else
    echo "Docker CLI not found."
    exit 1
fi

"$DOCKER_BIN" compose down

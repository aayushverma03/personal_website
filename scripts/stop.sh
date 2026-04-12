#!/bin/sh
set -e

CONTAINER=ayush-site
DOCKER_APP_BIN="/Applications/Docker.app/Contents/Resources/bin/docker"

if command -v docker >/dev/null 2>&1; then
    DOCKER_BIN="docker"
elif [ -x "$DOCKER_APP_BIN" ]; then
    DOCKER_BIN="$DOCKER_APP_BIN"
else
    echo "Docker CLI not found."
    exit 1
fi

"$DOCKER_BIN" rm -f "$CONTAINER" 2>/dev/null \
    && echo "Stopped ${CONTAINER}" \
    || echo "${CONTAINER} not running"

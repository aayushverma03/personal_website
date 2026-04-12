#!/bin/bash
set -euo pipefail

# Deploy ayush-verma.com on EC2 (Ubuntu)
# Run ON the EC2 instance as the ubuntu user.
#
# First-time usage:
#   chmod +x deploy-ec2.sh && ./deploy-ec2.sh --first-run
#
# Subsequent deploys (pull + rebuild):
#   ./deploy-ec2.sh

APP_DIR="/home/ubuntu/personal_website"
CONTAINER="ayush-site"
IMAGE="ayush-site:prod"
PORT=3000
FIRST_RUN=false

if [ "${1:-}" = "--first-run" ]; then
    FIRST_RUN=true
fi

# ---------- first-run: install Docker + clone repo ----------
if [ "$FIRST_RUN" = true ]; then
    echo "==> First-run setup: installing Docker..."

    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg git

    # Docker official GPG key + repo
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin
    sudo usermod -aG docker "$USER"

    echo "==> Cloning repo..."
    if [ ! -d "$APP_DIR" ]; then
        git clone https://github.com/aayushverma03/personal_website.git "$APP_DIR"
    fi

    echo "==> Stopping old systemd service if running..."
    sudo systemctl stop personal-website 2>/dev/null || true
    sudo systemctl disable personal-website 2>/dev/null || true

    echo ""
    echo "Docker installed. If this is your first time, log out and back in"
    echo "so the docker group takes effect, then re-run without --first-run."
    echo ""
    echo "Also create .env before deploying:"
    echo "  echo 'OPENAI_API_KEY=sk-...' > $APP_DIR/.env"
    echo "  chmod 600 $APP_DIR/.env"
    exit 0
fi

# ---------- deploy: pull, build, run ----------
cd "$APP_DIR"

echo "==> Pulling latest from main..."
git pull origin main

echo "==> Building Docker image..."
docker build -t "$IMAGE" .

echo "==> Stopping old container..."
docker rm -f "$CONTAINER" 2>/dev/null || true

ENV_ARGS=""
if [ -f .env ]; then
    ENV_ARGS="--env-file .env"
fi

echo "==> Starting container..."
docker run -d \
    --name "$CONTAINER" \
    --restart unless-stopped \
    -p "127.0.0.1:${PORT}:3000" \
    $ENV_ARGS \
    -v "$APP_DIR/backend/data:/app/backend/data" \
    "$IMAGE"

echo "==> Waiting for health check..."
sleep 3
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$PORT || echo "000")
BACKEND=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$PORT/api/prelegal/health || echo "000")

echo "    Frontend: $FRONTEND"
echo "    Backend:  $BACKEND"

if [ "$FRONTEND" = "200" ] && [ "$BACKEND" = "200" ]; then
    echo "==> Deploy successful. Site live at https://ayush-verma.com"
else
    echo "==> Warning: health check did not return 200. Check logs:"
    echo "    docker logs $CONTAINER --tail 50"
fi

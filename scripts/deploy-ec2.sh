#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# EC2 Deploy Script for ayush-verma.com
# Deploys SITE + LexDraft + Verity EHS via docker compose
#
# Usage:
#   1. SSH into EC2:  ssh -i websiter_server.pem ubuntu@13.60.68.170
#   2. First time:    git clone https://github.com/aayushverma03/personal_website.git
#   3. Run:           cd personal_website && bash scripts/deploy-ec2.sh
# ─────────────────────────────────────────────────────────────

APP_DIR="/home/ubuntu/personal_website"
DOMAIN="ayush-verma.com"

echo "=== Step 1: Install Docker if needed ==="
if ! command -v docker &>/dev/null; then
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose-plugin
    sudo usermod -aG docker ubuntu
    echo "Docker installed. Log out and back in, then re-run this script."
    exit 0
fi

if ! docker compose version &>/dev/null; then
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
fi

echo "Docker $(docker --version | cut -d' ' -f3)"
echo "Compose $(docker compose version --short)"

echo ""
echo "=== Step 2: Pull latest code ==="
cd "$APP_DIR"
git pull origin main

echo ""
echo "=== Step 3: Create .env if missing ==="
if [ ! -f .env ]; then
    cat > .env <<'ENVEOF'
# Shared across all three AI products
OPENAI_API_KEY=FILL_ME_IN

# Verity EHS
EHS_DB_PASSWORD=FILL_ME_IN
EHS_JWT_SECRET=FILL_ME_IN
ENVEOF
    chmod 600 .env
    echo ""
    echo "*** .env created at $APP_DIR/.env ***"
    echo "*** Edit it with real values:  nano $APP_DIR/.env ***"
    echo "*** Then re-run this script. ***"
    exit 0
fi

if grep -q "FILL_ME_IN" .env; then
    echo "ERROR: .env still has FILL_ME_IN placeholders."
    echo "Edit $APP_DIR/.env with real values first."
    exit 1
fi

echo ""
echo "=== Step 4: Stop old containers ==="
docker rm -f ayush-site 2>/dev/null || true
docker rm -f prelegal 2>/dev/null || true
sudo systemctl stop personal-website 2>/dev/null || true
sudo systemctl disable personal-website 2>/dev/null || true
docker compose down 2>/dev/null || true

echo ""
echo "=== Step 5: Build and start ==="
docker compose up -d --build
sleep 10
docker compose ps

echo ""
echo "=== Step 6: Verify ==="
echo -n "Next.js:  "; curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/
echo -n "Prelegal: "; docker exec ayush-site curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/auth/me 2>/dev/null || echo "FAIL"
echo -n "EHS:      "; docker exec ayush-site curl -sS http://127.0.0.1:8001/api/health 2>/dev/null || echo "FAIL"

echo ""
echo "=== Step 7: EHS ingestion (first deploy only) ==="
CHUNK_COUNT=$(docker exec ayush-site-db psql -U ehs_user -d ehs_platform -t -c "SELECT count(*) FROM document_chunks;" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$CHUNK_COUNT" -gt "0" ]; then
    echo "Already ingested ($CHUNK_COUNT chunks). Skipping."
else
    echo "Running ingestion (~5 min, calls OpenAI embeddings API)..."
    docker exec ayush-site bash -c "cd /app/backend-ehs/ingestion && /app/backend-ehs/.venv/bin/python embed_and_load.py"
    echo "Done."
fi

echo ""
echo "=== Step 8: Nginx ==="
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
if [ -f "$NGINX_CONF" ]; then
    echo "Config exists. Reloading."
    sudo nginx -t && sudo systemctl reload nginx
else
    sudo tee "$NGINX_CONF" > /dev/null <<'NGINXEOF'
server {
    listen 80;
    server_name ayush-verma.com www.ayush-verma.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 20M;
    }
}
NGINXEOF
    sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

echo ""
echo "=== Step 9: HTTPS ==="
if sudo certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
    echo "Cert exists."
else
    if command -v certbot &>/dev/null; then
        sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m admin@$DOMAIN
    else
        echo "Install certbot: sudo apt install -y certbot python3-certbot-nginx"
        echo "Then run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
fi

echo ""
echo "=== Deploy complete ==="
echo ""
echo "  https://$DOMAIN"
echo "  https://$DOMAIN/ai-projects/verity-ehs"
echo "  https://$DOMAIN/verityEHS"
echo ""
echo "Commands:"
echo "  docker compose ps       # status"
echo "  docker compose logs -f  # logs"
echo "  docker compose down     # stop"
echo "  docker compose up -d    # restart"

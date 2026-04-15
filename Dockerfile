## Stage 1: build Next.js frontend in standalone mode
FROM node:22-slim AS frontend-build
WORKDIR /app/site
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

## Stage 2: resolve Python backend deps with uv
FROM python:3.12-slim AS backend-build
COPY --from=ghcr.io/astral-sh/uv:0.11.6 /uv /usr/local/bin/uv
WORKDIR /app/backend
ENV UV_LINK_MODE=copy UV_COMPILE_BYTECODE=1
COPY backend/pyproject.toml backend/uv.lock* ./
RUN uv sync --no-dev --no-install-project
COPY backend/ ./

## Stage 2b: resolve Verity EHS backend deps with uv
FROM python:3.12-slim AS ehs-backend-build
COPY --from=ghcr.io/astral-sh/uv:0.11.6 /uv /usr/local/bin/uv
WORKDIR /app/backend-ehs
ENV UV_LINK_MODE=copy UV_COMPILE_BYTECODE=1
COPY backend-ehs/pyproject.toml backend-ehs/uv.lock* ./
RUN uv sync --no-dev --no-install-project
COPY backend-ehs/ ./

## Stage 3: runtime
FROM python:3.12-slim AS runtime
ENV NODE_MAJOR=22 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NEXT_TELEMETRY_DISABLED=1 \
    PRELEGAL_BACKEND_URL=http://127.0.0.1:8000 \
    EHS_BACKEND_URL=http://127.0.0.1:8001 \
    DATABASE_URL=sqlite:////app/backend/data/dev.db \
    PATH=/usr/local/bin:/usr/bin:/bin

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
        | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
        > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge -y gnupg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-build /app/backend /app/backend
COPY --from=ehs-backend-build /app/backend-ehs /app/backend-ehs
RUN mkdir -p /app/backend/data

COPY --from=frontend-build /app/site/.next/standalone /app/site
COPY --from=frontend-build /app/site/.next/static /app/site/.next/static
COPY --from=frontend-build /app/site/public /app/site/public

COPY scripts/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
ENTRYPOINT ["/app/entrypoint.sh"]

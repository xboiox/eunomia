# syntax=docker/dockerfile:1
# Production image for Eunomia (Next.js 16 + Prisma 7 + PostgreSQL).
# Built by Coolify with the "Dockerfile" build pack; also works with plain `docker build`.

ARG NODE_VERSION=24-bookworm-slim

# ─── 1. Install all dependencies (dev included, needed to build) ─────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
# openssl: used by Prisma; python3/make/g++: fallback for native modules (bcrypt)
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl python3 make g++ \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ─── 2. Build the app ─────────────────────────────────────────────────────────
# Reuses the deps stage (node_modules + openssl already present)
FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
# prisma.config.ts reads DATABASE_URL even for `generate`; no DB is contacted at build time.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
COPY . .
RUN npm run build \
 && npm prune --omit=dev --legacy-peer-deps

# ─── 3. Runtime image ─────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl ca-certificates curl \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOAD_DIR=/app/uploads \
    RUN_MIGRATIONS=true \
    RUN_SEED=true \
    PRISMA_HIDE_UPDATE_MESSAGE=true

COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/next.config.js /app/prisma.config.ts ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --chown=node:node docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Evidence storage — mount a persistent volume here. Created with node ownership
# so a fresh named volume inherits writable permissions.
RUN mkdir -p /app/uploads && chown node:node /app/uploads && chmod +x /usr/local/bin/entrypoint.sh

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-3000}/api/health" > /dev/null || exit 1

ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "node_modules/next/dist/bin/next", "start"]

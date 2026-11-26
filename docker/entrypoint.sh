#!/bin/sh
# Container entrypoint: validate env, apply DB migrations, seed framework data, start the app.
set -eu

require_env() {
  for name in "$@"; do
    eval "value=\${$name:-}"
    if [ -z "$value" ]; then
      echo "[entrypoint] ERROR: required environment variable $name is not set." >&2
      exit 1
    fi
  done
}

require_env DATABASE_URL NEXTAUTH_SECRET NEXTAUTH_URL SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY

if [ "${#NEXTAUTH_SECRET}" -lt 32 ]; then
  echo "[entrypoint] ERROR: NEXTAUTH_SECRET must be at least 32 characters." >&2
  exit 1
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Applying database migrations..."
  npx --no-install prisma migrate deploy
fi

if [ "${RUN_SEED:-true}" = "true" ]; then
  # Seed is idempotent (upserts framework/domain/control rows).
  echo "[entrypoint] Seeding framework data..."
  npx --no-install prisma db seed
fi

echo "[entrypoint] Starting Eunomia on port ${PORT:-3000}..."
exec "$@"

#!/usr/bin/env bash
set -euo pipefail

# Prefer the Node apply path. Vercel preview has POSTGRES_URL; this cloud
# pod redacts it. Do not ask a human to paste SQL.
if [[ -f package.json ]]; then
  exec node scripts/apply-schema.mjs
fi

url="${POSTGRES_URL_NON_POOLING:-${POSTGRES_URL:-${DATABASE_URL:-}}}"
if [[ -z "$url" || "$url" == "[SENSITIVE]" ]]; then
  echo "No postgres url in this environment. The Vercel build applies the schema." >&2
  exit 1
fi

psql "$url" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_hospice.sql
echo "Applied supabase/migrations/0001_hospice.sql"

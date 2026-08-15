#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Set DATABASE_URL to the Supabase Postgres URI, then rerun." >&2
  exit 1
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/0001_hospice.sql
echo "Applied supabase/migrations/0001_hospice.sql"

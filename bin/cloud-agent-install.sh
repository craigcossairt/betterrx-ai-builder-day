#!/usr/bin/env bash
# Idempotent Cloud Agent install: tools the default image lacks, plus the
# vendored pstack plugin so /poteto-mode works without the marketplace.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v shellcheck >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo apt-get install -y -qq shellcheck
fi

if [ -f "$ROOT/bin/install-pstack-local.sh" ]; then
  bash "$ROOT/bin/install-pstack-local.sh"
fi

if [ -f "$ROOT/.cursor/rules/pstack-models.mdc" ]; then
  mkdir -p "${HOME}/.cursor/rules"
  cp "$ROOT/.cursor/rules/pstack-models.mdc" "${HOME}/.cursor/rules/pstack-models.mdc"
fi

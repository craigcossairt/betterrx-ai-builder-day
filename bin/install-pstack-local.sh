#!/usr/bin/env bash
# Copy vendored pstack into Cursor's local plugin dir so /poteto-mode and
# subagent_type: "poteto-agent" resolve the same way as /add-plugin pstack.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/vendor/pstack"
DEST="${HOME}/.cursor/plugins/local/pstack"

if [ ! -f "$SRC/.cursor-plugin/plugin.json" ]; then
  echo "install-pstack-local: missing $SRC/.cursor-plugin/plugin.json" >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
rm -rf "$DEST"
cp -a "$SRC" "$DEST"
echo "install-pstack-local: pstack -> $DEST"

#!/usr/bin/env bash
# Build a dated zip for moving the site to another host.
# Usage:
#   ./package-for-transfer.sh              # full site including .mp4 in repo root
#   SKIP_MP4=1 ./package-for-transfer.sh  # omit *.mp4 (copy videos yourself)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT="${HOME}/Desktop/CraveLinkInBio-transfer-${STAMP}.zip"

cd "$ROOT"

EXCLUDES=(
  ".git/*"
  ".DS_Store"
  "*/.DS_Store"
  "*.zip"
)

if [[ "${SKIP_MP4:-}" == "1" ]]; then
  EXCLUDES+=("*.mp4")
  echo "SKIP_MP4=1: archive will omit *.mp4 (copy videos to match posts-config.js)."
fi

args=(-r "$OUT" .)
for pat in "${EXCLUDES[@]}"; do
  args+=(-x "$pat")
done

zip "${args[@]}"

echo "Created: $OUT"
ls -lh "$OUT"

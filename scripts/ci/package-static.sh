#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

OUT_DIR=${1:-dist/static}
[[ -d out ]] || die "missing ./out; run npm run build first"

mkdir -p "$OUT_DIR"
archive="$OUT_DIR/frontend-static.tar.gz"

# gzip -n removes timestamp/original-name metadata from the gzip wrapper.
# The tar order is sorted to make repeated packaging more reproducible.
log "Packaging Next.js static export"
tar \
  --sort=name \
  --mtime='UTC 1970-01-01' \
  --owner=0 \
  --group=0 \
  --numeric-owner \
  -cf - out \
  | gzip -n -9 >"$archive"

sha256sum "$archive" >"$archive.sha256"
log "Created $archive"

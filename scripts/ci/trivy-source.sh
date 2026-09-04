#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

OUT_DIR=${1:-dist/security/source}
mkdir -p "$OUT_DIR"
require_cmd trivy

log "Creating frontend vulnerability/misconfiguration report"
trivy fs \
  --scanners vuln,misconfig \
  --format json \
  --output "$OUT_DIR/trivy-fs.json" \
  .

log "Creating frontend source SBOM"
trivy fs \
  --scanners vuln \
  --format cyclonedx \
  --output "$OUT_DIR/sbom.cdx.json" \
  .

status=0

log "Failing on CRITICAL frontend vulnerabilities/misconfigurations"
if ! trivy fs \
  --scanners vuln,misconfig \
  --severity CRITICAL \
  --exit-code 1 \
  .; then
  status=1
fi

# Avoid persisting a secret report because findings can contain sensitive snippets.
log "Failing on any detected secret"
if ! trivy fs \
  --scanners secret \
  --exit-code 1 \
  --format table \
  .; then
  status=1
fi

exit "$status"

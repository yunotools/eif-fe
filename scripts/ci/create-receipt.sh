#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

require_cmd jq
require_cmd sha256sum

SOURCE_DIR=${SOURCE_SECURITY_DIR:-dist/inputs/source-security}
STATIC_DIR=${STATIC_ARTIFACT_DIR:-dist/inputs/static}
OUT_DIR=${CI_RECEIPT_DIR:-dist/ci}

[[ -f "$SOURCE_DIR/trivy-fs.json" ]] || die "missing $SOURCE_DIR/trivy-fs.json"
[[ -f "$SOURCE_DIR/sbom.cdx.json" ]] || die "missing $SOURCE_DIR/sbom.cdx.json"
[[ -f "$STATIC_DIR/frontend-static.tar.gz" ]] || die "missing $STATIC_DIR/frontend-static.tar.gz"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/reports"
cp "$SOURCE_DIR/trivy-fs.json" "$OUT_DIR/reports/"
cp "$SOURCE_DIR/sbom.cdx.json" "$OUT_DIR/reports/"
sha256sum "$STATIC_DIR/frontend-static.tar.gz" >"$OUT_DIR/reports/frontend-static.sha256"

critical_source=$(jq '[.Results[]? | ((.Vulnerabilities // []) + (.Misconfigurations // []))[]? | select(.Severity == "CRITICAL")] | length' "$SOURCE_DIR/trivy-fs.json")
repo=${GITHUB_REPOSITORY:-local/frontend}
sha=${GITHUB_SHA:-$(git rev-parse HEAD 2>/dev/null || printf unknown)}
ref=${GITHUB_REF:-local}
run_id=${GITHUB_RUN_ID:-0}
run_attempt=${GITHUB_RUN_ATTEMPT:-0}
workflow=${GITHUB_WORKFLOW:-local}
created_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
node_version=$(tr -d '[:space:]' <.nvmrc)
npm_version=$(jq -r '.packageManager // "npm@unknown" | sub("^npm@"; "")' package.json)
static_sha=$(sha256_file "$STATIC_DIR/frontend-static.tar.gz")

jq -n \
  --arg repository "$repo" \
  --arg sha "$sha" \
  --arg ref "$ref" \
  --arg node_version "$node_version" \
  --arg npm_version "$npm_version" \
  --arg package_json_sha256 "$(sha256_file package.json)" \
  --arg package_lock_sha256 "$(sha256_file package-lock.json)" \
  --arg static_sha256 "$static_sha" \
  --arg workflow "$workflow" \
  --arg run_id "$run_id" \
  --arg run_attempt "$run_attempt" \
  --arg created_at "$created_at" \
  --argjson critical_source "$critical_source" \
  '{
    schema_version: 1,
    component: "frontend",
    repository: $repository,
    commit: {sha: $sha, ref: $ref},
    toolchain: {node: $node_version, npm: $npm_version},
    inputs: {
      package_json_sha256: $package_json_sha256,
      package_lock_sha256: $package_lock_sha256
    },
    checks: {
      lock: "passed",
      format: "passed",
      architecture: "passed",
      lint: "passed",
      typecheck: "passed",
      test: "not_configured",
      build: "passed",
      trivy_source: "passed",
      secret_scan_source: "passed"
    },
    tests: {
      configured: false,
      files: 0,
      status: "not_configured"
    },
    security: {
      critical_source: $critical_source
    },
    artifacts: {
      source_sbom: "reports/sbom.cdx.json",
      trivy_source: "reports/trivy-fs.json",
      static_export_sha256: $static_sha256
    },
    github: {
      workflow: $workflow,
      run_id: $run_id,
      run_attempt: $run_attempt
    },
    created_at: $created_at
  }' >"$OUT_DIR/ci-manifest.json"

(
  cd "$OUT_DIR"
  find . -type f ! -name SHA256SUMS -print0 \
    | sort -z \
    | xargs -0 sha256sum >SHA256SUMS
)

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo "## EIF Frontend CI"
    echo
    echo "| Field | Value |"
    echo "|---|---|"
    echo "| Commit | \`$sha\` |"
    echo "| Node | \`$node_version\` |"
    echo "| npm | \`$npm_version\` |"
    echo "| Tests | \`NOT_CONFIGURED\` |"
    echo "| Source CRITICAL | \`$critical_source\` |"
    echo "| Static SHA-256 | \`$static_sha\` |"
    echo "| Receipt | \`eif-frontend-ci-$sha-$run_attempt\` |"
  } >>"$GITHUB_STEP_SUMMARY"
fi

#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

require_cmd jq
[[ -f package.json ]] || die "package.json not found"
[[ -f package-lock.json ]] || die "package-lock.json not found"

lock_version=$(jq -r '.lockfileVersion // 0' package-lock.json)
[[ "$lock_version" -ge 3 ]] || die "package-lock.json must use lockfileVersion >= 3"

compare_field() {
  local field=$1
  local package_value
  local lock_value

  package_value=$(jq -cS ".${field} // {}" package.json)
  lock_value=$(jq -cS ".packages[\"\"].${field} // {}" package-lock.json)

  if [[ "$package_value" != "$lock_value" ]]; then
    printf 'package.json %s:\n%s\n\n' "$field" "$package_value" >&2
    printf 'package-lock.json root %s:\n%s\n' "$field" "$lock_value" >&2
    die "package.json and package-lock.json are out of sync for $field"
  fi
}

package_name=$(jq -r '.name // ""' package.json)
lock_name=$(jq -r '.packages[""].name // ""' package-lock.json)
[[ "$package_name" == "$lock_name" ]] || die "package name differs between package.json and package-lock.json"

package_version=$(jq -r '.version // ""' package.json)
lock_package_version=$(jq -r '.packages[""].version // ""' package-lock.json)
[[ "$package_version" == "$lock_package_version" ]] || die "package version differs between package.json and package-lock.json"

compare_field dependencies
compare_field devDependencies
compare_field optionalDependencies

log "package.json and package-lock.json root metadata are synchronized"

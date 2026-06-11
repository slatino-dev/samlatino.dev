#!/usr/bin/env bash
# scrub_check.sh — fail the build if infrastructure or secret references
# leak into the working tree. Prints every file:line that matches.
set -uo pipefail

cd "$(dirname "$0")/.."

PATTERNS=(
  'redacted-host'
  '100\.64\.[0-9]{1,3}\.[0-9]{1,3}'
  'redacted-domain'
  'private mesh'
  'redacted-key'
  'sk-[A-Za-z0-9]{20,}'
)

fail=0
for pat in "${PATTERNS[@]}"; do
  matches=$(grep -rInE --binary-files=without-match \
    --exclude-dir=node_modules \
    --exclude-dir=dist \
    --exclude-dir=.git \
    --exclude-dir=.astro \
    --exclude='scrub_check.sh' \
    -e "$pat" . || true)
  if [ -n "$matches" ]; then
    echo "scrub_check: pattern '$pat' matched:" >&2
    echo "$matches" >&2
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "scrub_check: FAILED" >&2
  exit 1
fi

echo "scrub_check: clean"

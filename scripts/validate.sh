#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

required=(
  "index.html"
  "main/index.html"
  "api/consultation.js"
  "AGENTS.md"
  "CLAUDE.md"
)

for file in "${required[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file" >&2
    exit 1
  fi
done

while IFS= read -r -d '' file; do
  node --check "$file" >/dev/null
done < <(find api scripts -type f -name '*.js' -print0)

git diff --check
echo "Validation passed."

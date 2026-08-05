#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

required=(
  "index.html"
  "main/index.html"
  "api/consultation.js"
  "api/payment-page.js"
  "api/payment-privacy.js"
  "api/payment-auth.js"
  "api/payment-order.js"
  "api/payment-success.js"
  "api/payment-fail.js"
  "payment-assets/payment.css"
  "payment-assets/auth.js"
  "payment-assets/checkout.js"
  "vercel.json"
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
done < <(find api lib payment-assets scripts tests -type f -name '*.js' -print0)

if rg -l --hidden --glob '!.git/**' --glob '!.env' --glob '!.env.local' --glob '!scripts/validate.sh' \
  '(^|[^0-9])2266([^0-9]|$)|S/W 외주용역|(^|[^0-9])2000000([^0-9]|$)|(?:live|test)_gsk_[A-Za-z0-9_-]{12,}' .; then
  echo "A private payment value or Toss widget secret appears in tracked files." >&2
  exit 1
fi

node --test tests/*.test.js

git diff --check
echo "Validation passed."

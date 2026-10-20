#!/usr/bin/env bash
# Renders every Chez Les Petits still (all ads x all formats) to out/chez-les-petits/.
# Uses the preinstalled Chromium when present so no browser download is needed.
set -euo pipefail
cd "$(dirname "$0")/.."
browser=()
shell=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
[ -x "$shell" ] && browser=(--browser-executable="$shell")
mkdir -p out/chez-les-petits
ids=$(npx remotion compositions src/index.ts "${browser[@]}" --quiet | tr ' ' '\n' | grep '^CLP-' || true)
for id in $ids; do
	npx remotion still src/index.ts "$id" "out/chez-les-petits/${id#CLP-}.png" "${browser[@]}" --log=error
done

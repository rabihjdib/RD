#!/usr/bin/env bash
# Renders every Chez Les Petits still (all ads x all formats) to out/chez-les-petits/.
# Optional argument filters composition ids, e.g. scripts/render_clp.sh L07
set -euo pipefail
cd "$(dirname "$0")/.."
node scripts/render_clp.mjs "${1:-}"

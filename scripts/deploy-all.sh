#!/usr/bin/env bash
set -euo pipefail

# Deploy a production build to BOTH Vercel projects in one command.
#
#   • GCF (gcflfg)            FINAL CLIENT endpoint  → https://gcf-refresh-2026.vercel.app
#   • rhumbline-ais-projects  internal / staging     → https://gcf-refresh-2026-rouge.vercel.app
#
# Each project builds on Vercel using its OWN stored environment variables.
# We pass VERCEL_ORG_ID / VERCEL_PROJECT_ID per deploy so this never touches —
# or depends on — the local `.vercel/project.json` link.
#
# Note: the GCF project is also connected to GitHub, so `git push` already
# auto-deploys to GCF on its own. This script is the explicit "ship to both"
# path (e.g. after committing) and is safe to run regardless.

GCF_ORG_ID="team_Iqi3Kl44dUHoiDdGxcqM6j24"
GCF_PROJECT_ID="prj_mcUnjXlul9pE41FXZwlfEQKp3TWq"

RHUMBLINE_ORG_ID="team_nJjNQs0X60CvM7qmWkucGqlr"
RHUMBLINE_PROJECT_ID="prj_3LN0AaE4zifmFiHqeGMBREyZ7hGI"

echo "▶ [1/2] Deploying to GCF (client endpoint)…"
VERCEL_ORG_ID="$GCF_ORG_ID" VERCEL_PROJECT_ID="$GCF_PROJECT_ID" \
  vercel deploy --prod --yes

echo ""
echo "▶ [2/2] Deploying to rhumbline (internal)…"
VERCEL_ORG_ID="$RHUMBLINE_ORG_ID" VERCEL_PROJECT_ID="$RHUMBLINE_PROJECT_ID" \
  vercel deploy --prod --yes

echo ""
echo "✔ Both production deploys complete."
echo "  GCF:        https://gcf-refresh-2026.vercel.app"
echo "  rhumbline:  https://gcf-refresh-2026-rouge.vercel.app"

#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

command -v gh >/dev/null || { echo 'Install GitHub CLI first: https://cli.github.com'; exit 1; }
account="$(gh api user --jq .login)"
if [ "$account" != 'ClimbHillTmr' ]; then
  echo 'Please sign in to GitHub CLI as ClimbHillTmr before publishing.'
  exit 1
fi

# Primary GitHub Pages root repository (https://climbhilltmr.github.io/)
REPO_NAME="${REPO_NAME:-climbhilltmr.github.io}"
FULL_REPO="ClimbHillTmr/${REPO_NAME}"
SITE_URL="https://climbhilltmr.github.io/"
if [ "$REPO_NAME" != "climbhilltmr.github.io" ]; then
  SITE_URL="https://climbhilltmr.github.io/${REPO_NAME}/"
fi

node --check docs/app.js
node --check docs/citations.js

if [ ! -d .git ]; then git init -b main; fi
git add -- docs README.md .gitignore deploy.sh
if ! git diff --cached --quiet; then
  git commit -m 'Refine academic homepage design and optimize GitHub Pages root entry URL'
fi

if ! gh repo view "$FULL_REPO" >/dev/null 2>&1; then
  gh repo create "$FULL_REPO" --public --description 'Qi Guo — Research interests, publications, and open-source projects.'
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "https://github.com/${FULL_REPO}.git"
else
  git remote add origin "https://github.com/${FULL_REPO}.git"
fi
git push -u origin HEAD:main

pages_config='{"build_type":"legacy","source":{"branch":"main","path":"/docs"}}'
if gh api "repos/${FULL_REPO}/pages" >/dev/null 2>&1; then
  printf '%s' "$pages_config" | gh api --method PUT "repos/${FULL_REPO}/pages" --input -
else
  printf '%s' "$pages_config" | gh api --method POST "repos/${FULL_REPO}/pages" --input -
fi

gh repo edit "$FULL_REPO" --homepage "$SITE_URL"
echo "Source uploaded. GitHub Pages deployment requested for ${FULL_REPO}."
echo "Check build status: https://github.com/${FULL_REPO}/actions"
echo "Primary entry URL: ${SITE_URL}"

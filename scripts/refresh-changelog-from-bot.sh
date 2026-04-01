#!/usr/bin/env bash
# Production: keep the public engine changelog in sync with /srv/krakenbot.
# Intended for systemd timer (git-only: pull both repos, regenerate JSON, rebuild, restart).
set -euo pipefail

KRAKENBOT="${KRAKENBOT_ROOT:-/srv/krakenbot}"
SITE="${KAPITAALBOT_WEBSITE_ROOT:-/srv/KapitaalBot-Website}"

if [[ ! -d "${KRAKENBOT}/.git" ]]; then
  echo "ERROR: ${KRAKENBOT} is not a git checkout" >&2
  exit 1
fi
if [[ ! -d "${SITE}/.git" ]]; then
  echo "ERROR: ${SITE} is not a git checkout" >&2
  exit 1
fi

echo "=== git pull ${KRAKENBOT} ==="
git -C "${KRAKENBOT}" fetch origin
git -C "${KRAKENBOT}" pull --ff-only
BOT_HEAD="$(git -C "${KRAKENBOT}" rev-parse HEAD)"

echo "=== git pull ${SITE} ==="
git -C "${SITE}" fetch origin
git -C "${SITE}" pull --ff-only
SITE_HEAD="$(git -C "${SITE}" rev-parse HEAD)"

echo "=== next build (runs bot-changelog first) ==="
cd "${SITE}"
export BOT_GIT_REPO="${KRAKENBOT}"
npm run build

echo "=== restart kapitaalbot-web ==="
systemctl restart kapitaalbot-web.service

echo "refresh_ok bot_commit=${BOT_HEAD} website_commit=${SITE_HEAD}"

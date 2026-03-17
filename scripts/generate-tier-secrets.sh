#!/usr/bin/env bash
# Genereer TIER_COOKIE_SECRET, TIER2_SECRET en TIER3_SECRET voor de website-server.
# Uitvoeren op de server (of lokaal) en de output toevoegen aan .env van kapitaalbot-web.
# Gebruik: ./scripts/generate-tier-secrets.sh   of   bash scripts/generate-tier-secrets.sh

set -e
echo "# Voeg onderstaande regels toe aan de environment van kapitaalbot-web (bijv. .env of systemd Environment=):"
echo "# Daarna: systemctl restart kapitaalbot-web.service"
echo ""
printf "TIER_COOKIE_SECRET=%s\n" "$(openssl rand -hex 24)"
printf "TIER2_SECRET=%s\n" "$(openssl rand -hex 16)"
printf "TIER3_SECRET=%s\n" "$(openssl rand -hex 16)"
echo ""
echo "# Voor Tier 3 (admin) inloggen: ga naar https://snapdiscounts.nl/login en voer de TIER3_SECRET waarde hierboven in."

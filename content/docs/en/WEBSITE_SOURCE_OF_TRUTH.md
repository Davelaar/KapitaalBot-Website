# Website (kapitaalbot.nl) — bron en deploy

## Git SSOT (enige codebase)

- **Alleen** de repository **`Davelaar/KapitaalBot-Website`** (GitHub). Geen Next.js-site meer in **deze** Krakenbot-monorepo.
- Ontwikkeling, issues, releases: daar.

## Productie op de server

| Onderdeel | Standaardpad |
|-----------|----------------|
| **Git-clone (SSOT)** | `/srv/KapitaalBot-Website` — `git pull` hier |
| **Runtime-build** (geen `.git` nodig) | `/srv/kapitaalbot/website` — rsync vanaf clone, daarna `npm ci` + `npm run build` |
| **Observability JSON** | `/srv/krakenbot/observability_export` — vult `krakenbot export-observability-snapshots` (systemd-timer) |
| **PM2** | `kapitaalbot-website` — start via **Krakenbot**-ecosystem (zie hieronder) |

## Deploy (aanbevolen, vanaf server)

Na `git pull` in de site-clone:

```bash
cd /srv/krakenbot
git pull --ff-only origin main   # Krakenbot-repo met deployscript + ecosystem.config.cjs
./scripts/deploy_kapitaalbot_website_server.sh
```

Script: `scripts/deploy_kapitaalbot_website_server.sh`  
— rsync `SITE_CLONE` → `RUNTIME`, build, PM2 met vaste env.

### PM2-omgeving (altijd correct voor data)

Bestand in Krakenbot-repo: **`scripts/kapitaalbot_website/ecosystem.config.cjs`** (naam is verplicht — PM2 herkent alleen `ecosystem.config.*`, geen willekeurige `*.cjs`.)

- `PORT=3001` (Caddy `kapitaalbot.nl` → 3001)
- `OBSERVABILITY_EXPORT_DIR=/srv/krakenbot/observability_export` (Tier‑1 snapshot-API’s)

Handstart zonder script:

```bash
pm2 start /srv/krakenbot/scripts/kapitaalbot_website/ecosystem.config.cjs
pm2 save
```

Override paden:

```bash
export SITE_CLONE=/pad/naar/site-clone
export RUNTIME=/pad/naar/runtime
export OBSERVABILITY_EXPORT_DIR=/srv/krakenbot/observability_export
./scripts/deploy_kapitaalbot_website_server.sh
```

`.env.local` onder `/srv/kapitaalbot/website` blijft mogelijk voor secrets (niet in Git); optioneel naast bovenstaande env.

## Krakenbot ↔ website

- **Rust-export** schrijft JSON naar `OBSERVABILITY_EXPORT_DIR` op de bot-host (zie `systemd/krakenbot-observability-export.service`).
- De **Next-site** leest alleen die bestanden (BFF); geen gedeelde website-map in deze repo.

## Verouderd

- Een gekopieerde **`KapitaalBot-Website/`** map in deze monorepo is **verwijderd** om drift en verkeerde deploy-bron te voorkomen.

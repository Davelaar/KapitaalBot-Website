# KapitaalBot-Website

Observability portal voor het autonome crypto trading systeem KapitaalBot. Engineering showcase, commercieel funnel, informatief platform (geen beleggingsproduct).

- **Staging:** snapdiscounts.nl  
- **Productie (na migratie):** kapitaalbot.nl  
- **Data:** Leest uitsluitend snapshot-JSON uit de export van KRAKENBOTMAART. Geen directe DB-queries.

## Setup

1. Clone en installeer:
   ```bash
   git clone git@github.com:Davelaar/KapitaalBot-Website.git
   cd KapitaalBot-Website
   npm install
   ```

2. Optioneel: wijs de exportdirectory van de bot aan (waar de bot `export-observability-snapshots` naartoe schrijft):
   ```bash
   export OBSERVABILITY_EXPORT_DIR=/pad/naar/observability_export
   ```
   Of plaats een kopie van de snapshot-JSON-bestanden in `./observability_export/`.

3. Start development:
   ```bash
   npm run dev
   ```

4. Build voor productie:
   ```bash
   npm run build
   npm start
   ```

## Contract

Snapshot-formaat en velden: zie in de bot-repo [docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md](https://github.com/Davelaar/KRAKENBOTMAART/blob/main/docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md). Dit project verwacht `contract_version` in elke snapshot.

## Tier-model

- **Tier 1 (publiek):** `/`, `/dashboard` — status, regime/strategy-overview, metric cards.
- **Tier 2 / Admin:** later; session auth en extra endpoints.

## Compliance

Op elke pagina staat onderaan de verplichte crypto-waarschuwing (wit, donkere tekst, niet meegenomen in dark theme).

## Analytics

Prioriteit in `components/Analytics.tsx`:

1. **Plausible** — zet `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
2. **Umami** — zet `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
3. **Google Analytics 4** — standaard actief als 1 en 2 niet gezet zijn: `public/analytics/kapitaalbot-analytics.js` + consent-popup (NL/EN/DE/FR), gekoppeld aan `NEXT_LOCALE` / `<html lang>`.

| Variabele | Betekenis |
|-----------|-----------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optioneel; default `G-TLP1NT0CYH` |
| `NEXT_PUBLIC_GA_DISABLE=1` | Geen GA4 (bijv. lokaal) |

Bron in bot-repo (kopie): [web/analytics-consent/](https://github.com/Davelaar/KRAKENBOTMAART/tree/main/web/analytics-consent).

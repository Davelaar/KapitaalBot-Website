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

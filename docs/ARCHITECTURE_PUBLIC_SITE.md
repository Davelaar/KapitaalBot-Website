# Architectuur — KapitaalBot Observability Website

## Data flow

```
[KRAKENBOTMAART bot]
        │
        │ export (JSON files)
        ▼
OBSERVABILITY_EXPORT_DIR/
   ├── public_status_snapshot.json
   ├── public_regime_snapshot.json
   ├── public_strategy_snapshot.json
   ├── public_trading_snapshot.json
   ├── public_market_snapshot.json
   └── public_demo_trades.json
        │
        │ read (server-side, read-only)
        ▼
Next.js App Router (KapitaalBot-Website)
   ├── getPublic*SnapshotCached() (lib/read-snapshots-cached.ts) — optioneel Redis (`REDIS_URL`), TTL via `SNAPSHOT_CACHE_TTL_SEC` (default 30s)
   ├── Basis: getPublicStatusSnapshot() etc. (lib/read-snapshots.ts)
   ├── CMS: getCmsDataCached / getProductionNotesCached — `CMS_CACHE_TTL_SEC` (default 120s)
   ├── Server Components: app/page.tsx, app/dashboard/page.tsx
   └── Props → StatusStrip, MetricCardGrid, RegimeStrategyOverview, MarketSummary, DemoTradeTeaser
```

- **Geen directe DB**: de website praat alleen met het bestandssysteem (export-map); Redis is alleen een **cache** ervoor.
- **Read-only**: geen wijzigingen aan snapshot-bestanden vanuit de site.
- **Contract**: zie KRAKENBOTMAART `docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md`.

## Snapshot lifecycle

1. Bot draait en schrijft periodiek (of on-demand) JSON naar `OBSERVABILITY_EXPORT_DIR`.
2. Website leest de bestanden (met Redis-cache als `REDIS_URL` gezet is; anders direct van schijf). Requests blijven `force-dynamic` voor cookie-/locale-gedrag.
3. Ontbreekt een bestand of is het ongeldig → component toont fallback ("Awaiting bot export…") en geen crash.

## Tier model

| Tier | Toegang | Bron |
|------|--------|------|
| **1** | Publiek | Public snapshots (status, regime, strategy, trading, market, demo). |
| **2** | Na aanvraag | Uitgebreide inzichten (toekomst: execution, latency). Aanvraag via formulier → `/data/tier2_requests.json`. |
| **3** | Admin | Snapshot-status, raw JSON viewer; later auth + admin_observability_snapshot. |

## Belangrijke paden

- **Snapshots lezen**: `lib/read-snapshots.ts` (sync, met retry).
- **Types**: `lib/snapshots.ts` (contract-typing).
- **Freshness**: `lib/snapshot-freshness.ts` (GOOD/WARN/STALE).
- **Tier2-aanvragen**: `POST /api/tier2-request` → `data/tier2_requests.json`.

## i18n

- Locale via cookie `NEXT_LOCALE` (nl, en, de, fr). `lib/locale.ts`: useLocale(), getLocaleFromCookie().
- Vertalingen in `lib/i18n.ts`; nav, FAQ, access, changelog, docs. Merknaam "KapitaalBot" onvertaald.

## Positionering

- Geen sales funnel. Nav: System, Data, Notes, Architecture, Research, Access.
- Hero sober; geen harde CTA boven de vouw. Secties: What it is, How it works (abstracted), System philosophy, Production notes.
- Access-pagina met disclaimer: geen performance claims. Audit: docs/SITE_AUDIT_POSITIONING.md.

## Deployment

- Git-only: code wijzigen → commit → push → op server `git pull` + build + restart.
- Geen scp/handmatige file-copies. Server = traceerbare Git-checkout.

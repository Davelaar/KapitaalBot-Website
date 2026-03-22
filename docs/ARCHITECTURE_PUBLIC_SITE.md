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
   ├── Server Components: `app/[locale]/page.tsx`, `app/[locale]/dashboard/page.tsx`, … (alle publieke routes onder taal-segment)
   └── Props → StatusStrip, MetricCardGrid, RegimeStrategyOverview, MarketSummary, DemoTradeTeaser
```

- **Geen directe DB**: de website praat alleen met het bestandssysteem (export-map); Redis is alleen een **cache** ervoor.
- **Read-only**: geen wijzigingen aan snapshot-bestanden vanuit de site.
- **Contract**: zie KRAKENBOTMAART `docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md`.

## Snapshot lifecycle

1. Bot draait en schrijft periodiek (of on-demand) JSON naar `OBSERVABILITY_EXPORT_DIR`.
2. Website leest de bestanden (met Redis-cache als `REDIS_URL` gezet is; anders direct van schijf). Veel routes gebruiken `force-dynamic` waar nodig voor actuele data of auth.
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
- **API-routes**: zonder taal-prefix, bv. `app/api/...` (Next laat `/api/*` buiten locale-redirect).

## URL’s en SEO (locales)

- Publieke pagina’s hangen onder **`/{locale}/...`** met `locale ∈ { nl, en, de, fr }` (default `nl`).
- **`middleware.ts`**: verzoeken zonder leading locale (bijv. `/faq`) → **301** naar `/nl/faq` (default locale); uitzonderingen o.a. `/api/*`, `/_next/*`, bestanden met extensie, `/robots.txt`, `/sitemap.xml`.
- **`lib/locale-path.ts`**: `withLocale`, `stripLocalePathname`, `parseLocaleParam`; interne links gebruiken `withLocale` zodat hreflang/canonical in `buildPageMetadata` kloppen.
- **`lib/page-metadata.ts`**: canonical + `alternates.languages` (hreflang + `x-default`) per logisch pad zonder locale-prefix.
- Cookie `NEXT_LOCALE` blijft ondersteund (o.a. language switcher + fallback in `useLocale()`); primaire bron voor crawlers is het **pad**.

## i18n

- **Primair**: eerste URL-segment (`/nl/`, `/en/`, …). **Secundair**: cookie `NEXT_LOCALE` (nl, en, de, fr). `lib/locale.ts`: `useLocale()`, `getLocaleFromCookie()`.
- Vertalingen in `lib/i18n.ts`; nav, FAQ, access, changelog, docs. Merknaam "KapitaalBot" onvertaald.

## Positionering

- Geen sales funnel. Nav: System, Data, Notes, Architecture, Research, Access.
- Hero sober; geen harde CTA boven de vouw. Secties: What it is, How it works (abstracted), System philosophy, Production notes.
- Access-pagina met disclaimer: geen performance claims. Audit: docs/SITE_AUDIT_POSITIONING.md.

## Deployment

- Git-only: code wijzigen → commit → push → op server `git pull` + build + restart.
- Geen scp/handmatige file-copies. Server = traceerbare Git-checkout.

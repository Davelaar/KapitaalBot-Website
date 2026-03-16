# Changelog — Website finalisatie

## 2026-03-12 — Positionering, i18n, docs, Mermaid

- **Positionering** — Nav hernoemd naar System, Data, Notes, Architecture, Research, Access. Geen sales-funnel; contact als "Access", subtiel in footer. Hero sober: "Autonome trading runtime. Gecontroleerd, state-first, observeerbaar." Geen harde CTA boven de vouw. Secties: What it is, How it works (abstracted), System philosophy, Production notes. Access-pagina: disclaimer "Geen performance claims."
- **Audit** — docs/SITE_AUDIT_POSITIONING.md: BEHOUDEN/HERSCHRIJVEN/VERWIJDEREN/HERPOSITIONEREN per onderdeel.
- **i18n** — Uitgebreide keys (nav, faq, access, changelog, docs) in NL/EN/DE/FR. NavBar + FaqChatbot + FAQ-pagina gebruiken useLocale + t(). ComplianceBanner gebruikt useLocale uit lib/locale.ts.
- **Docs** — app/docs/page.tsx (Tier 1: SSOT-overzicht); app/dashboard/tier2/docs/page.tsx (Tier 2: doc-index). Sitemap: /docs toegevoegd.
- **Mermaid** — components/MermaidRenderer.tsx (client, mermaid.render); gebruikt op /dashboard/tier2 voor Tier- en Bot-flow diagrammen.
- **KB/FAQ** — Origin (Raymond Davelaar, 23 okt 2025) + state-first + safety-modes in faq-chat route; systeemprompt verbiedt fictieve teams/tijdlijnen.
- **Analytics** — Plausible events: tier2_request_submitted, faq_chat_question (indien plausible geladen).
- **Layout** — Header 90% breedte; footer met Access-link; metadata sober ("Geen performance claims").

## 2026-03-12 — Changelog-pagina + nav

- **app/changelog/page.tsx** — Nieuwe pagina: website-highlights (finalisatie) + engine/bot-technische highlights (Route v2, observability export, safety, epoch, lifecycle).
- **Nav** — Link “Changelog” toegevoegd in header.
- **sitemap.ts** — `/changelog` opgenomen.

---

## Gewijzigde en nieuwe bestanden (finalisatie)

### Nieuwe bestanden
- **lib/snapshot-freshness.ts** — Freshness levels (GOOD/WARN/STALE) + tooltip tekst.
- **components/MarketSummaryTable.tsx** — Client component: sorteerbare kolommen, suitability-kleur, spread-waarschuwing (>20 bps), trade density (Low/Med/High).
- **components/AdminSnapshotStatus.tsx** — Admin: snapshot-timestamps, run_id, epoch, safety counts, raw JSON toggle.
- **components/Analytics.tsx** — Plausible/Umami script (optioneel via env).
- **app/api/tier2-request/route.ts** — POST-handler: validatie, rate limit, schrijven naar data/tier2_requests.json.
- **app/robots.ts** — robots.txt (allow /, sitemap).
- **app/sitemap.ts** — sitemap.xml (/, /dashboard, /faq, /tier2-request).
- **app/error.tsx** — Error boundary met “Opnieuw proberen”.
- **app/global-error.tsx** — Root error fallback.
- **docs/ARCHITECTURE_PUBLIC_SITE.md** — Data flow, tier model, snapshot lifecycle.
- **docs/CHANGELOG_FINALISATIE.md** — Dit bestand.

### Aangepaste bestanden
- **components/StatusStrip.tsx** — Freshness-indicator (kleur + label + tooltip), skeleton “Awaiting bot export…” bij null.
- **components/MetricCardGrid.tsx** — Nieuwe kaarten (Safety Hard Blocks, Active Symbols, L3 %, Regime Switches 1h, Strategy Count, Drawdown severity), chips, mini progress bar, default export.
- **components/RegimeStrategyOverview.tsx** — Dominant-regime badge, stacked bar, lege states “Awaiting bot export…”, default export.
- **components/MarketSummary.tsx** — Gebruik MarketSummaryTable, null-state “Awaiting bot export…”, default export.
- **components/DemoTradeTeaser.tsx** — Null-state “Awaiting bot export…”, default export.
- **components/ComplianceBanner.tsx** — Locale uit cookie, t(locale, "compliance.default").
- **components/Tier2RequestForm.tsx** — POST naar /api/tier2-request, loading/success/error, validatie.
- **app/page.tsx** — Hero “Live Trading Observability Engine”, secties Waarom KapitaalBot, How Observability Works, Tier Access Model.
- **app/dashboard/page.tsx** — Imports naar default exports.
- **app/admin/page.tsx** — Laadt snapshots, toont AdminSnapshotStatus (run_id, timestamps, raw JSON) wanneer Tier 3.
- **app/layout.tsx** — OG/twitter metadata, Analytics-component, JSON-LD SoftwareApplication script.
- **app/globals.css** — Freshness CSS-variabelen, card hover, mobile padding.
- **lib/read-snapshots.ts** — Eén retry bij read.
- **.gitignore** — data/ toegevoegd.
- **docs/BOUWPLAN_STATUS.md** — Status bijgewerkt (Tier2 API, analytics, admin, i18n, etc.).

## Korte uitleg per onderdeel

| Onderdeel | Wijziging |
|-----------|-----------|
| **FASE 1** | Alle componenten expliciete Props, default export waar gevraagd; geen implicit any. |
| **FASE 2** | Freshness GOOD/WARN/STALE in StatusStrip; null → skeleton/“Awaiting bot export…”. |
| **FASE 3** | MetricCardGrid uitgebreid; MarketSummary sorteerbaar + suitability/spread/density; Regime dominant + stacked bar. |
| **FASE 4** | Homepage hero + secties Waarom KapitaalBot, How Observability Works, Tier Access Model. |
| **FASE 5** | POST /api/tier2-request, data/tier2_requests.json, rate limit, form loading/success. |
| **FASE 6** | Compliance-banner vertaald via cookie NEXT_LOCALE + t(). |
| **FASE 7** | Admin toont snapshot-status + raw JSON (bij Tier 3). |
| **FASE 8** | Analytics-component (Plausible/Umami via env). |
| **FASE 9** | OG, twitter, robots.txt, sitemap, JSON-LD. |
| **FASE 10** | BOUWPLAN_STATUS + ARCHITECTURE_PUBLIC_SITE.md. |
| **FASE 11** | Card hover, mobile padding. |
| **FASE 12** | error.tsx, global-error.tsx; retry in read-snapshots. |

## Risico’s

- **data/tier2_requests.json**: Bevat e-mailadressen; `data/` staat in .gitignore. Back-up buiten repo regelen indien nodig.
- **Rate limit**: In-memory; bij meerdere instances niet gedeeld. Voor productie: Redis of vergelijkbaar overwegen.
- **Admin Tier 3**: `requireTier(3)` is nog placeholder (geen echte auth); admin-inhoud alleen zichtbaar na aanpassen auth.

## Vervolgstappen

1. Lokaal of op server: `npm run build` en `npm run lint` draaien; eventuele type/lint-fouten oplossen.
2. Deploy via Git: commit + push, op server `git pull` + build + restart.
3. Analytics: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` of `NEXT_PUBLIC_UMAMI_WEBSITE_ID` zetten om script te activeren.
4. Sitemap base URL in `app/sitemap.ts` controleren (nu snapdiscounts.nl).
5. Tier 3 auth implementeren wanneer admin-beveiliging vereist is.

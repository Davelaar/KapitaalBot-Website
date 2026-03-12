# Bouwplan status — 20 secties

Alle 20 secties van het observability-websiteplan met status. Na elke wijziging bijwerken.

---

## Overzicht 1–20

| # | Sectie | Status | Opmerking |
|---|--------|--------|-----------|
| 1 | **Setup / repo** | ✅ | Next.js 14 App Router, env OBSERVABILITY_EXPORT_DIR |
| 2 | **Staging / productie** | ✅ | snapdiscounts.nl live; kapitaalbot.nl na migratie |
| 3 | **Snapshot-contract** | ✅ | Alleen JSON read-model; zie OBSERVABILITY_SNAPSHOT_CONTRACT.md |
| 4 | **Tier-model** | ✅ | Tier 1 (publiek), Tier 2 (aanvraag), Tier 3 (admin) |
| 5 | **Homepage** | ✅ | Hero, observability-teaser, statusstrip, metric grid, demo, architectuur, Tier2-funnel |
| 6 | **Dashboard Tier 1** | ✅ | Statusstrip, metric cards, regime/strategy, market, demo trades |
| 7 | **API-routes** | ✅ | /api/snapshots/public/* (status, regime, strategy, trading, market) |
| 8 | **Statusstrip / metrics** | ✅ | Run, epoch, freshness, safety; metric cards (trades, orders, drawdown, etc.) |
| 9 | **Regime & strategy** | ✅ | RegimeStrategyOverview, MarketSummary, DemoTradeTeaser |
| 10 | **Tier2-dashboard** | 🔶 | Route /dashboard/tier2; inhoud wanneer Tier 2-snapshots beschikbaar |
| 11 | **Tier2-aanvraag** | ✅ | Formulier /tier2-request (backend later) |
| 12 | **FAQ** | ✅ | Statische FAQ; FAQ-bot (retrieval) later |
| 13 | **CMS-light** | ⏳ | Homepage-notices, CTA, compliance overschrijfbaar (docs/CMS-LIGHT.md) |
| 14 | **Analytics** | ⏳ | Umami/Plausible; events (docs/ANALYTICS-PUSHOVER.md) |
| 15 | **Pushover** | ⏳ | Bot/BFF; data stale, safety, PnL-drempels |
| 16 | **i18n / viertaligheid** | 🔶 | Strings NL/EN/DE/FR + taalkeuze in header; content nog niet per locale |
| 17 | **Theme (dark/light)** | ✅ | ThemeToggle in header |
| 18 | **Architectuurdiagram** | 🔶 | Mermaid/SVG op homepage/dashboard nog niet |
| 19 | **Compliance-banner** | ✅ | Vaste AFM-tekst, wit, dikgedrukt, gecentreerd |
| 20 | **Header / logo / nav** | 🔶 | Nav compleet (Dashboard, Tier 2, FAQ, Admin, taalkeuze, theme). **Logo: zie hieronder.** |

---

## Logo header (sectie 20)

**Gewenste formaten (in volgorde van voorkeur):**

1. **SVG** — Aanbevolen: schaalbaar, scherp op elk formaat, kleine bestandsgrootte, eventueel te stylen met CSS (bijv. `currentColor` voor theme).
2. **PNG** — Prima; liefst 2× (bijv. 64×64 of 80×40) voor retina.
3. **JPG** — Kan; minder ideaal voor logo (geen transparantie).

Plaats het bestand in `public/` (bijv. `public/logo.svg` of `public/logo.png`). De header gebruikt nu tekst "KapitaalBot"; na toevoegen van het bestand kan de link naar home een `<Image>` of `<img>` worden met het logo.

---

## Gereed (kort)

- Secties 1–9, 11, 12, 17, 19; API, deploy, snapshot-wiring, compliance, theme, FAQ, Tier2-formulier.

## Deels

- 10: Tier2-dashboard (route klaar, content wacht op Tier 2-export).
- 16: i18n (taalkeuze + cookie; content/locale-routing nog niet).
- 18: Architectuurdiagram (tekst wel, Mermaid/SVG nog niet).
- 20: Logo nog niet in header (wel nav compleet).

## Open (later)

- 13: CMS-light.  
- 14: Analytics.  
- 15: Pushover.  
- FAQ-bot (retrieval), auth/sessie, Tier 2-snapshots backend, admin_observability_snapshot, Changelog-pagina, Contact-pagina.

---

Dit document bijwerken bij elke grotere wijziging.

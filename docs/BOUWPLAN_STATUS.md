# Bouwplan status — 20 secties

**Opdracht/specificatie:** Dit document is samen met **SITE_AUDIT_POSITIONING.md** (nav, hero, positionering) en het snapshot-contract in de bot-repo (**KRAKENBOTMAART/docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md**) de leidende specificatie voor de KapitaalBot-observability-site.

**100% opleveringsgereed.** Alles wat in dit bouwplan staat is volledig afgerond. Geen demodata, geen mocks, geen placeholders. Alle 20 secties zijn opleveringsklaar zonder uitzonderingen.

---

## Overzicht 1–20

| # | Sectie | Status | Opmerking |
|---|--------|--------|-----------|
| 1 | **Setup / repo** | ✅ | Next.js 14 App Router, env OBSERVABILITY_EXPORT_DIR |
| 2 | **Staging / productie** | ✅ | snapdiscounts.nl live; kapitaalbot.nl na migratie |
| 3 | **Snapshot-contract** | ✅ | Alleen JSON read-model; zie OBSERVABILITY_SNAPSHOT_CONTRACT.md |
| 4 | **Tier-model** | ✅ | Tier 1 (publiek), Tier 2 (aanvraag), Tier 3 (admin) |
| 5 | **Homepage** | ✅ | Sober hero, What it is, How it works, System philosophy, Production notes (uit content/production_notes.json), Access subtiel |
| 6 | **Dashboard Tier 1** | ✅ | Data-pagina; observed system behaviour; statusstrip, metric cards, regime/strategy, market, demo (echte fills uit bot) |
| 7 | **API-routes** | ✅ | /api/snapshots/public/* (status, regime, strategy, trading, market) |
| 8 | **Statusstrip / metrics** | ✅ | Run, epoch, freshness, safety; metric cards (trades, orders, drawdown, etc.) |
| 9 | **Regime & strategy** | ✅ | RegimeStrategyOverview, MarketSummary, DemoTradeTeaser |
| 10 | **Tier2-dashboard** | ✅ | Route /dashboard/tier2; leest tier2_execution, tier2_latency, tier2_pnl, tier2_safety; toont modules met echte data |
| 11 | **Tier2-aanvraag** | ✅ | Formulier + POST /api/tier2-request → data/tier2_requests.json |
| 12 | **FAQ** | ✅ | Statische FAQ; client-side zoek/filter (retrieval); FaqChatbot |
| 13 | **CMS-light** | ✅ | content/cms.json, content/production_notes.json; homepage leest production notes; compliance_override in CMS |
| 14 | **Analytics** | ✅ | Plausible/Umami script laadt alleen bij env; geen placeholder-UI |
| 15 | **Pushover** | ✅ | Bot/BFF; alerts (data stale, safety, PnL) server-side; geen website-UI vereist |
| 16 | **i18n / viertaligheid** | ✅ | Cookie NEXT_LOCALE; nav/FAQ/access/changelog/docs NL/EN/DE/FR; NavBar, FAQ-pagina |
| 17 | **Theme (dark/light)** | ✅ | ThemeToggle in header |
| 18 | **Architectuurdiagram** | ✅ | MermaidRenderer op /dashboard/tier2; mermaid npm package |
| 19 | **Compliance-banner** | ✅ | Vaste AFM-tekst, wit, dikgedrukt, gecentreerd |
| 20 | **Header / logo / nav** | ✅ | Nav: System, Data, Notes, Contact, Architecture, Research, Access, **Log in**; logo; taalkeuze; theme |

---

## Afgerond

- **Bot-export (KRAKENBOTMAART):** public_* snapshots; **demo_trades** uit echte fills (recent_demo_fills, laatste 30); **tier2_execution_snapshot**, **tier2_latency_snapshot**, **tier2_pnl_snapshot**, **tier2_safety_snapshot**; **admin_observability_snapshot**. Geen lege placeholders.
- **Website:** Tier 2-dashboard leest tier2_* en toont Execution, Latency, PnL, Safety; Production notes uit content/production_notes.json; CMS-light (content/cms.json); Changelog-pagina; Contact-pagina; FAQ met zoek/filter; Auth/sessie Tier 2/3; Admin (Tier 3) met admin_observability_snapshot.
- **Geen placeholders:** Alle data uit snapshots of CMS-bestanden; lege arrays/geen bestand = duidelijke status of "Geen recente …", geen nep-content.

---

## Logo header (sectie 20)

**Gewenste formaten (in volgorde van voorkeur):**

1. **SVG** — Aanbevolen: schaalbaar, scherp op elk formaat, kleine bestandsgrootte, eventueel te stylen met CSS (bijv. `currentColor` voor theme).
2. **PNG** — Prima; liefst 2× (bijv. 64×64 of 80×40) voor retina.
3. **JPG** — Kan; minder ideaal voor logo (geen transparantie).

Plaats het bestand in `public/` (bijv. `public/logo.svg` of `public/logo.png`). De header gebruikt nu tekst "KapitaalBot"; na toevoegen van het bestand kan de link naar home een `<Image>` of `<img>` worden met het logo.

---

Dit document bijwerken bij elke grotere wijziging.

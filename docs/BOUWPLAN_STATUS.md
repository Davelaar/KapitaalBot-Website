# Bouwplan status — 20 secties

**Opdracht/specificatie:** Dit document is samen met **SITE_AUDIT_POSITIONING.md** (nav, hero, positionering) en het snapshot-contract in de bot-repo (**KRAKENBOTMAART/docs/OBSERVABILITY_SNAPSHOT_CONTRACT.md**) de leidende specificatie voor de KapitaalBot-observability-site.

Alle 20 secties van het observability-websiteplan met status. Na elke wijziging bijwerken.

---

## Overzicht 1–20

| # | Sectie | Status | Opmerking |
|---|--------|--------|-----------|
| 1 | **Setup / repo** | ✅ | Next.js 14 App Router, env OBSERVABILITY_EXPORT_DIR |
| 2 | **Staging / productie** | ✅ | snapdiscounts.nl live; kapitaalbot.nl na migratie |
| 3 | **Snapshot-contract** | ✅ | Alleen JSON read-model; zie OBSERVABILITY_SNAPSHOT_CONTRACT.md |
| 4 | **Tier-model** | ✅ | Tier 1 (publiek), Tier 2 (aanvraag), Tier 3 (admin) |
| 5 | **Homepage** | ✅ | Sober hero, What it is, How it works, System philosophy, Production notes, Access subtiel |
| 6 | **Dashboard Tier 1** | ✅ | Data-pagina; observed system behaviour; statusstrip, metric cards, regime/strategy, market, demo |
| 7 | **API-routes** | ✅ | /api/snapshots/public/* (status, regime, strategy, trading, market) |
| 8 | **Statusstrip / metrics** | ✅ | Run, epoch, freshness, safety; metric cards (trades, orders, drawdown, etc.) |
| 9 | **Regime & strategy** | ✅ | RegimeStrategyOverview, MarketSummary, DemoTradeTeaser |
| 10 | **Tier2-dashboard** | 🔶 | Route /dashboard/tier2; inhoud wanneer Tier 2-snapshots beschikbaar |
| 11 | **Tier2-aanvraag** | ✅ | Formulier + POST /api/tier2-request → data/tier2_requests.json |
| 12 | **FAQ** | ✅ | Statische FAQ; FAQ-bot (retrieval) later |
| 13 | **CMS-light** | ⏳ | Homepage-notices, CTA, compliance overschrijfbaar (docs/CMS-LIGHT.md) |
| 14 | **Analytics** | 🔶 | Plausible/Umami script (env); page views/Tier2 events bij configuratie |
| 15 | **Pushover** | ⏳ | Bot/BFF; data stale, safety, PnL-drempels |
| 16 | **i18n / viertaligheid** | ✅ | Cookie NEXT_LOCALE; nav/FAQ/access/changelog/docs keys NL/EN/DE/FR; NavBar, FaqChatbot, FAQ-pagina |
| 17 | **Theme (dark/light)** | ✅ | ThemeToggle in header |
| 18 | **Architectuurdiagram** | ✅ | MermaidRenderer op /dashboard/tier2; mermaid npm package |
| 19 | **Compliance-banner** | ✅ | Vaste AFM-tekst, wit, dikgedrukt, gecentreerd |
| 20 | **Header / logo / nav** | ✅ | Nav: System, Data, Notes, Architecture, Research, Access, **Log in**; logo; taalkeuze; theme |

---

## Logo header (sectie 20)

**Gewenste formaten (in volgorde van voorkeur):**

1. **SVG** — Aanbevolen: schaalbaar, scherp op elk formaat, kleine bestandsgrootte, eventueel te stylen met CSS (bijv. `currentColor` voor theme).
2. **PNG** — Prima; liefst 2× (bijv. 64×64 of 80×40) voor retina.
3. **JPG** — Kan; minder ideaal voor logo (geen transparantie).

Plaats het bestand in `public/` (bijv. `public/logo.svg` of `public/logo.png`). De header gebruikt nu tekst "KapitaalBot"; na toevoegen van het bestand kan de link naar home een `<Image>` of `<img>` worden met het logo.

---

## Gereed (kort)

- Secties 1–9, 11, 12, 17, 19; API, deploy, snapshot-wiring, compliance, theme, FAQ.
- Tier2-aanvraag: formulier + POST /api/tier2-request, opslag in data/tier2_requests.json.
- Freshness indicator (GOOD/WARN/STALE), null handling (Awaiting bot export…).
- Admin: snapshot-status + raw JSON viewer (zichtbaar bij Tier 3); **beveiligd met Tier 3-login**.
- **Auth/sessie:** Cookie-gebaseerde tier-sessie; /login voor Tier 2/3; gate op /dashboard/tier2, tier2/docs, /admin. Geen standaard credentials; zie docs/ACCESS_AND_CREDENTIALS.md (TIER_COOKIE_SECRET, TIER2_SECRET, TIER3_SECRET).
- Nav bevat **Log in** (naast Access) voor zichtbare toegang tot de inlogpagina.
- SEO: OG/twitter, robots.txt, sitemap.xml, JSON-LD SoftwareApplication.
- Error boundary (error.tsx, global-error.tsx), retry in read-snapshots.

## Deels

- 10: Tier2-dashboard (route klaar, content wacht op Tier 2-export).
- 14: Analytics (Plausible/Umami script klaar; env nodig).
- 16: i18n (cookie + compliance vertaald; nav/hero/FAQ vertaling optioneel).
- Documentatie-pagina /docs (Tier 1) en /dashboard/tier2/docs (Tier 2) toegevoegd.
- Positionering: audit (docs/SITE_AUDIT_POSITIONING.md), sober hero, Access in plaats van "Tier 2" in nav.

## Open (later)

- 13: CMS-light.  
- 15: Pushover.  
- FAQ-bot (retrieval), Tier 2-snapshots backend, admin_observability_snapshot, Changelog-pagina, Contact-pagina.
- **Trades:** "Trades (24h)" = execution fills (bot: fill_count_last_24h); 0 als er geen orders zijn gevuld. "Demo trades" = sample uit bot-export; **bot exporteert momenteel altijd een lege lijst** (placeholder in KRAKENBOTMAART export.rs). Website toont uitleg bij lege state.

---

Dit document bijwerken bij elke grotere wijziging.

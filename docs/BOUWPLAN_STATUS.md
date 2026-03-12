# Bouwplan status — KapitaalBot Observability Website

Overzicht van wat uit het (verspreide) plan komt en wat er staat. Bronnen: DEPLOY.md, README, docs/CMS-LIGHT.md, docs/ANALYTICS-PUSHOVER.md, lib/i18n.ts (sectie 16), snapshot contract, compliance.

---

## Gereed

| Onderdeel | Status | Opmerking |
|-----------|--------|-----------|
| **Tier 1 data** | ✅ | Status, regime, strategy, trading, market, demo snapshots geladen en getoond |
| **Homepage** | ✅ | Hero, observability-teaser, statusstrip, metric grid, demo-teaser, architectuurtekst, Tier2-funnel |
| **Dashboard** | ✅ | Tier 1-overview: statusstrip, metric cards, regime/strategy, market summary, demo trades |
| **FAQ** | ✅ | Statische FAQ met 5 vragen (sectie 12; FAQ-bot later) |
| **Tier2-aanvraag** | ✅ | Formulier /tier2-request (nog geen backend) |
| **Admin** | ✅ | Placeholder /admin, Tier 3-gate (auth nog niet) |
| **API routes** | ✅ | /api/snapshots/public/* voor status, regime, strategy, trading, market |
| **Dark/light theme** | ✅ | ThemeToggle in header |
| **Compliance-banner** | ✅ | Vaste AFM-tekst, wit, dikgedrukt, gecentreerd (sectie 19) |
| **Deploy** | ✅ | Git-only, snapdiscounts.nl, kapitaalbot-web |

---

## Deels / nog niet zichtbaar

| Onderdeel | Status | Wat ontbreekt |
|-----------|--------|----------------|
| **i18n / viertaligheid** (sectie 16) | 🔶 | NL/EN/DE/FR strings in lib/i18n.ts, maar **geen taalkeuze in de UI**; pagina’s gebruiken de strings niet |
| **Tier2-dashboard** | 🔶 | Route /dashboard/tier2 bestaat; geen Tier 2-snapshots of content |
| **Architectuurdiagram** | 🔶 | Tekst “Mermaid build-time SVG komt in volgende iteratie”; geen diagram |
| **Navigatie** | 🔶 | Header: Home, Dashboard, FAQ, theme. Geen link Tier2-aanvraag of Admin in nav |

---

## Open (later)

| Onderdeel | Bron | Opmerking |
|-----------|------|-----------|
| **CMS-light** (sectie 13) | docs/CMS-LIGHT.md | Homepage-notices, CTA-teksten, compliance overschrijfbaar; file-based of admin-API |
| **Analytics** (sectie 14) | docs/ANALYTICS-PUSHOVER.md | Umami/Plausible; events Tier2-aanvraag, contact, FAQ, taalswitch |
| **Pushover** (sectie 15) | docs/ANALYTICS-PUSHOVER.md | Bot- of BFF-side; data stale, safety escalation, PnL-drempels |
| **FAQ-bot** | FAQ (sectie 12) | Retrieval-based, tier-aware; weigert strategie/thresholds |
| **Tier 2-snapshots** | Snapshot contract | tier2_execution, tier2_latency, tier2_pnl, tier2_safety; backend export nog niet |
| **Admin-observability** | Snapshot contract | admin_observability_snapshot; full lifecycle |
| **Auth/sessie** | lib/auth.ts | getSessionTier() placeholder; Tier 2/3 gating op sessie |
| **Mobile UX** | DEPLOY validatie | Niet expliciet uitgewerkt |
| **Changelog-pagina** | CMS-light | Niet aanwezig |
| **Contactpagina** | — | Niet aanwezig |

---

## Aanbevolen volgende stappen (zichtbaarheid)

1. **Taalkeuze in header** — Language switcher die `lib/i18n` gebruikt (path-based of cookie), zodat viertaligheid zichtbaar is.
2. **Tier2-aanvraag in nav** — Link “Tier 2” of “Aanvraag” in de header.
3. **Architectuur-Mermaid** — Eén Mermaid-diagram (bijv. Ingest → Epochs → Execution) als SVG of component op homepage/dashboard.
4. **Compliance uit i18n** — ComplianceBanner kan `t(locale, "compliance.default")` gebruiken zodra locale in de app zit; vaste AFM-tekst blijft default.

Dit document bijwerken bij elke grotere wijziging.

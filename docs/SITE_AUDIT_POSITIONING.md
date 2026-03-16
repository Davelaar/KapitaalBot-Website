# Site-audit — Positionering KapitaalBot

**Doel:** Elk onderdeel beoordelen langs de lat: autoriteit, nieuwsgierigheid, edge-bescherming, filtering retail/opportunisten, kwalificatie serieuze bezoeker. Geen sales funnel; sober, technisch, beheerst.

---

## 1. Structuur & navigatie

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| Topnav: Home, Dashboard, Changelog, Tier 2, FAQ | **HERPOSITIONEREN** | Vervangen door: System (home), Data (dashboard), Notes (changelog), Architecture (docs), Research (FAQ), Access (tier2-request). Geen "Tier 2" als verkoopterm; "Access" is zelfselecterend. |
| Header breedte | **BEHOUDEN** | 90% / max-width consistent met main. |
| Geen Buy/Pricing/Start now | **BEHOUDEN** | Huidige nav heeft dat niet. |

---

## 2. Landing / Hero

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| Label "Observability" | **HERSCHRIJVEN** | Neutraler: bijv. "System" of weglaten; geen productnaam-achtige tag. |
| Headline "Live Trading Observability Engine" | **HERSCHRIJVEN** | Technischer, beheerst; bijv. "Autonome trading runtime. Gecontroleerd, state-first, observeerbaar." Geen "Live" als marketing. |
| Subline transparantie · realtime metrics · risk-first | **HERSCHRIJVEN** | Soberder: "Capital preservation first. Execution discipline. Read-model snapshots, geen realtime signalen." |
| CTA "Bekijk status" boven de vouw | **HERPOSITIONEREN** | Geen primaire CTA boven de vouw. Eventueel subtiele scroll-cue of link naar Data verderop. |
| Sectie "Waarom KapitaalBot" | **HERSCHRIJVEN** | Hernoemen naar "What it is"; copy zonder verkoop. Capital preservation, execution discipline, risk envelope, geen buzzwords. |
| Sectie "How Observability Works" | **HERSCHRIJVEN** | Hernoemen naar "How it works (abstracted)"; lagen tonen (Market Data → Filtering → Opportunity Scoring → Execution → Risk Envelope → Feedback). Geen parameters/thresholds. |
| Sectie "Tier Access Model" | **HERPOSITIONEREN** | Behouden maar sober; geen "Vraag toegang" als hoofdknoop. Link naar Access onderaan of in nav. |
| Sectie "Architectuur (conceptueel)" | **BEHOUDEN** | Al abstract; kan iets uitbreiden met guardrails, kill switch, monitoring. |

---

## 3. Metrics / Data (Dashboard & Home)

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| StatusStrip, MetricCardGrid | **BEHOUDEN** | Gedrag tonen, geen conclusie. |
| Labels op metrics | **HERSCHRIJVEN** | Waar nodig "observed system behaviour" of "production telemetry"; geen "outperforming", "winning", "proven gains". |
| Kleuren (groen/rood) | **BEHOUDEN** | Al relatief neutraal (freshness good/warn/stale). Geen casino-uitstraling. |
| DemoTradeTeaser, MarketSummary | **BEHOUDEN** | Data als bewijs; geen marketingtekst. |

---

## 4. Copy & tone of voice

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| "Transparantie · realtime metrics" | **HERSCHRIJVEN** | Zie hero. |
| "Real execution metrics — vertraagde maar echte data" | **BEHOUDEN** | Feitelijk. |
| Alle "Waarom KapitaalBot" bullets | **HERSCHRIJVEN** | Rationeel, geen superlatieven. |
| Tier 2-aanvraagpagina copy | **HERSCHRIJVEN** | "Request Contact" / "Private Inquiry" / "Access"; disclaimer dat geen performance claims worden gemaakt. |
| FAQ-intro | **BEHOUDEN** | Al technisch. |
| Changelog | **BEHOUDEN** | Feitelijk. |

---

## 5. Contact / Access

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| Tier2-request in nav | **HERPOSITIONEREN** | Als "Access" of "Request contact"; niet prominent bovenaan. |
| Formulier tier2-request | **HERSCHRIJVEN** | Zelfselecterend: capital range (optioneel), technical background, interest type, involvement, reason. Korte disclaimer: geen performance claims. |
| Geen countdown/urgency | **BEHOUDEN** | Is er niet. |

---

## 6. Nieuwe onderdelen (toevoegen)

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| System philosophy | **TOEVOEGEN** | Korte statements: "The system prefers inactivity over uncertainty." "Losses must remain explainable." "Capital deployment requires measurable conditions." "Strategy components can be disabled without total failure." |
| Production notes | **TOEVOEGEN** | Sobere sectie: strategy pauses, parameter reviews, volatility regime changes, execution constraint updates, monitoring events. (Kan placeholder tot echte data er is.) |
| Footer contact | **TOEVOEGEN** | Subtiele link "Access" of "Request contact" in footer; niet als primaire CTA. |

---

## 7. Verwijderen / vermijden

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| Geen "koop nu", "start vandaag", "word rijk", "passief inkomen", "consistent profits", "AI-driven alpha" | **BEHOUDEN** | Komt niet voor. |
| Geen expliciete winstbeloftes | **BEHOUDEN** | Geen toevoegen. |
| Geen stockfoto's / crypto-clichés | **BEHOUDEN** | Geen toevoegen. |

---

## 8. Visuele richting

| Onderdeel | Label | Toelichting |
|-----------|--------|--------------|
| Donkere basis, hoge contrast | **BEHOUDEN** | Bestaande theme. |
| Minimale accentkleur, veel whitespace | **BEHOUDEN** | Al sober. |
| Geen overmatige glows/neon | **BEHOUDEN** | Al minimal. |
| Datavisualisatie als geloofwaardigheid | **BEHOUDEN** | Metrics/dashboard doen dat. |

---

## Samenvatting acties

- **HERPOSITIONEREN:** Nav (System, Data, Notes, Architecture, Research, Access); hero CTA naar beneden of subtiel; Tier 2 → Access.
- **HERSCHRIJVEN:** Hero headline/subline; "Waarom KapitaalBot" → "What it is"; "How Observability Works" → "How it works (abstracted)"; access-pagina copy + form zelfselecterend; metric-labels waar nodig neutraal.
- **TOEVOEGEN:** System philosophy-sectie; Production notes (placeholder mag); footer Access-link.
- **BEHOUDEN:** Layout 90%, metrics/dashboard, FAQ-structuur, compliance-banner, changelog, visuele stijl, geen sales-hype.
- **VERWIJDEREN:** Geen grote blokken; alleen losse zinnen die als marketing klinken aanpassen.

Edge-bescherming: geen parameters, geen exacte signalen, geen venue-details, geen entry/exit-logica, geen model-specs die reverse engineering vergemakkelijken. Huidige site doet dat al; bij nieuwe secties (How it works, Philosophy) alleen abstracte lagen en principes tonen.

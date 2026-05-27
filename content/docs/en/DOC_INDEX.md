# Krakenbot — Documentatie Index

Welkom bij de centrale documentatie van Krakenbot. Deze set documenten beschrijft de architectuur, werking en operatie van de bot in zijn huidige, opgeschoonde staat.

## Kern-documentatie (Git-stijl)

1. **[00 — Module-inventaris](./00_MODULE_INVENTORY.md)**
   - Technisch overzicht van alle Rust-modules, hun rollen en runtime-gates.
2. **[01 — Systeemarchitectuur](./01_ARCHITECTURE.md)**
   - Overzicht van de lagen, runtime-topologie en datastromen.
3. **[02 — Data-ingest & Marktdata](./02_DATA_INGEST.md)**
   - WebSocket v2 implementatie, feeds, L2 checksums en epochs.
4. **[03 — Strategy Pipeline & Signalen](./03_STRATEGY_PIPELINE.md)**
   - Feature extractie, regime-detectie en de route engine (V1/V2).
5. **[04 — Execution & Order Lifecycle](./04_EXECUTION_ORDERS.md)**
   - Order-placement, state-machine (SSOT) en fill handling.
6. **[05 — Protection & Exit Strategieën](./05_PROTECTION_EXIT.md)**
   - TSL logica, harde loss-caps, regime-shifts en herstelpaden.
7. **[06 — Risk & Safety Guards](./06_RISK_SAFETY.md)**
   - Capital allocator, exposure reconcile, safety states en circuit breakers.
8. **[07 — Observability & Diagnostiek](./07_OBSERVABILITY.md)**
   - Logging, funnel-events, forward-returns en telemetry.
9. **[08 — Operations & Runbook](./08_OPERATIONS.md)**
   - Deployment (Git-only), systemd, validatie en incident response.

---

## Andere talen (zelfde kernset)

- **English:** [docs/en/DOC_INDEX.md](./en/DOC_INDEX.md)
- **Deutsch:** [docs/de/DOC_INDEX.md](./de/DOC_INDEX.md)
- **Français:** [docs/fr/DOC_INDEX.md](./fr/DOC_INDEX.md)

Het modulinventaris **00** staat volledig in het Nederlands hierboven; voor een volledige technische modulelijst zie ook [English — Module inventory](./en/00_MODULE_INVENTORY.md).

---

## Aanvullende Beleidsstukken & Referenties

- **[Decimal vs f64 Policy](./DECIMAL_F64_POLICY_AND_INVENTORY.md)**
  - De strikte numerieke invarianten voor prijzen en quantities (checksum-kritiek).
- **[Forward-Returns Observability](./FORWARD_RETURNS_OBSERVABILITY.md)**
  - Details over de RESEARCH-database en de leer-lus van de bot.
- **[Fase 0B — runtime (VWAP, RouteStateStore, TOD)](./FASE_0B_RUNTIME.md)**
  - Env-flags, defaults en feitelijke wiring in de code (geen roadmap-taal).
- **[Docs Target Structure](./DOCS_TARGET_STRUCTURE.md)**
  - De blauwdruk die gebruikt is voor deze documentatie-set.

---

## Leeswijzer

- Voor **ontwikkelaars**: Begin bij [00 — Module-inventaris](./00_MODULE_INVENTORY.md) en [01 — Architectuur](./01_ARCHITECTURE.md).
- Voor **operators**: Zie [08 — Operations & Runbook](./08_OPERATIONS.md).
- Voor **analisten**: Zie [03 — Strategy Pipeline](./03_STRATEGY_PIPELINE.md) en [07 — Observability](./07_OBSERVABILITY.md).

---

*Laatst bijgewerkt: 2026-04-14.*

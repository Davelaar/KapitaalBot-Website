## 2026-03-27 alignment update

Recent alignment introduces explicit semantic tiers:
- `entry_eligible` = hard gate;
- `exit_eligible` / `protection_eligible` = soft hints.

Also clarifies asymmetric runtime behavior:
- entries require MSP;
- exits/protection remain degradable and prioritize risk reduction.
# Document Index — Actueel overzicht

**Rol van dit document:** Overzicht van alle actuele documentatie: wat leidend is, wat historisch is, en waar je wat vindt. Single source of truth voor documentatie: [ENGINE_SSOT.md](ENGINE_SSOT.md).

---

## Leidende documenten (gebruik deze)

| Document | DOC_STATUS | Onderwerp |
|----------|-----------|-----------|
| [ENGINE_SSOT.md](ENGINE_SSOT.md) | SSOT | Engine-status, statusmatrix, wat actueel is. |
| [ARCHITECTURE_ENGINE_CURRENT.md](ARCHITECTURE_ENGINE_CURRENT.md) | CURRENT | Huidige architectuur — modules, dataflow, strategy flow, execution lifecycle. |
| [LIVE_RUNBOOK_CURRENT.md](LIVE_RUNBOOK_CURRENT.md) | SSOT | Operationeel runbook — ingest, execution attach, start/stop, markers, diagnose. |
| [VALIDATION_MODEL_CURRENT.md](VALIDATION_MODEL_CURRENT.md) | CURRENT | Validatiemodel — bootstrap/attach/evaluation/lifecycle proof; economic vs data/attach blocked. |
| [OBSERVABILITY_SNAPSHOT_CONTRACT.md](OBSERVABILITY_SNAPSHOT_CONTRACT.md) | SSOT | Observability-contract tussen bot en KapitaalBot-Website. |
| [OBSERVABILITY_EXPORT_SETUP.md](OBSERVABILITY_EXPORT_SETUP.md) | CURRENT | Runbook observability export / systemd-timer. |
| [CHANGELOG_ENGINE.md](CHANGELOG_ENGINE.md) | CURRENT | Technische changelog engine (git-based, per subsystem). |
| [LOGGING.md](LOGGING.md) | CURRENT | Loggingstructuur en markers. |
| [INGEST_EXECUTION_EPOCH_CONTRACT.md](INGEST_EXECUTION_EPOCH_CONTRACT.md) | CURRENT | Epoch/snapshot/lineage contract (referentie). |
| [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md) | CURRENT | Ontwikkelregels en werkafspraken. |

---

## Ondersteunende / referentie

| Document | DOC_STATUS | Onderwerp |
|----------|-----------|-----------|
| [DB_ARCHITECTURE_STALE_EDGE_SAFE.md](DB_ARCHITECTURE_STALE_EDGE_SAFE.md) | CURRENT | State-first, partition cutover, generation contract, sync, stale-edge prevention. |
| [DB_AND_TRAILING_TRUTH_HARDENING.md](DB_AND_TRAILING_TRUTH_HARDENING.md) | CURRENT | Mandatory dual-DB roles, CLI/script targets, trailing-exit truth chain, removed fallbacks, partial exit fills. |
| [SERVER_RUNTIME_ENV_AND_READINESS.md](SERVER_RUNTIME_ENV_AND_READINESS.md) | CURRENT | `/srv/krakenbot/.env` ↔ systemd ↔ scripts, `trading_env_load_config`, `trading_env_psql_*`, `DB_ROLE_VALIDATED` / live triple guards, check-execution-readiness. |
| [EXECUTION_REPORT_FRESHNESS_AND_500L3.md](EXECUTION_REPORT_FRESHNESS_AND_500L3.md) | CURRENT | Uitgevoerde maatregelen freshness, safety, 500 L3-schaal. |
| [REFRESH_COMPLEXITY_AND_GENERATION.md](REFRESH_COMPLEXITY_AND_GENERATION.md) | BACKGROUND | Bewijs refresh O(rows); generation contract; aanbeveling duration meten. |
| [VALIDATION_REPORT_REFRESH_15MIN_RESET.md](VALIDATION_REPORT_REFRESH_15MIN_RESET.md) | BACKGROUND | Rapport 15-min ingest-validatie, refresh-besluit (run-duur cap), DB-reset; single-DB vs dual-DB (sync validatie apart). |
| [DUAL_DB_SECOND_INSTANCE_PLAN.md](DUAL_DB_SECOND_INSTANCE_PLAN.md) | BACKGROUND | Implementatieplan tweede PostgreSQL-instance op één server (poort, datadir, env, migraties, validatie); dual-DB = tweede cluster, geen 2e DB/schema. |
| [L3_CAPACITY_TEST_PLAN.md](L3_CAPACITY_TEST_PLAN.md) | BACKGROUND | L3-capaciteitstestplan. |
| [L3_MULTI_WS_INGEST_DESIGN.md](L3_MULTI_WS_INGEST_DESIGN.md) | BACKGROUND | Multi-WS ingest ontwerp; alleen bij L3-limiet nodig. |
| [MODEL_CALIBRATION.md](MODEL_CALIBRATION.md) | BACKGROUND | Modelcalibratie. |
| [UNIVERSE_AND_DIVERSITY_AUDIT.md](UNIVERSE_AND_DIVERSITY_AUDIT.md) | BACKGROUND | Universe-audit. |
| [DOC_AUDIT_RESULT.md](DOC_AUDIT_RESULT.md) | BACKGROUND | Resultaat doc-audit (Fase 1). |
| [EXIT_ORCHESTRATION_DESIGN_SPEC.md](EXIT_ORCHESTRATION_DESIGN_SPEC.md) | DESIGN | Exit-orchestratie: Canonical Protection State, ExitOwner, TSL overlap-swap, contract→invarianten, module-impact (nog niet geïmplementeerd). |
| [INVESTIGATION_ENJ_UNPROTECTED.md](INVESTIGATION_ENJ_UNPROTECTED.md) | BACKGROUND | Incidentonderzoek: ENJ “onbeschermd” vs bot-DB (geen positie/orders); root cause en aanbevelingen. |
| [PLAN_ADDENDUM_ENTRY_EXIT_ROUTING.md](PLAN_ADDENDUM_ENTRY_EXIT_ROUTING.md) | BACKGROUND | Addendum plan entry/exit routing: timing/latency first-class, route-optimalisatie (entry+exit), balance-based sizing. |
| [LIFECYCLE_PROOF_REPORT_20260311.md](LIFECYCLE_PROOF_REPORT_20260311.md) | BACKGROUND | Lifecycle proof report 2026-03-11: server-validatie commit a347ae4, run-execution-once/live, conclusie keten. |
| [HERSTELPLAN_LEAKAGE.md](HERSTELPLAN_LEAKAGE.md) | CURRENT | Herstelplan economische leakage (maart 2026): A1–F3 + D4/D5 — VWAP, fees, zero-guard, Kraken semantics, cancel-first exit, staleness guards, REST eliminatie, OTO, RecvResult, qty normalisatie. Volledig geïmplementeerd en gedeployed. |
| [EXIT_PATHS_AND_PROTECTION_RUNTIME.md](EXIT_PATHS_AND_PROTECTION_RUNTIME.md) | CURRENT | Exit-paden, emergency protection, scenario-matrix; Mermaid o.a. beschermingslaag / deadlock-recovery doelarchitectuur. |

---

## Root

| Document | Onderwerp |
|----------|-----------|
| [../README.md](../README.md) | Intro, verwijzing naar SSOT en DOC_INDEX. |
| [../CHANGELOG.md](../CHANGELOG.md) | Algemene changelog (inclusief doc-wijzigingen). |
| [SITE_DOCS_AND_CHATBOT_PIPELINE.md](SITE_DOCS_AND_CHATBOT_PIPELINE.md) | Website vs repo, RAG/chatbot-index, changelog-ledger (NL). |
| [en/SITE_DOCS_AND_CHATBOT_PIPELINE.md](en/SITE_DOCS_AND_CHATBOT_PIPELINE.md) | Zelfde pipeline — English. |
| [de/SITE_DOCS_AND_CHATBOT_PIPELINE.md](de/SITE_DOCS_AND_CHATBOT_PIPELINE.md) | Zelfde pipeline — Deutsch. |
| [fr/SITE_DOCS_AND_CHATBOT_PIPELINE.md](fr/SITE_DOCS_AND_CHATBOT_PIPELINE.md) | Zelfde pipeline — Français. |

**Rapport documentatieherstel (2026-04-01):** [NL](reports/DOCUMENTATION_INTEGRITY_RECOVERY_2026-04-01.nl.md) · [EN](reports/DOCUMENTATION_INTEGRITY_RECOVERY_2026-04-01.en.md) · [DE](reports/DOCUMENTATION_INTEGRITY_RECOVERY_2026-04-01.de.md) · [FR](reports/DOCUMENTATION_INTEGRITY_RECOVERY_2026-04-01.fr.md).

---

## Historisch / superseded (niet als waarheid gebruiken)

Deze documenten zijn **vervangen** of **historisch**. Gebruik ze niet als bron voor actueel gedrag. Zie [ENGINE_SSOT.md](ENGINE_SSOT.md) sectie 3.

- `docs/superseded/*.md` — SUPERSeded / ARCHIVE — NIET ACTUEEL (o.a. oude architectuur- en execution-runbooks).
- `docs/archive/reports/*.md` — tijdgebonden rapporten (RAPPORT_*).
- `docs/archive/research/*.md` — research outputs en experimentresultaten.
- `docs/archive/README.md` — beschrijving van archiefstructuur.

---

## Waar vind ik wat?

| Vraag | Document |
|-------|----------|
| Wat is de actuele engine-status? | ENGINE_SSOT.md |
| Hoe werkt de architectuur nu? | ARCHITECTURE_ENGINE_CURRENT.md |
| Hoe start ik ingest / execution? | LIVE_RUNBOOK_CURRENT.md |
| Wat zijn de validatie-soorten en proof? | VALIDATION_MODEL_CURRENT.md |
| Welke technische wijzigingen (engine)? | CHANGELOG_ENGINE.md |
| Welke log-markers zijn er? | LOGGING.md |
| Epoch/snapshot contract? | INGEST_EXECUTION_EPOCH_CONTRACT.md |
| State-first, partition, generation, sync? | DB_ARCHITECTURE_STALE_EDGE_SAFE.md, EXECUTION_REPORT_FRESHNESS_AND_500L3.md |
| Refresh-complexiteit, generation contract? | REFRESH_COMPLEXITY_AND_GENERATION.md |
| 15-min validatie, DB-reset, single/dual-DB? | VALIDATION_REPORT_REFRESH_15MIN_RESET.md |
| Tweede PostgreSQL-instance voor dual-DB? | DUAL_DB_SECOND_INSTANCE_PLAN.md |
| Welke docs zijn leidend / historisch? | DOC_INDEX.md (dit document) |

---

## Laatste toevoegingen

- `market_state_projection` + Redis runtime state integratie is doorgevoerd.
- Zie ook updates in: `ARCHITECTURE_ENGINE_CURRENT.md`, `ENGINE_SSOT.md`, `LIVE_RUNBOOK_CURRENT.md`, `CHANGELOG_ENGINE.md`.

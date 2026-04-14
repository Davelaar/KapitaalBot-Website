# KapitaalBot — Documentatie-index

Publieke technische documentatie van KapitaalBot. Alle documenten beschrijven het systeem op conceptueel niveau: wat het doet en waarom, zonder implementatiedetails die reproductie mogelijk maken.

---

## Documenten

| Nummer | Titel | Inhoud |
|--------|-------|--------|
| [01](./01_ARCHITECTURE.md) | Systeemarchitectuur | Lagen, datastromen, database-topologie, procesmodel |
| [02](./02_DATA_INGEST.md) | Data-ingest & Marktdata | WebSocket-feeds, L2-integriteit, toestandstabellen |
| [03](./03_STRATEGY_PIPELINE.md) | Strategy Pipeline | Regime-detectie, strategie-activatie, mandate-evaluatie |
| [04](./04_EXECUTION_ORDERS.md) | Execution & Orders | Order-lifecycle, fill-verwerking, dead man's switch |
| [05](./05_PROTECTION_EXIT.md) | Protection & Exit | Beschermingslagen, trailing stop, exit-scenario's |
| [06](./06_RISK_SAFETY.md) | Risk & Safety | Veiligheidshiërarchie, circuit breakers, watchdog |
| [07](./07_OBSERVABILITY.md) | Observability | Funnel, beslissingsvectoren, forward observations |
| [08](./08_OPERATIONS.md) | Operationeel Beheer | Deployment, diensten, incident response |
| [09](./09_STRATEGIES.md) | Strategie-families | De zes families met marktcontext |

---

## Wat deze documentatie niet bevat

- Exacte parameterwaarden, drempelwaarden of tuning-details
- Broncode of implementatielogica
- Private configuratie, API-sleutels of server-toegangsdetails
- Exacte formules voor edge- of score-berekeningen

Zie ook de [SPEC-pagina](/spec) voor de canonieke runtime-specificatie.

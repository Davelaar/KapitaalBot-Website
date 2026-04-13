# Documentation Index

This index provides a central point of reference for all documentation related to the Krakenbot trading engine.

## Core Documentation (Current Operation)

| # | Document | Scope |
|---|----------|-------|
| 1 | [`01_ARCHITECTURE.md`](01_ARCHITECTURE.md) | System overview, data flow, DB topology, process model. |
| 2 | [`02_DATA_INGEST.md`](02_DATA_INGEST.md) | Market data feeds (WS v2), internal processing, persistence. |
| 3 | [`03_STRATEGY_PIPELINE.md`](03_STRATEGY_PIPELINE.md) | Signal generation, strategy families, edge computation, confidence. |
| 4 | [`04_EXECUTION_ORDERS.md`](04_EXECUTION_ORDERS.md) | Order placement, lifecycle management, fill handling, dead-man's-switch. |
| 5 | [`05_PROTECTION_EXIT.md`](05_PROTECTION_EXIT.md) | Position management, protection placement (TSL/SL/TP), exit scenarios. |
| 6 | [`06_RISK_SAFETY.md`](06_RISK_SAFETY.md) | Capital allocation, exposure reconciliation, safety states, circuit breakers. |
| 7 | [`07_OBSERVABILITY.md`](07_OBSERVABILITY.md) | Logging, metrics, forward-return observability, Edgeboard snapshots. |
| 8 | [`08_OPERATIONS.md`](08_OPERATIONS.md) | Deployment, systemd services, .env configuration, incident response. |

## Specialized Policies and Research

- [`DECIMAL_F64_POLICY_AND_INVENTORY.md`](DECIMAL_F64_POLICY_AND_INVENTORY.md) -- Financial numeric invariants and `f64` migration status.
- [`FORWARD_RETURNS_OBSERVABILITY.md`](FORWARD_RETURNS_OBSERVABILITY.md) -- Technical details of the directional forward-return observability system.

## Documentation Management

- [`DOCS_TARGET_STRUCTURE.md`](DOCS_TARGET_STRUCTURE.md) -- Defines the target structure and rules for this documentation set.

---

*Note: This documentation is written from running, validated code. Build history and old design notes are excluded unless necessary to explain current choices.*

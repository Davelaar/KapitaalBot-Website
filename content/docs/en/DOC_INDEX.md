# KapitaalBot — Documentation Index

Public technical documentation for KapitaalBot. All documents describe the system at a conceptual level: what it does and why, without implementation details that would allow reconstruction.

---

## Documents

| Number | Title | Contents |
|--------|-------|----------|
| [01](./01_ARCHITECTURE.md) | System Architecture | Layers, data flows, database topology, process model |
| [02](./02_DATA_INGEST.md) | Data Ingest & Market Data | WebSocket feeds, L2 integrity, state tables |
| [03](./03_STRATEGY_PIPELINE.md) | Strategy Pipeline | Regime detection, strategy activation, mandate evaluation |
| [04](./04_EXECUTION_ORDERS.md) | Execution & Orders | Order lifecycle, fill processing, dead man's switch |
| [05](./05_PROTECTION_EXIT.md) | Protection & Exit | Protection layers, trailing stop, exit scenarios |
| [06](./06_RISK_SAFETY.md) | Risk & Safety | Safety hierarchy, circuit breakers, consistency watchdog |
| [07](./07_OBSERVABILITY.md) | Observability | Funnel, decision vectors, forward observations |
| [08](./08_OPERATIONS.md) | Operations | Deployment, services, incident response |
| [09](./09_STRATEGIES.md) | Strategy Families | The six families with market context |

---

## What this documentation does not contain

- Exact parameter values, thresholds, or tuning details
- Source code or implementation logic
- Private configuration, API keys, or server access details
- Exact formulas for edge or score calculations

See also the [SPEC page](/spec) for the canonical runtime specification.

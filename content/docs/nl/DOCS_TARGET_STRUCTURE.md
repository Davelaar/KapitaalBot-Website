# Documentation Target Structure

After cleanup and final validation, the following 8 core documents will be written
from running, validated code. Each document describes the bot per layer/function,
serving as a combination of technical explanation, usage guide, and troubleshooting guide.

Build history has no place unless it explains a current design choice.

## Index (alle technische docs)

| Document | Inhoud |
|----------|--------|
| **[`00_MODULE_INVENTORY.md`](./00_MODULE_INVENTORY.md)** | Volledige `src/**` module-lijst: primair / secundair / runtime per bestand |
| [`01_ARCHITECTURE.md`](./01_ARCHITECTURE.md) | Systeemoverzicht |
| [`02_DATA_INGEST.md`](./02_DATA_INGEST.md) … [`08_OPERATIONS.md`](./08_OPERATIONS.md) | Laaggidsen |
| [`FASE_0B_RUNTIME.md`](./FASE_0B_RUNTIME.md) | VWAP, RouteStateStore, ranking TOD |
| [`DECIMAL_F64_POLICY_AND_INVENTORY.md`](./DECIMAL_F64_POLICY_AND_INVENTORY.md) | f64/Decimal policy |
| [`FORWARD_RETURNS_OBSERVABILITY.md`](./FORWARD_RETURNS_OBSERVABILITY.md) | Forward returns (RESEARCH) |

## Status (core doc set)

| Item | Status |
|------|--------|
| Exhaustive per-module list (primary/secondary function, runtime gates) | **Done** — [`00_MODULE_INVENTORY.md`](./00_MODULE_INVENTORY.md) |
| Doc 01 — system overview | **Done** — [`01_ARCHITECTURE.md`](./01_ARCHITECTURE.md) |
| Docs 02–08 — layer guides | **Done** — see table below (ingest → operations) |
| Fase 0B flags (VWAP, RouteStateStore, ranking TOD) | **Done** — [`FASE_0B_RUNTIME.md`](./FASE_0B_RUNTIME.md) |

## Target documents

| # | Document | Scope | Key topics |
|---|----------|-------|------------|
| **0** | **[`00_MODULE_INVENTORY.md`](./00_MODULE_INVENTORY.md)** | **Module map (exhaustief)** | **Alle Rust-modules onder `src/`: primaire/secundaire functie, runtime gates, CLI vs live** |
| 1 | [`01_ARCHITECTURE.md`](./01_ARCHITECTURE.md) | System overview | Module map → **`00_MODULE_INVENTORY.md`**; data flow (ingest → pipeline → execution); DB topology (ingest/decision/research); WS connections; process model |
| 2 | [`02_DATA_INGEST.md`](./02_DATA_INGEST.md) | Market data layer | Ticker/trade/L2/L3 WS feeds, trade_samples, l2_snap_metrics, l3_queue_metrics, run lifecycle, epoch generation, refresh |
| 3 | [`03_STRATEGY_PIPELINE.md`](./03_STRATEGY_PIPELINE.md) | Signal generation | Route engine, move thesis dispatch, market features, strategy families, edge computation, route expectancy, confidence |
| 4 | [`04_EXECUTION_ORDERS.md`](./04_EXECUTION_ORDERS.md) | Order lifecycle | Flow poller, flow_execution, order placement (WS v2), amend/cancel, fill handling, dead-man's-switch, execution_orders table |
| 5 | [`05_PROTECTION_EXIT.md`](./05_PROTECTION_EXIT.md) | Position management | Protection placement (TSL/SL/TP), trailing stop logic, hard loss cap, stale exit, regime shift exit, orphan recovery, top-up recovery |
| 6 | [`06_RISK_SAFETY.md`](./06_RISK_SAFETY.md) | Guards and limits | Capital allocator, exposure reconcile, symbol safety state, execution lock, circuit breakers, drawdown cap, consistency watchdog |
| 7 | [`07_OBSERVABILITY.md`](./07_OBSERVABILITY.md) | Monitoring and diagnostics | Logging taxonomy, STANDARD_FUNNEL_COUNTERS, forward-return observability, edgeboard snapshots, resource telemetry, fill feedback |
| 8 | [`08_OPERATIONS.md`](./08_OPERATIONS.md) | Deployment and ops | Systemd services, deploy.sh, server validation scripts, .env configuration reference, restart doctrine, incident response |

## Existing documents (retained)

- `01_ARCHITECTURE.md` — system overview (dual-DB, WS, process modes); entry point for technical docs
- `02_DATA_INGEST.md` … `08_OPERATIONS.md` — layer guides (this table)
- `00_MODULE_INVENTORY.md` — full `src/**` module list with primary/secondary function and runtime status
- `FASE_0B_RUNTIME.md` — VWAP feed, RouteStateStore, ranking TOD: env flags, defaults, wiring
- `DECIMAL_F64_POLICY_AND_INVENTORY.md` — financial numeric invariants (referenced from AGENTS.md, .cursor/rules)
- `FORWARD_RETURNS_OBSERVABILITY.md` — directional forward-return observability (referenced from AGENTS.md)

## Writing rules

- Written from running code, not from build history
- Technical explanation + usage guide + troubleshooting in each document
- Mermaid diagrams where flow visualization helps
- Concrete tables where configuration/thresholds need listing
- Readable for non-technical consumers where useful
- No changelog-style content

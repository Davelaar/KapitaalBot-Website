# Live Runbook — Current Operational Flow

DOC_STATUS: SSOT  
DOC_ROLE: live_runbook  

**Rol van dit document:** Actuele operationele flow voor persistent ingest, execution attach, start/stop, en marker-based validation. Leidend runbook. SSOT: [ENGINE_SSOT.md](ENGINE_SSOT.md).

---

## 1. Modi

| Modus | Commando | Beschrijving |
|-------|----------|--------------|
| **Persistent ingest** | `krakenbot run-ingest` | Alleen data: public WS (ticker/trade/L2/L3), universe refresh, epoch/snapshot publish. Geen execution. |
| **Execution (met ingest)** | `krakenbot run-execution-live` | Eén proces: eigen ingest + evaluation loop + order submit. |
| **Execution attach** | `EXECUTION_ONLY=true krakenbot run-execution-live` | Geen eigen ingest; leest bestaande epochs/snapshots. Voor split: ingest draait apart (bijv. systemd). |

---

## 2. Persistent ingest (run-ingest)

- **Start:** `krakenbot run-ingest` (of via `systemd`: `krakenbot-ingest.service`).
- **Gedrag:** INSERT `observation_runs` (mode=`ingest`), `create_lineage`, start ticker/trade/L2/L3 WS, warmup 60s, daarna refresh-loop: universe selection → `create_epoch` → `insert_execution_universe_snapshot` → `compute_epoch_criteria_and_status` → `update_epoch_status` (valid/degraded/invalid).
- **Stop:** Ctrl+C; flush writer, set `ended_at`, log.
- **Markers:** INGEST_SERVICE_STARTED, INGEST_LINEAGE_CHANGED, DATA_WARMUP_COMPLETE, INGEST_EPOCH_*, UNIVERSE_SNAPSHOT_PUBLISHED.

---

## 3. Execution (run-execution-live)

- **Vereisten:** `EXECUTION_ENABLE=true`, `KRAKEN_API_KEY`, `KRAKEN_API_SECRET`, `DATABASE_URL`. Optioneel: `DECISION_DATABASE_URL` voor fysieke scheiding (ingest vs decision pool).
- **Start (met ingest):** `krakenbot run-execution-live`. Eigen run_id, lineage, WS, warmup 60s, dan evaluation loop tot runtime verstreken.
- **Start (attach):** `EXECUTION_ONLY=true krakenbot run-execution-live`. Geen WS-start; bind aan `current_valid_epoch_id` / `current_epoch_for_exit_only`.
- **Loop (state-first):** Per evaluation: `refresh_run_symbol_state` (op ingest-pool); bij `DECISION_DATABASE_URL` sync state naar decision-pool; dan readiness uit state → pipeline uit state → generation gate (execution alleen als visible generation = cycle generation) → route-freshness filter → bij Execute: choke → submit_and_wait_for_execution_reports (DB-first, OrderTracker, private WS).
- **Config:** LIVE_VALIDATION_RUNTIME_MINUTES, LIVE_EVALUATION_INTERVAL_SECS, LIVE_DATA_FRESHNESS_SECS. Runtime moet > warmup + 1× interval (bijv. ≥7 min bij 300s interval).
- **Markers:** EXECUTION_ENGINE_START, LIVE_EVALUATION_SCHEDULED, LIVE_EVALUATION_STARTED, RUN_SYMBOL_STATE_REFRESH, INGEST_DECISION_SYNC_VISIBLE (bij 2 pools), ROUTE_FRESHNESS_OK/STALE/CONTEXT, EXECUTION_BLOCKED_GENERATION_MISMATCH, DATA_FRESHNESS_EVALUATED, LIVE_EVALUATION_AUDIT, DATA_INTEGRITY_MATRIX, LIVE_EVALUATION_COMPLETED, NO_ORDER_ECONOMIC_GATING, STRATEGY_REJECTED, BLOCKER_DISTRIBUTION.

---

## 4. Server (aanbevolen)

Op server met env (bijv. `/etc/trading/rewrite.env` of `.env` in repo):

```bash
cd /srv/krakenbot
git pull
cargo build --release
# Ingest (persistent):
./target/release/krakenbot run-ingest
# Of execution (met of zonder EXECUTION_ONLY):
./scripts/start_live_validation_engine_server.sh run-execution-live
```

Script zet o.a. EXECUTION_ENABLE=true en runtime defaults. Override via env (LIVE_VALIDATION_RUNTIME_MINUTES, LIVE_EVALUATION_INTERVAL_SECS, etc.).

---

## 5. Marker-based validation

- **Bootstrap:** EXECUTION_ENGINE_START, git_commit, git_branch, build_profile (traceability).
- **Ingest:** INGEST_LINEAGE_CHANGED, INGEST_EPOCH_COMPLETED/DEGRADED/INVALID, UNIVERSE_SNAPSHOT_PUBLISHED.
- **State/sync:** RUN_SYMBOL_STATE_REFRESH (run_id, generation_id, duration_ms); bij fysieke scheiding INGEST_DECISION_SYNC_VISIBLE (cycle_generation_id, visible_generation_id); EXECUTION_BLOCKED_GENERATION_MISMATCH bij generation mismatch.
- **Evaluation:** LIVE_EVALUATION_STARTED (cycle_generation_id), LIVE_EVALUATION_AUDIT (system_live_ready, block_type), DATA_FRESHNESS_EVALUATED, ROUTE_FRESHNESS_* per symbol/route, DATA_INTEGRITY_MATRIX, LIVE_EVALUATION_COMPLETED (execute_count, skip_count).
- **No-order diagnose:** NO_ORDER_ECONOMIC_GATING (strategy/economic blockers) vs geen valid epoch / matrix false = **data/attach blocked**.
- **Exit lifecycle:** EXIT_PLAN_CREATED, EXIT_ORDER_ACKED, POSITION_MONITOR_SL_TRAILED, POSITION_MONITOR_TP_AT_MARKET (na fill).

Zie [VALIDATION_MODEL_CURRENT.md](VALIDATION_MODEL_CURRENT.md) voor proof-soorten en [LOGGING.md](LOGGING.md) voor alle markers.

---

## 6. Lifecycle proof

- **Order:** DB_FIRST_ORDER_PERSISTED → ORDER_ACK → ORDER_FILL / ORDER_REJECT / ORDER_CANCEL (logs + execution_orders, execution_order_events, fills, positions, realized_pnl).
- **Exit:** Na fill: EXIT_PLAN_CREATED → EXIT_ORDER_ACKED (SL/TP); position_monitor trail SL, TP bij market.
- **Scripts:** `validate_execution_on_server.sh`, `validate_live_engine_server.sh` — controleren git state, build, run, en DB-bewijs.

---

## 7. Attach-blocked / data-blocked diagnose

| Situatie | Betekenis | Actie |
|----------|-----------|--------|
| Geen valid epoch | Execution-only heeft geen recente epoch met status=valid | Ingest laten draaien; criteria (ticker/trade/L2/L3, symbol count) controleren. |
| system_live_ready=false | data_stale of regime=CHAOS of tradable_count=0 | LIVE_EVALUATION_AUDIT: block_type (freshness/regime/gating); meer data of andere run. |
| NO_ORDER_ECONOMIC_GATING | Matrix groen, maar pipeline geeft alleen Skip | BLOCKER_DISTRIBUTION / STRATEGY_REJECTED bekijken; economic (edge/surplus/strategy). |
| Lineage break | lineage_id gewijzigd t.o.v. vorige cycle | Exit-only mode; ingest herstart? |

---

## 8. Systemd

- **krakenbot-ingest.service:** run-ingest (persistent).
- **krakenbot-execution.service:** run-execution-live (of execution-only met EXECUTION_ONLY=true).
- Zie [systemd/README.md](../systemd/README.md) voor start/stop/restart en dependencies.

# Forward-return observability (RESEARCH pool)

Canonical storage: `RESEARCH_DATABASE_URL`, table `krakenbot.directional_forward_observations` (`migrations/research/`).  
**There is no fallback to the DECISION pool** for this subsystem.

## Wall-time vs old Instant-based finalization

**Before (not restart-safe):** the process used `tokio::time::sleep_until(signal_instant + horizon)` per row. After a restart, `Instant` anchors were lost; finalization timing was unreliable.

**After (restart-safe):**

1. Pending rows store `signal_ts` and `finalize_due_at` (typically `signal_ts + 15 minutes`).
2. A **batch sweeper** selects `status = 'pending' AND finalize_due_at <= now()` (with `FOR UPDATE SKIP LOCKED` in a transaction).
3. Returns and MFE/MAE use **wall clock**: `signal_ts` plus horizon seconds, with `price_cache` mid history keyed by **UTC** samples (`price_history`).

## Startup and runtime behavior when RESEARCH is unavailable

| Situation | Behavior |
|-----------|----------|
| `FORWARD_RETURNS_OBS_STRICT=true` and `RESEARCH_DATABASE_URL` unset | **Config load fails** — process does not start. |
| Observability enabled, URL unset, not strict | **Subsystem disabled**; log marker `FORWARD_RETURNS_DISABLED_NO_RESEARCH`. No DECISION writes. |
| URL set but host down / TLS error / auth failure | **`create_pools` fails** during connect or migrations — **whole binary exits** (same as ingest/decision failure). |
| URL set, pool up at startup, **DB goes away later** | Capture and sweeper batches **log errors** (`FORWARD_RETURNS_OBS_INSERT_FAILED`, `FORWARD_RETURNS_SWEEPER_BATCH_FAILED`). **No DECISION fallback.** Pending rows remain until RESEARCH is back. |

Operational check: [`scripts/sql/forward_returns_health.sql`](../scripts/sql/forward_returns_health.sql).

## Sweeper failure modes

- **Crash mid-batch:** the open transaction rolls back; rows stay `pending` and are picked up on the next sweep.
- **Process dies:** pending rows remain until the process restarts; sweeper uses wall time, not in-memory timers.
- **Stuck pending:** use the health query; alert if `stuck_rows > 0` or `max_lag` exceeds your SLO (e.g. 5 minutes past `finalize_due_at`).

## Health monitoring

```bash
./scripts/db_target_precheck.sh --research-only --canonical research --why 'forward_returns health'
./scripts/psql_pool.sh research -v ON_ERROR_STOP=1 -f scripts/sql/forward_returns_health.sql
```

## Backfill (Phase 4) — dry-run

1. Count on DECISION and RESEARCH **before** insert (see comments in [`scripts/sql/backfill_directional_forward_decision_to_research.sql`](../scripts/sql/backfill_directional_forward_decision_to_research.sql)).
2. Apply INSERT with `finalize_due_at` as in that file (`CASE` for completed vs pending).
3. Count again on RESEARCH; reconcile with DECISION.

## DECISION freeze verification

After deployment, the legacy DECISION table should not grow:

```bash
./scripts/psql_pool.sh decision -v ON_ERROR_STOP=1 -f scripts/sql/forward_returns_decision_freeze_check.sql
```

Optional: `REVOKE INSERT` on that table from the execution DB role.

## Cross-pool analytics (legacy + RESEARCH)

Joining DECISION and RESEARCH in one SQL session is only valid if you prove both URLs point at the same physical DB (this project assumes **separate** instances). Options: export both, join in app or analytics warehouse; Postgres FDW (often slow); or two queries and merge in tooling.

## Dataset guarantees (microstructure)

- **Immutable snapshots:** `INSERT ... ON CONFLICT (observation_id) DO NOTHING` — the first successful row per `observation_id` is canonical; retries do not overwrite.
- **Provenance:** `feature_quality` JSONB records `orderbook_source`, `trade_flow_source` (`direct` | `mid_price_proxy` | `unavailable`), `rv_1m_tick_count`, `rv_15m_tick_count`, etc. Filter clean training sets with `feature_quality->>'trade_flow_source' = 'direct'`.
- **Audit:** `computed_at` (insert time), `l2_state_hash` (SHA-256 of serialized L2 inputs used for extraction).
- **Constants in code:** `ORDERBOOK_DEPTH_LEVELS = 5`, `RV_MIN_TICKS = 5` (strict), `RV_MIN_TICKS_RELAXED = 3` — realized vol tries multiple calendar windows (1m path: 60→600s; 15m path: 900→1800s) with strict min ticks first, then relaxed; see `feature_quality` (`rv_1m_policy`, `rv_1m_effective_window_sec`, …). **Orderbook imbalance:** L2 book when subscribed; else Kraken ticker `bid_qty`/`ask_qty` via `price_cache` (`orderbook_source` / `orderbook_imbalance_source` in `feature_quality`).

## Scopes (`execution_universe`, `broad_market`)

Periodic RESEARCH snapshots (no `observation_id`) run when `FORWARD_RETURNS_SCOPE` is `execution_universe` or `broad_market` and `FORWARD_RETURNS_ALLOW_NON_ACTIVATION_SCOPE=true`. Caps: `BROAD_MARKET_MAX_SYMBOLS_PER_CYCLE`, interval `BROAD_MARKET_INTERVAL_MS`. Sampling uses a monotonic cycle per scope: `offset = (cycle * cap) % total_symbols`, then `cap` symbols with wrap-around (separate cycle counters for broad vs execution so the two modes never share offset state).

- **`broad_market`:** `total_symbols` is the **broad pool list** from `universe_source::fetch_usd_ws_symbols` (same as live `pool_symbols` / `seed_pool_symbols`).
- **`execution_universe`:** `total_symbols` is the **live execution subset** — the same ordered list as `UniverseSnapshot::execution` immediately after each `universe_mgr.commit_snapshot` in `run_execution_live` (same symbols written to ingest `execution_universe_snapshots` for that epoch). It is **not** the broad `pool_symbols` list.

## Feature definitions SSOT

Table `krakenbot.feature_definitions` (`version`, `feature_name`, …) documents formulas per `feature_version`. Join from `market_microstructure_snapshots.feature_version`.

## Phase C — Microstructure features (`market_microstructure_snapshots`)

**Goal:** labels/outcomes stay in `directional_forward_observations`; **microstructure** lives in `krakenbot.market_microstructure_snapshots` (migration `migrations/research/20260402130000_market_microstructure_snapshots.sql`).

**Design rule (feature-first, calibration-safe):**

- **Eight hot columns** hold the core metrics used most often in large-volume calibration queries — **indexed, filterable, explainable in SQL** without unpacking JSON.
- **`features_json`** holds extended / experimental keys so Phase C does not require a migration for every new idea.

**When to promote a key from `features_json` to a new column:** if repeated analyses show the same path is hot (e.g. `features_json->>'x'` in most reports), add a migration for column + backfill — avoid bloating the table without evidence.

### Hot columns (v1 contract)

| Column | Role |
|--------|------|
| `spread_bps` | Quoted spread (bps). |
| `microprice_deviation_bps` | Microprice vs mid (bps); sign in capture docs. |
| `orderbook_imbalance` | Top-of-book pressure, dimensionless (range fixed in capture). |
| `trade_flow_imbalance` | Short-window aggressor / buy–sell imbalance proxy. |
| `depth_bid_notional_quote_top` | Sum notional (quote) top-N bid levels (N in capture + optional `features_json.meta`). |
| `depth_ask_notional_quote_top` | Same for ask side. |
| `realized_vol_1m_bps` | Short-horizon vol proxy (e.g. 1m). |
| `realized_vol_15m_bps` | Longer-horizon vol proxy (e.g. 15m). |

All hot columns are **nullable** until the capture path fills them.

### Joins

- **Strong:** `observation_id` → `directional_forward_observations.id` (optional FK; `NULL` for feature-only rows). **Unique** when set: at most one snapshot per label row.
- **Weak:** `(run_id, evaluation_cycle, symbol, scope_mode)` + `feature_ts` near `signal_ts` for backfill or tooling.

### Volume / broad_market

Prefer **time partitioning** on `feature_ts` and **retention** per `scope_mode` before adding more hot columns. Keep calibration queries on the eight columns + labels; use JSON for exploratory work only.

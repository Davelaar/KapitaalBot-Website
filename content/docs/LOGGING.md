# Logging

**Rol van dit document:** Enige bron voor loggingstructuur en betekenis van logvelden. Geen tegenstrijdige of verouderde logbeschrijvingen.

Levels: **ERROR**, **WARN**, **INFO**, **DEBUG**, **TRACE** (via `LOG_LEVEL` / `RUST_LOG`).

## Strategiekeuzes (verplicht)

De volgende velden moeten bij strategiekeuzes en live execution gelogd worden:

| Veld | Beschrijving | Waar gelogd |
|------|---------------|-------------|
| gekozen pair | symbol | `phase=strategy_choice`, `phase=order_submit` (probe, pipeline) |
| waarom gekozen | reason / filter | strategy_choice message |
| current pair_score | pair_score | strategy_choice |
| current edge_score | edge_score | strategy_choice |
| conviction_band | Normal / HighConviction | strategy_choice |
| dynamic TP | dynamic_tp_bps | strategy_choice |
| SL | stop_loss_bps / protective | exit_config, exit lifecycle |
| queue_decision | join of improve | order_submit (`queue_decision`) |
| queue_ahead_notional | notional ahead in queue | entry/execution (indien beschikbaar) |
| estimated_fill_time | ms of secs | strategy_choice |
| requested_size_quote | vóór risk/constraints | strategy_choice |
| approved_size_quote | na risk/constraints | order_submit `size_quote` |
| free_quote / reserved_quote | balances | balances subscribe / execution |
| cl_ord_id | client order id | order_submit, order_ack |
| order ack | order_id, cl_ord_id | order_ack |
| fill | execution event | executions channel / fill lifecycle |
| exit reason | TP_hit / SL_hit / time_stop / panic_exit | exit lifecycle |
| realized_pnl | na close | exit lifecycle |
| protection lifecycle | placed / triggered / cancel | exit_state, exit_manager |

## Verplicht loggen (probes / live)

- **Auth bootstrap** — token fetch start/success
- **Token fetch** — ws token received
- **ws-auth connect** — private WS connected
- **Balances subscribe** — subscribe sent + acks
- **Executions subscribe** — subscribe sent + acks
- **Instrument constraints load** — symbol, constraints (price_increment, qty_min, etc.)
- **Normalization details** — raw vs normalized price/qty, source instruments_v2
- **Order submit** — symbol, cl_ord_id, side, qty, price, notional
- **Order ack** — order_id, cl_ord_id, success
- **Execution lifecycle** — fill, partial, cancel
- **Cancel lifecycle** — cancel request, confirm
- **Exit lifecycle** — EXIT_PLAN_CREATED, EXIT_ORDER_ACKED, POSITION_MONITOR_*; stop triggered, TP fill, state transitions
- **State transitions** — ExitState changes
- **Final outcome** — probe result (success/fail)

## Per probe-run

- **Correlation id** — run identifier
- **cl_ord_id** — Kraken client order id (kb-m-*, kb-rt-*, kb-strat-*)
- **symbol**, **qty**, **price**, **notional**

## Readiness gate

- **fill_probability** — Log source: `l3_based` / `fallback_based` / `missing_insufficient` (analysis/fill_probability).
- **slippage** — Log source/explanation (analysis/slippage_estimator).
- **strategy_selector** — regime, selected strategy, reason, confidence (pipeline/strategy_selector). Per-pair regime/strategy in readiness report.
- **L3** — l3_feed_connected, l3_subscribed_symbols, l3_snapshot_received, l3_update_received, l3_metrics_emitted, l3_rows_written (observe/l3_feed, db/writer).
- **WRITER_METRICS** — periodiek (elke 10s) door de writer-task: `writer_channel_pending` = geschat aantal berichten in de writer-channel (backpressure-indicator); zie db/writer.rs.
- **readiness** — Per pair: tradable, blocker, expected_edge_bps, expected_surplus_bps, cost_breakdown (gross_move, capturable_move, fees, entry/exit slippage, spread_cost, tsl_drag, exit_drag, surplus); capturable_move_bps, move_already_spent_bps, entry_timing_quality, expected_exit_slippage_bps; overall: system_live_ready, primary_blockers, recommended_next_action.
- **READINESS_GATE_DECISION** — Bij elke entry-readiness check (pair-level): `pair`, `tradable`, `blocker`, `strategy`, `expected_edge_bps`, `fill_probability`, `slippage_bps`, `confidence`. Gebruikt voor blocked (tradable=false of blocker≠None) en allowed (tradable=true, blocker=None).
- **READINESS_SYSTEM_BLOCK** — Wanneer system_live_ready=false: blokkeert alle nieuwe entries; log bevat `system_live_ready`, `primary_blockers`, `action` (recommended_next_action).
- **first_fail_blocker** (debug) — readiness_gate: bij tradable=false logt `first_fail_blocker`, expected_edge_bps, expected_surplus_bps, spread_bps (één dominante blocker per pair).

## Verplicht bij elke entry

- **symbol**, **edge_score**, **spread_bps**, **microprice_deviation**, **queue_ahead_notional**, **estimated_fill_time**, **trade_density**, **size_quote**

## Verplicht bij execution

- **queue_decision** — join of improve
- **order_price**, **order_qty**, **cl_ord_id**

## Verplicht bij exit

- **exit_type** — TP_hit / SL_hit / time_stop / panic_exit
- **realized_pnl**

## WS-native safety extensions (live engine)

De autonome live engine logt extra events om WS-native veiligheid en latency aantoonbaar te maken:

- **ORDER_LATENCY** — één log per order bij ACK:
  - Velden: `run_id`, `order_id`, `cl_ord_id`, `symbol`, `t0_decision_ts_local`, `t1_submit_ts_local`, `t2_ack_ts_exchange`, `t2_ack_seen_ts_local`, `submit_to_ack_seen_ms`.
  - Tabel: `execution_order_latency` bevat T0–T3 timestamps per order.
- **PRIVATE_STREAM_SILENT** — private ws-auth stream is langer dan `PRIVATE_STREAM_SILENT_SECS` stil geweest:
  - Velden: `run_id`, `silent_secs`, `threshold_secs`.
  - Gedrag: nieuwe token fetch + reconnect + resubscribe (executions + ownOrders).
- **QUIET_MODE_ENTER** — per-symbool quiet-mode na kritieke fout (bijv. submit-error of reject):
  - Velden: `run_id`, `symbol`, `quiet_until`, `reason`.
  - Tabel: `symbol_safety_state.quiet_until`, `primary_reason`.
- **QUIET_MODE_ACTIVE** — evaluatie die een symbool overslaat omdat quiet-mode nog actief is:
  - Velden: `run_id`, `evaluation`, `symbol`, `quiet_until`, `reason`.
- **SYMBOL_EXIT_ONLY** — pinned symbool zonder geldige L3-data gaat in ExitOnly-mode:
  - Velden: `run_id`, `evaluation`, `symbol`, `pinned`, `l3_count`, `reason=pinned_invalid_l3`.
  - Gedrag: nieuwe entries geblokkeerd; exits toegestaan zolang positie ≠ 0.
- **L3_RESYNC_LIMIT_REACHED** — L3-resync counter per symbool overschrijdt `L3_RESYNC_MAX`:
  - Velden: `run_id`, `symbol`, `l3_resync_count`, `hard_block_until`.
  - Tabel: `symbol_safety_state.mode='hard_blocked'`, `l3_resync_count`, `hard_block_until`.
- **SYMBOL_HARD_BLOCKED** — hard-blocked symbolen worden uitgesloten bij execution universe:
  - Velden: `run_id`, `evaluation`, `symbol` of `hard_blocked_symbols`, `hard_block_until`.

Deze events zijn verplicht bewijs in de server-validatie van de WS-native safety stack (zie `docs/SERVER_VALIDATION_LIVE_ENGINE.md` en `scripts/ws_safety_report.sh`).

## State-first, freshness en generation (live path)

- **RUN_SYMBOL_STATE_REFRESH** — na elke refresh van run_symbol_state:
  - Velden: `run_id`, `generation_id`, `run_symbol_state_refresh_duration_ms`.
  - Betekenis: state voor deze run is bijgewerkt; readiness/pipeline/execution in deze cycle gebruiken deze generation_id.
- **INGEST_DECISION_SYNC_VISIBLE** — bij fysieke scheiding na sync van state naar decision-DB:
  - Velden: `run_id`, `evaluation`, `cycle_generation_id`, `visible_generation_id`.
  - Betekenis: decision-DB toont nu deze generation; execution mag alleen als visible_generation_id == cycle_generation_id.
- **EXECUTION_BLOCKED_GENERATION_MISMATCH** — execution geblokkeerd omdat decision-DB andere generation toont:
  - Velden: `run_id`, `evaluation`, `cycle_generation_id`, `visible_generation_id`.
- **DATA_FRESHNESS_EVALUATED** — per evaluation: state-age en execution-eligible:
  - Velden: `run_id`, `evaluation_index`, `state_updated_at`, `state_age_secs`, `data_stale`, `execution_eligible`.
- **ROUTE_FRESHNESS_OK** / **ROUTE_FRESHNESS_STALE** / **ROUTE_FRESHNESS_CONTEXT** — per symbol/route na route-freshness filter:
  - Velden: `run_id`, `evaluation`, `symbol`, `route_type`, `horizon`, `state_age_secs`, `max_state_age_secs`, `execution_eligible`.
- **ROUTE_EXECUTION_BLOCKED_STALE_DATA** — symbool uit exec_allowed gehaald wegens te oude state voor gekozen route:
  - Velden: `run_id`, `evaluation`, `symbol`, `route_type`, eventueel `data_stale=true`.

Zie `docs/DB_ARCHITECTURE_STALE_EDGE_SAFE.md` en `docs/REFRESH_COMPLEXITY_AND_GENERATION.md`.

## Resource telemetry en event-loop lag (schaalbaarheid)

- **RESOURCE_TELEMETRY** — periodieke in-process resource-log (alleen als `RESOURCE_TELEMETRY_INTERVAL_SECS` > 0):
  - Velden: `telemetry_rss_kb` (proces-RSS in kB; Linux via `/proc/self/status` VmRSS).
  - Betekenis: zicht op geheugengebruik bij schaal (bijv. 100–400 L3); nuttig voor capacity tests.
- **Event-loop lag proxy** — geen aparte “event-loop lag”-meting; gebruik als proxy:
  - `run_symbol_state_refresh_duration_ms` — hoe lang refresh duurde; hoge waarden duiden op DB/CPU-druk.
  - `EVALUATION_CYCLE_DURATION_MS` — duur van een volledige evaluation cycle; stijging wijst op vertraging in de beslissingslus.
  - `SYNC_LAG_MS` (sync_duration_ms, time_since_refresh_end_ms) — sync-tijd ingest→decision; relevant bij fysieke scheiding.
- **EVALUATION_SCALING** — per evaluation cycle (live): `evaluation_symbol_count`, `evaluation_duration_ms`, `route_build_duration_ms`, `pipeline_duration_ms`. Gebruik bij 200/300/400 symbolen om te zien waar decision CPU/latency breekt.

Zie `docs/L3_SCHAALBEPERKINGEN_50_NAAR_400.md` voor gebruik bij L3-schaal. **Universe caps (override-only):** zie `docs/UNIVERSE_CAPS_AND_CONFIG.md`. Relevante logs:
- **UNIVERSE_SCOPE:** `usd_only=true fx_pairs_excluded=true`.
- **UNIVERSE_LIMIT_OVERRIDE_ACTIVE:** wanneer een *_OVERRIDE env gezet is; toont override-waarden en pool_symbols_fetched.
- **UNIVERSE_LIMIT_OVERRIDE_INACTIVE:** running unbounded (geen overrides).
- **UNIVERSE_START:** `pool_fetch_limit`, `pool_symbols_fetched`.

## Waar geïmplementeerd

- **Live strategy probe** (`src/probe/live_strategy_probe.rs`): `phase=strategy_choice` (symbol, edge_score, pair_score, dynamic_tp_bps, fee_bps, slippage_bps, edge_buffer_bps, conviction_band, estimated_fill_time_ms, spread_bps, requested_size_quote), `phase=order_submit`, `phase=order_ack`, `phase=cancel`, `phase=done`.
- **Live execution probe** (`src/probe/live_execution_probe.rs`): order_submit, order_ack, cancel_lifecycle, outcome.
- **Exit state / manager** (`src/trading/exit_state.rs`, `exit_manager.rs`): state transitions; protection_required; cancel only after confirmed exit (zie module-doc exit_manager).
- **Post-fill exit** (`src/execution/exit_lifecycle.rs`): EXIT_PLAN_CREATED, EXIT_ORDER_ACKED, EXIT_ORDER_SKIPPED_STALE_ACK, EXPOSURE_PROTECTION_CONFIRMED, TP_MAKER_ORDER_REJECTED.
- **Position monitor** (`src/execution/position_monitor.rs`): POSITION_MONITOR_STARTED, POSITION_MONITOR_REFRESHED, POSITION_MONITOR_STATUS, POSITION_MONITOR_SL_TRAILED, POSITION_MONITOR_TP_AT_MARKET.

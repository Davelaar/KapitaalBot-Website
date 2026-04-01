# Changelog — Engine (technical, git-based)

**Rol van dit document:** Technische changelog van de engine, gegroepeerd per subsystem. Gebaseerd op commit history. Voor algemene wijzigingen en doc-wijzigingen: zie root [CHANGELOG.md](../CHANGELOG.md).

---

## Build / lint (dead_code)

- **Policy:** No `[lints.rust] dead_code` in `Cargo.toml`; no `#![allow(dead_code)]` in leaf modules. Warnings resolved with item-level `#[allow(dead_code, reason = "...")]` or parent `mod` attributes for skeleton/domain trees; `execution` stays mostly explicit. See `docs/ENGINE_SSOT.md` and root `CHANGELOG.md` (Unreleased) for A/B/C summary.
- **Scope:** Lint/dead_code rounds **exclude** large refactors (no mass splits, no execution architecture surgery). **H/I** in `ENGINE_SSOT.md`: inventory of oversized files and confirmation that cleanup stays local/safe only.

---

## Subsystemen

- **Ingest runtime** — run-ingest, lineage, epochs, snapshots.
- **Execution engine** — run-execution-live, run-execution-only, pipeline, submit.
- **Deterministic lifecycle** — DB-first, OrderTracker, fills_ledger, state_machine.
- **Strategy engine** — regime, strategy selector, readiness, multiregime pipeline.
- **Exit runtime** — post-fill exit_lifecycle (SL, optioneel maker TP, TSL: SL → breakeven → Kraken trailing-stop); position_monitor (trail SL, TP bij market); server bewezen.
- **Validation infrastructure** — scripts, markers, proof targets.
- **Systemd / operations** — units, server scripts.
- **Documentation** — SSOT, runbooks, architecture.

---

## DB-architectuur (state-first, partition, generation)

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| (main) | db + cli + scripts | Dual-DB **live identity** guards | `DbRole`, `LiveDbTriple`, post-connect `validate_pool_live_identity` (`current_database`, `inet_server_addr`, `inet_server_port`), `DB_ROLE_VALIDATED` logs; `DB_ROLE_URL_MISMATCH` if URL db ≠ session; `assert_dual_db_live_identities_distinct` → `DB_DUAL_ROLE_AMBIGUOUS_IDENTICAL_LIVE_IDENTITY` if ingest/decision triples match; `create_pools` runs validation before migrations; `create_pools_from_env_urls` for probes; `check-execution-readiness` prints/logs live triples; `trading_env_psql_ingest` / `trading_env_psql_decision` | Voorkomt stille verkeerde pool en dubbel-role wiring met identieke backend; zie ENGINE_SSOT / SERVER_RUNTIME_ENV |
| 9863d64 | db | Incremental/watermark refresh (risico 3) | refresh_watermarks-tabel; fetch_watermarks, do_full_refresh, do_incremental_refresh (delta CTE’s id>wm, merge counts/avg/var), set_watermarks; eerste refresh full, daarna O(delta); REFRESH_INCREMENTAL log met delta_*_rows | Refresh O(delta) i.p.v. O(rows); risico 3 gesloten; zie REFRESH_INCREMENTAL_DESIGN.md |
| 5cc8322 | db + execution | Partition cutover, generation contract | Raw tabellen (L3, ticker, trade, l2) partitioned + cutover; run_symbol_state.generation_id + sequence; RefreshOutcome; state_generation_id; sync kopieert gen; live_runner: cycle_generation_id, INGEST_DECISION_SYNC_VISIBLE, EXECUTION_BLOCKED_GENERATION_MISMATCH gate; route-freshness 30s/45s + apply_route_freshness_filter | State-first live path; execution alleen op gesyncte generation; partitioned raw; zie DB_ARCHITECTURE_STALE_EDGE_SAFE.md, REFRESH_COMPLEXITY_AND_GENERATION.md |

---

## Ingest runtime

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 0d433c3 | epoch | Ingest/execution epoch contract | Migration lineage, ingest_epochs, execution_universe_snapshots, data-integrity matrix, engine modes, lineage break | Execution bindt per cycle aan één epoch |
| cae54c1 | epoch+split | Split + validatie | FASE 1 validation script/runbook; FASE 2 ingest/execution split (EXECUTION_ONLY) | run-ingest apart; run-execution-only leest epochs |
| 8de7afe | epoch | Epoch create | sqlx json feature; surface create_epoch errors | Betere foutafhandeling |
| 9c460d6 | execution | Snapshot insert | Log EXECUTION_UNIVERSE_SNAPSHOT_INSERT_FAILED bij falen | Diagnose |
| 571d1d4 | db | JSONB | Bind JSONB execution_universe_snapshots via sqlx::types::Json | Schema compat |

---

## Execution engine

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 2bd36ef | execution/live_runner + state/projection | MSP bootstrap in **beide** modi | `bootstrap_msp_engine_and_redis` + `seed_pool_symbols`; `run_execution_only_loop` roept bootstrap + seed aan (eerder alleen `run-execution-live`); live refactor naar helpers | `run-execution-only` schrijft weer naar `market_state_projection` op decision-DB; Redis alleen is geen bewijs |
| c60f165 | scripts + docs | Bewijs dual-DB MSP | `scripts/verify_msp_projection_db.sh`; `ENGINE_SSOT.md`: MSP-bootstrap invariant + vaste checkvolgorde | Geen verkeerde laag debuggen (ingest `count`=0 terwijl decision gevuld is) |
| (unreleased) | docs | Dead_code policy roadmap | `ENGINE_SSOT.md`: baseline accepted + phased plan (execution/state/MSP → drop package allow → expect/allow only) | Aligns team on lint narrowing without changing compiler flags yet |
| (unreleased) | build + deps | sqlx 0.8 + dead_code lint policy | `sqlx` 0.8.6; `dead_code` via `Cargo.toml` `[lints.rust]` instead of `main.rs` attribute; redis 0.32.x | No sqlx never-type future-incompat from dependency; explicit lint policy location |
| (unreleased) | build + execution + probes + deps | Warning debt cleanup | fixes across `protection_flow`, `ignition_exit`, `position_reconcile`, `raw_execution_backfill`, `consistency_watchdog`, `live_runner`, `ingest_runner`, `proof_runner`, probes use `price_cache` not deprecated REST | Cleaner builds; probes align with WS price SSOT |
| (unreleased) | execution/live_runner + observability | Truth-only halting + populatie-integriteit | `periodic_unprotected_pending` zet hard halt alleen bij `SnapshotLivenessState::Healthy`; staged mode bij degraded/stalled truth. Nieuwe `STANDARD_FUNNEL_COUNTERS` per cycle (`broad_candidates`, `invalid_candidates`, `admitted_symbols`, `capital_ok`, `precheck_survivors`, `order_decisions`, `orders`, `fills`) en reject-map payload in `trading_funnel_events.detail` met code_location/trigger/input/threshold context | Minder valse hard blocks bij onzekere truth + direct querybare funnel/reject oorzaak zonder losse log-scrape |
| (unreleased) | observe/l2_feed | L2 checksum mismatch mocht gehele book wissen → geen DB-L2 | Bij `L2_CHECKSUM_MISMATCH` geen `books.remove` meer: anders leeg `books` → geen `l2_snap_metrics` → `l2_raw_feature_ready` altijd false voor die run | Ingest schrijft weer L2-rijen na mismatch-storm; geen wijziging aan FEATURE_READY drempels |
| (unreleased) | execution/live_runner | Exec-only: ticker WS moet USD-pool voeden (price_cache) | `run_execution_only_loop`: `preload_all` → `fetch_usd_ws_symbols` (zelfde limiet als execution-live) + open posities; dubbele `preload_all` verwijderd; was alleen posities → lege subscribe zonder exposure | `precheck_market_price_cache` faalde onterecht (geen ticker-updates); geen wijziging aan stale/spread thresholds |
| (unreleased) | pipeline/strategy_pipeline | V2 taker zonder `CurrentRunMarketRow` | `liquidity_from_v2_state_row`: taker + geen row → `Ineligible` (`v2_no_observed_state_row_taker`); maker → spread-only fallback; warn `V2_PIPELINE_STATE_MAP_EMPTY` | Blinde market orders geblokkeerd; maker niet volledig stil; lege state-map legt taker stil |
| (unreleased) | execution/kraken_adapter + runner | Voorspelbare submit-fouten → `execution_orders.status=error` | `prepare_order_for_submit` + `validate_order_intent_exchange_rules` vóór DB-first; zelfde math als WS-send | Defense-in-depth: geen `error`-rij voor sizing/normalize (WS reject zeldzaam) |
| (unreleased) | execution/ingest_runner | `run-ingest` startte zonder instrument-preload | `instruments::preload_all()` vóór `universe_source::fetch_usd_ws_symbols` (cache was leeg → immediate exit) | Ingest-service start weer na schone binary/restart |
| (unreleased) | execution/exposure_reconcile | Dust vs “unprotected” — zelfde semantiek als protection + notional | `classify_unprotected_delta_as_dust`: USD-dust (`DUST_NOTIONAL_THRESHOLD_USD`), `qty_min` via `get_instrument_constraints` of `cached_constraints` bij cache-miss/invalid pair, `cost_min`; startup/periodic/partial-fill gebruiken helper | Voorkomt `EXPOSURE_UNPROTECTED` / `entry_halt` op puur dust (oude code sloeg dust-skip over als constraints `Err` waren) |
| (unreleased) | execution/live_runner | Protection SLA hard: geen permanente entry_halt | `spawn_emergency_protection_retry_loop`: na `PROTECTION_SLA_HARD_SECS` task niet meer beëindigen; blijft bescherming retryen tot `pending` leeg → `entry_halt` weer false | Voorkomt vastgelopen `entry_halt`+`critical_unsafe_protection_sla_hard` tot procesrestart (geen andere code zette ooit `entry_halt` terug) |
| (unreleased) | docs + script/runtime references | Cleanup voorbereiding (snapshot + referentie-fix) | Rollback snapshot vastgelegd in `docs/archive/CLEANUP_SNAPSHOT_20260321-231711.md`; stale verwijzingen in `live_runner.rs`, `health_check_after_start.sh`, `inspect_infra.sh`, `LOGGING.md` naar actuele docs | Cleanup wordt traceerbaar en link-consistent zonder runtimegedrag te wijzigen |
| (unreleased) | docs/archive + README + scripts/l3 report | Cleanup archiefstructuur en actuele index | `RAPPORT_*` en research output verhuisd naar `docs/archive/{reports,research}`; verwijzingen bijgewerkt; root README aangescherpt als actuele docs-index met expliciete archive/superseded scheiding | Repo-overzichtelijker zonder runtime-impact, minder ruis in actieve docs |
| (unreleased) | observability/export + stats_queries + tests | Batch 5 test/observability verdieping | Tier2 PnL snapshot met Sharpe/Sortino-like + drawdown duration buckets; risk-adjusted helper voor 24h buckets; contractdoc update; nieuwe integration tests voor order lifecycle state transitions in `tests/` | Betere regressiedekking en rijkere risk-performance telemetrie |
| (unreleased) | docs + root env template | Batch 4 compliance baseline | Nieuwe docs `INCIDENT_RESPONSE.md` en `DATA_RETENTION_PRIVACY.md`, README legal/compliance sectie, runbook compliance-verwijzingen, `.env.example` template voor veilige onboarding | Minder operationele/juridische ambiguiteit en betere auditbaarheid |
| (unreleased) | pipeline/outcome + execution + db/read | Batch 3 economics/gating | Outcome en ExecutionIntent dragen pre-trade metrics; `on_submitted_with_metrics` persist `decision_ts`, `expected_surplus_bps`, `fill_prob_snapshot` en slippage expectations payload; drawdown gate switched naar 24h realized PnL query; trailing-stop fill slippage berekend tegen `orderbook_mid` | Beter kalibratiepad op orderniveau + policy-consistente 24h drawdown guard |
| (unreleased) | observe/l2_feed + execution/private_msg_source + docs | Batch 2 integriteit/hub betrouwbaarheid | L2 top-10 checksum validatie (CRC32), mismatch markers + runtime resubscribe; `PrivateMsgSource` degraded/recovered markers + hard reset threshold op lag storms; herstelplan docs update | Minder stille L2-corruptie en snellere recovery bij broadcast message loss |
| (unreleased) | exchange/auth_ws + private_ws_hub + execution/runner | Batch 1 safety hardening | `cancel_all_orders_after` request + sender methode; private hub armt/refresht/disarmt DMS (`60s`/`20s`); reconnect backoff+jitter (1s→60s); `runner.rs` fail-closed bij missende sender/token; `live_runner.rs` verwijdert twee `bound_epoch.unwrap()` | Lagere runaway-risk bij disconnect + geen panic op sender/token fallback |
| c7f9650 | exchange/universe_source + instruments | D5: Startup REST eliminatie | `fetch_usd_ws_symbols` leest uit `instruments::cached_symbols_with_status()` i.p.v. REST AssetPairs; `cached_symbols_with_status()` nieuw | Nul REST in volledige runtime inclusief startup |
| 65c726b | messages + auth_ws + kraken_adapter + exit_lifecycle + runner | D4: OTO trailing-stop | `ConditionalParams` struct; `add_order_with_conditional`; `submit_order` oto_trail_bps param; `discover_oto_trailing_stop`; exit_lifecycle `oto_used` flag | Elimineert 50–200ms onbeschermde exposure na fill |
| c1e1c7f | instruments + exit_lifecycle + ignition_exit | F3: Exit qty dust tracking | `normalize_exit_qty(raw, balance, constraints)` ceil-to-step; alle exit market orders genormaliseerd | Geen dust accumulatie |
| fae0c36 | private_msg_source + exit_lifecycle + ignition_exit + runner + protection_flow | F2: Channel close detectie | `RecvResult` enum; `recv_timeout` → `RecvResult`; `ChannelClosed` escalatie in kritieke paden; `into_option()` convenience | Geen stille timeout bij WS reconnect |
| 16e51dc | exit_lifecycle | F1: time_stop_secs guard | Clamp 0→60s + `EXIT_TIME_STOP_MISCONFIGURED` warning | Geen instant exit bij misconfiguratie |
| 4ca8fab | fills_ledger | E3: CTE fill processing | `upsert_position_cte_tx` vervangt 3 sequentiële DB calls | -2 round-trips per fill |
| 15e435a | messages + private_ws_hub + runner + exit_lifecycle + protection_flow | E2: Elimineer dubbele serde | `parsed_reports` op `PrivateV2Response`; hub parst eenmaal; runner hergebruikt | Geen redundante deserialisatie |
| 84c09a2 | ws_handler + price_cache | E1: Orderbook mid bij fill | `snapshot_fresh(2s)` mid-price voor slippage meting | Real-time slippage observability |
| 81885e4 | runner | D3: Fire-and-forget DB writes | `order_latency` + `trading_funnel_events` via `tokio::spawn` | -2–15ms submit latency |
| b76d0b6 | messages + auth_ws + runner | D2: Deadline parameter | `AddOrderParams.deadline`; auto 5s market; `ORDER_DEADLINE_ELAPSED` handling | Geen late matches |
| b35388e | kraken_adapter + instruments | D1: REST→price_cache | 3 REST calls → `price_cache::snapshot_fresh(5s)`; `get_best_bid/ask` deprecated | Nul REST in hot path |
| a99ab2f | exit_lifecycle + price_cache | C2: Fill price fallback fix | Mid-price via `snapshot_fresh(3s)`; bail bij stale | Geen systematische negatieve slippage |
| 2b89839 | price_cache + balance_cache | C1: Staleness guard | `last_price_fresh` + `snapshot_fresh` functies; balance_cache 30s filter | Geen stale-data beslissingen |
| 18fd1a2 | exit_lifecycle | B2-fix: Cancel classify order_id | `result.order_id` match tegen `protection_order_id` | Geen double-exit |
| a565504 | private_msg_source + private_ws_hub | B4: Broadcast lag recovery | `BROADCAST_CAPACITY=2048`; lagged tracking; degraded escalatie | Geen ongedetecteerd berichtverlies |
| 4ede196 | exit_lifecycle | B3: Panic fill-timeout | `MARKET_FILL_TIMEOUT_EXPOSURE_RISK` bail | Expliciete escalatie |
| 0357d8b | exit_lifecycle | B2: Cancel-first spot exit | `CancelOrFill` enum; balance-verificatie; cancel-before-market | Spot-safe, geen reduce_only |
| d1e8317 | ws_handler + exit_lifecycle + ignition_exit + position_monitor | B1: Kraken WS v2 semantiek | `is_fill_exec_type` + `is_order_completed_status` helpers; strikte matching | Geen niet-officiële waarden |
| 667c7e0 | ws_handler | A3: Fill price zero-guard | `FILL_PRICE_ZERO_REJECTED`; fill met prijs 0 geweigerd | Ledger integriteit |
| 9abc22c | fills_ledger | A2: Fee-aftrek in PnL | `compute_realized_pnl` met proportionele fees | Correcte PnL |
| e2d08e5 | fills_ledger | A1: VWAP-corruptie fix | Expliciete branches (close/add/reduce/flip); 7 tests | Correcte avg_entry |
| aae7e60 | ws_handler + execution_orders + balance_cache + positions + exposure_reconcile | Truth: order_qty + balance | ACK/fill: `sync_quantity_base_from_exchange`, `bump_quantity_base`; fill target qty = max(tracker, DB, report.order_qty). Long: repair `base_position` up from `balances` WS when fresh | Minder under-filled DB vs Kraken; fills niet enige SSOT voor grootte |
| d08e9ba | protection_flow + position_reconcile | SL ACK insufficient funds | Geen hard_block op die ACK; `open_order_ids_on_side`; cancel open exit-side orders per symbool; `wait_fresh_after`; één SL retry; `PRECANCEL_EXIT_SIDE_ORDERS` event | Reserved base door bestaande sells op het paar vrijmaken; spot safety |
| 7a99fa5 | exchange/auth_ws | Spot protection ACK | `add_stop_loss_order` / `add_trailing_stop_order`: `reduce_only` weggelaten (serde skip) | Geen Kraken spot reject op reduce_only |
| 0a79e25 | exit_lifecycle + ignition_exit + exposure + db | Protection gap + desync | Market exit ACK vóór SL cancel; `reopen_if_nonzero` in exposure load; dual-db script labels | Minder naakte exposure; status/qty align |
| cb98e09 | scripts/sql | SEV0 remediation performance | Ingest approx counts; psql statement_timeout in runner | Server audits time-bounded |
| 328ed8d | exit_lifecycle | TSL native trailing na breakeven | Bij `use_trailing_stop` + `trail_distance_bps`: monitor annuleert SL zodra prijs ≥ breakeven, plaatst `add_trailing_stop_order`; executions detecteren trailing fill; time_stop cancelt trailing i.p.v. SL; SL-fill alleen vóór swap | TSL: geen TP; trail distance = SL bps; geen amend-trail op vaste SL na swap |
| 0cda8cd | exit_state + strategy_selector | TSL policy | `ExitConfig.use_trailing_stop`; TSL base `time_stop_secs=900`, `use_maker_tp=false`; scaled branches `take_profit_bps=0` | 15 min time box; geen maker TP op TSL |
| fb49917 | exchange/auth_ws | Trailing-stop WS sender | `add_trailing_stop_order(token, symbol, side, qty, trail_distance_bps, cl_ord_id)` | Kraken trailing-stop vanuit bot |
| 90bf2a8 | pipeline + live_runner + exit_state | ATR-achtige TSL stops | `trail_distance_bps` op ExitConfig; `vol_at_hold_bps` arg; live_runner: ignition `metrics_for(symbol)` → `vol_at_hold_bps(max_hold_secs)`; fallback TSL nog expected_move-based met trail=SL | SL/TSL afstand gekoppeld aan hold-window vol; live pad alleen |
| 1045e40 | ignition/metrics | Hold-aligned vol | `rolling_vol_15m_bps`; `vol_at_hold_bps` kiest 5m/15m/30m median abs return | Input voor SL scaling |
| 6040fe9 | execution + order_reconcile + own_orders_cache | Stale orders bij start | `reconcile_stale_orders_at_startup` na exposure block (full + exec-only) | Minder phantom open orders in DB vs exchange |
| 64a9dd9 | exit lifecycle + pipeline + strategy_selector | Horizon-aware SL/TP/time_stop + direction fix | `exit_config_for_exit_strategy_with_route(exit, max_hold_secs, expected_move_bps)`: SL=50% expected_move (min 100, max 500 bps), TP=150% expected_move (min 150, max 1000 bps), time_stop=horizon max_hold_secs; `Outcome.max_hold_secs` + `expected_move_bps` vanuit V2 pipeline (`horizon.max_hold_secs()` i.p.v. `route.max_hold_secs` dat 0 is bij TSL); `exit_lifecycle.rs` direction-aware SL/TP (long: SL onder entry, short: SL boven entry) | Breakout trades krijgen proportionele exit config i.p.v. vaste 60bps SL / 30s time_stop; geen impact op MakerLadder/TimeDecay |
| (latest) | route + analysis + cli | Execution universe feature-complete | CurrentRunMarketRow.l2_count, is_feature_complete(); route analysis filter op feature-complete; FEATURE_FILTER_APPLIED, FEATURE_INCOMPLETE_SYMBOLS; report-feature-completeness; docs/FEATURE_COMPLETENESS_CONTRACT.md | Route engine evalueert alleen symbolen met bruikbare L2 state; economics stabiel op filtered universe |
| — | execution + route + db + cli | Model Input Pipeline Hardening | FEATURE_COVERAGE_L2 + ROUTE_ENGINE_SKIP bij coverage < 60%; FEATURE_READY_SIGNAL + refresh gate (l2_raw_feature_ready); MarketFeatures l2_*_missing + path fallback (confidence/move); DIRECTION_FALLBACK_USED; economics CLI exit(2); report-l2-feature-lineage; docs MODEL_INPUT_PIPELINE_HARDENING, L2_FEATURE_LINEAGE_DEBUGGING | Geen silent degradation; economics tuning alleen bij voldoende L2 coverage; zie CHANGELOG.md sectie Model Input Pipeline Hardening |
| a9778a1 | execution | LIVE_USE_OWN_RUN_ONLY warmup poll | Na flush: poll run_raw_counts(ingest, run_id) elke 2s tot sufficient (max 90s); log LIVE_USE_OWN_RUN_ONLY: raw data sufficient | Capacity-test symbol_count eenduidig op eigen run |
| 6c72ab5 | execution | LIVE_USE_OWN_RUN_ONLY flush vóór refresh | Flush writer + 3s sleep vóór warmup-check (eerste versie) | Voorloper van poll-aanpak |
| 0f27b96 | execution + config + epoch | LIVE_USE_OWN_RUN_ONLY | Config live_use_own_run_only; warmup data_run_id=run_id, 60s; epoch binding select_valid_epoch_for_run / current_epoch_for_exit_only_for_run; script EXECUTION_UNIVERSE_LIMIT, LIVE_USE_OWN_RUN_ONLY | Geïntegreerde run voor schone 400-test |
| 2e525b4 | config | EXECUTION_ONLY parse | parse_bool_env: accept "1"/"0"/"true"/"false" i.p.v. alleen bool parse | systemd EXECUTION_ONLY=1 werkt; execution draait in split mode |
| 2e525b4 | execution | Lineage break eerste binding | lineage_break_detected alleen bij vorige lineage != huidige; last_bound_lineage_id altijd na binding zetten | Geen onterechte ExitOnly bij eerste epoch-binding |
| b793739 | execution | Execution layer | Migration, execution/*, db execution tables, runner, server validation script | Eerste execution path |
| 838c8c3 | execution | Live validation | run-execution-live: long-running met WS data + periodic pipeline | Live loop |
| fa69932 | execution | Scheduling | Guard: runtime > warmup + interval; LIVE_EVALUATION_SCHEDULED/STARTED/COMPLETED/SKIPPED | Geen start bij te korte runtime |
| c8b471c | execution | Shutdown | Cap sleep to deadline in run-execution-live | Nette shutdown |
| 0715310 | execution | Multistrategy | Restore multistrategy live candidate flow | Strategy in live path |

---

## Deterministic lifecycle

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 3b98ea8 | execution | Deterministic engine | 13 states, DB-first, OrderTracker, fills_ledger, reconcile | Geen f64 in beslissingen; traceerbare lifecycle |
| c4edd1c | execution | OrderTracker | Wire OrderTracker + ws_handler in live execution loop | ACK/FILL/REJECT/CANCEL via tracker |
| a30e38c | execution | Fills | execution_report_to_event incremental fill (cum_qty_before); AmendOrderParams skip order_id when None | Correcte fill-accounting |
| 0d29b83 | db | Query | query_scalar return type (i64,) → i64 | Typefix |

---

## Route Decision Engine v2

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| a50de41 | route_engine | Market-first route engine v2 | Nieuwe modulaire route decision layer: types, market_features, expected_path, route_expectancy, route_selector, shadow (7 bestanden, 1282 LOC) | Vervangt strategy-first economic decisioning; per pair: market features → expected path → route candidates → expectancy → winner (route×horizon×entry×exit) of NoTrade |
| a50de41 | pipeline | V2 pipeline bridge | run_strategy_pipeline_v2: converteert V2RouteReport → Outcome via legacy strategy mapping, risk gate, sizing | V2 routeresultaten bruikbaar in bestaande execution layer |
| a50de41 | execution | V2 integration | live_runner: evaluatieloop vervangt readiness+v1 pipeline door v2 route analysis + v2 pipeline | Runtime draait nu v2 engine |
| a50de41 | shadow | Counterfactual logging | why_lost met numerieke deltas (edge/confidence/score vs winnaar); ROUTE_SHADOW_SUMMARY met winner edge+score | Beslissingen volledig traceerbaar in runtime logs |

---

## Strategy engine

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 650a909 | readiness | Volume EdgeNegative bypass + entry lookup | readiness_gate: Volume uitgezonderd van generiek EdgeNegative; check_entry_readiness: matcht nu symbol+strategy | Volume niet meer onterecht geblokt; geen StrategyMismatch meer |
| 9a1a48c | analysis | Capturable move strategy-aware | CapturableMoveInputs per strategie met strategy_move_bps i.p.v. maker expected_move_bps; voorkomt onterechte SurplusBelowFloor voor Momentum | Correcte capturable_move → cost_breakdown → surplus floor |
| 82d88a8 | pipeline | Multiregime | Per-pair strategy in readiness check, funnel drop counts, no_pair guard | Regime → strategy per pair |
| e157c5a | analysis | Pro engine | Readiness, cost/surplus, live validation, post-trade layers | Readiness gate, cost_breakdown |

---

## Validation infrastructure

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 00ea2f5 | scripts | Validate | Fail on dirty tree, SKIP_RUN, server instructions | Betrouwbare server-validatie |
| 212beee | scripts | Validate | Load ~/.cargo/env when cargo not in PATH (ssh) | Script werkt non-interactive |
| cff7b72 | scripts | Validate | Fail when proof target unmet | Strikte proof |
| 5cb496b | scripts | Validate | Handle unset SKIP_RUN | Robuustheid |
| 3112cbd | execution | Proof | run-deterministic-proof: live edge-case validation | Internal exerciser |
| f646c2e | docs | Proof | Label run-deterministic-proof as internal; distinguish from live validation | Duidelijkheid |

---

## Universe / safety

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 068b67b | universe | Dynamic universe | UniverseManager, atomic snapshot rotation | Pool/L2/L3/execution layers |
| c182d4e | universe | Pinning | Use base_position in positions table | Correcte pinned set |
| 128f314 | universe | Execution | Filter illiquid symbols from Execution layer | Minder ongeschikte symbols |
| b4ad93b | universe | Epoch | MIN_EXECUTION_TICKER_ACTIVITY = 10 (= epoch minimum) | Epoch valid haalbaar |
| dd48798 | execution | Safety | WS-native safety: latency, watchdog, exit-only, hard-block | symbol_safety_state, quiet mode |
| 52262e9 | scripts | Safety | ws_safety_report script | Rapportage |
| 778b788 | execution | Safety | Pinned invariants, WS reconcile logs, latency heatmap | Logging |

---

## Systemd / operations

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| (unreleased) | scripts/deploy + `.cursor/rules` | Git-only deploy | `deploy.sh`: rsync-release flow verwijderd; alleen `ssh` → `git pull --ff-only` in `/srv/krakenbot` + `cargo build --release`; `git-only-codeflow.mdc`: subsectie `scripts/deploy.sh` | Sluit aan bij harde regel: geen rsync van bron buiten Git |
| c2e5c8b | scripts | Server | start_live_validation_engine_server.sh executable | Server start |
| 5191d7c | docs | Rule | Server validation steps in git-only-codeflow rule | Repo policy |

---

## Observability export

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 61f96fa | observability | Read-model export | observability_queries, observability/snapshots+export, CLI export-observability-snapshots, OBSERVABILITY_SNAPSHOT_CONTRACT.md | JSON-snapshots voor KapitaalBot-Website BFF; geen directe DB-toegang vanuit website |

---

## Exit, capital, epoch validity (2025-03-17)

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
| 9bd11b1 | epoch | L2/L3 epoch validity | L2 cold-start (>50% l2=0 → criteria_l2_ok); L3 partial (frac_l3≥70% → criteria_l3_ok); EPOCH_VALIDITY_COMPUTED l2_cold_start | Epoch valid bij warmup en Kraken L3 rate limits |
| 35071f9 | docs | SSOT/ARCHITECTURE | Exit (post-fill + position_monitor), compounding (live equity), capital (CapitalAllocator) actueel | Publieke docs up-to-date |
| 764eebe | execution | Restart doctrine | Unbounded runtime (0=unbounded); lineage_break→NoNewEntries; RESTART_DOCTRINE.md | Geen tijdslimiet; lineage grace 1 cycle |

---

## Documentation milestones

| Commit | Doel | Wat veranderd |
|--------|------|---------------|
| dcdf2de | Live runs | Docs: live validation runs analysis (run_id=32-34) |
| 32aae98 | Deliverable | Deterministic engine deliverable OrderTracker wiring status |
| e57a816 | Universe | Universe audit (200/60/50/30); repo policy remote-execution-ssh |
| 985ff06 | Audit | TDD gaps + server validation + universe audit (git-only codeflow) |
| b183ae9 | Audit | Instrument constraints + execution pipeline funnel + EXECUTION_ENABLE |

---

*Laatste update: 2026-03-27 (matrix audit). Gebaseerd op git log + code/runtime verificatie; geen marketing claims.*

---

## 2026-03-27 — MSP + Redis runtime state

- Added: `market_state_projection` migration + DB access module.
- Added: Redis runtime module and MSP event engine (`src/state/projection.rs`).
- Changed: execution/protection/reconcile/monitor paths now emit/read MSP events/state.
- Changed: startup (`live_runner`) seeds USD symbols and rebuilds Redis from DB projection.
- Safety: per-domain confidence model + entry/protection eligibility gating via MSP runtime state.

## 2026-03-27 — Asymmetric MSP gating alignment

- Changed (`flow_execution`): MSP is now mandatory for new entries; explicit block markers `EXECUTION_BLOCKED_NO_MSP` / `EXECUTION_BLOCKED_NO_MSP_STATE`.
- Changed (`protection_flow`): MSP consulted as soft hint (`PROTECTION_MSP_SOFT_HINT_NOT_ELIGIBLE`), but protection remains degradable and not hard-blocked on MSP absence.
- Changed (`position_monitor`): MSP context enrichment added to status logs; direct price/execution truth remains primary runtime control path.
- Changed (`exposure_reconcile`): hybrid lock and exposure notional model:
  - MSP expected-state context (drift/halt/expected qty),
  - DB/WS truth retained for open-orders/hard safety,
  - temporary dual-read validation logs (`LOCK_MSP_DB_POSITION_MISMATCH`, `NOTIONAL_MSP_FALLBACK_TO_DB`, `RECONCILE_MSP_UNAVAILABLE_FALLBACK_DB`).
- Changed (`live_runner`): startup phase visibility marker `MSP_RUNTIME_PHASE_CHECK` (bootstrap/warming/live counts).

## 2026-03-27 — ENGINE_SSOT Matrix Audit & Closure

- **Audit:** Volledige verificatie van alle 27+ matrix-items tegen code, runtime en server-state.
- **Fixed (docs):**
  - Execution attach: `EXECUTION_ONLY=true` + `run-execution-live` wordt afgewezen door `execution_runtime_verify`; docs aangepast naar `run-execution-only`.
  - DbPools: was "Optioneel" in matrix, is feitelijk verplicht (binary weigert start); gecorrigeerd.
  - Competitive strategy scoring: vervangen door V2 route engine pair/route ranking; matrix bijgewerkt.
  - Regime: duaal systeem (`detect_regime` + `classify_regime`) nu expliciet gedocumenteerd.
  - Armed/Triggered exit path (ExitManager): als dead code geclassificeerd en gedocumenteerd.
  - Maker fallback: verduidelijkt dat `queue_decision()` in pipeline werkt maar submit altijd "join" is.
  - DB physical separation: model A (logisch) niet meer ondersteund; gecorrigeerd.
- **Identified gaps (niet in deze ronde gefixt):**
  - `execution_orders.regime` kolom wordt nooit gevuld door `insert_order` → observability toont `unknown`.
  - Dual regime systeem (`detect_regime` vs `classify_regime`) is architectureel rommelig maar functioneel correct.
- **Server-state:** MSP DB=642, Redis=642, phase=live, entry_eligible=true, CRITICAL_UNSAFE=0, positions=0, snapshots flowing (549-551 symbols).

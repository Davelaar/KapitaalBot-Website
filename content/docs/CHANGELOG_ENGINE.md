# Changelog — Engine (technical, git-based)

**Rol van dit document:** Technische changelog van de engine, gegroepeerd per subsystem. Gebaseerd op commit history. Voor algemene wijzigingen en doc-wijzigingen: zie root [CHANGELOG.md](../CHANGELOG.md).

---

## Subsystemen

- **Ingest runtime** — run-ingest, lineage, epochs, snapshots.
- **Execution engine** — run-execution-live, run-execution-only, pipeline, submit.
- **Deterministic lifecycle** — DB-first, OrderTracker, fills_ledger, state_machine.
- **Strategy engine** — regime, strategy selector, readiness, multiregime pipeline.
- **Exit runtime** — post-fill exit_lifecycle (SL+TP), position_monitor (trail SL, TP bij market); server bewezen.
- **Validation infrastructure** — scripts, markers, proof targets.
- **Systemd / operations** — units, server scripts.
- **Documentation** — SSOT, runbooks, architecture.

---

## DB-architectuur (state-first, partition, generation)

| Commit | Subsystem | Doel | Wat veranderd | Impact |
|--------|-----------|------|---------------|--------|
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
| c2e5c8b | scripts | Server | start_live_validation_engine_server.sh executable | Server start |
| 5191d7c | docs | Rule | Server validation steps in git-only-codeflow rule | Cursor rule |

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
| e57a816 | Universe | Universe audit (200/60/50/30); Cursor rule remote-execution-ssh |
| 985ff06 | Audit | TDD gaps + server validation + universe audit (git-only codeflow) |
| b183ae9 | Audit | Instrument constraints + execution pipeline funnel + EXECUTION_ENABLE |

---

*Laatste update: 2025-03-17. Gebaseerd op git log; geen marketing claims.*

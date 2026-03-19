# Definitieve DB-architectuur voor stale-edge-safe live trading

DOC_STATUS: CURRENT  
DOC_ROLE: db_architecture_state_first  

Onderzoek en classificatie (DEEL A–H). Code-first; dit doc ondersteunt de implementatie.

---

## DEEL A — Epoch / Snapshot / State: contract map

| Concept | Definitie | Bestanden |
|--------|-----------|-----------|
| **Epoch** | Een `ingest_epochs`-rij: monotone `epoch_id` per lineage, status `valid`/`degraded`/`invalid`, `completed_at`, koppeling naar `execution_universe_snapshot_id`. Bepaal of execution entries mag (valid) of alleen exit (degraded). | `src/db/ingest_epoch.rs`, `src/db/read/epoch_queries.rs` |
| **Snapshot** | Een `execution_universe_snapshots`-rij: bevroren set `execution_symbols` + `pinned_symbols` op een tijdstip (`as_of`, `published_at`), gekoppeld aan één epoch. | `src/db/ingest_epoch.rs` (insert), `src/db/read/epoch_queries.rs` (execution_universe_snapshot_by_id) |
| **State** | `run_symbol_state`: afgeleide tabel, ververst uit raw (ticker_samples, trade_samples, l2_snap_metrics, l3_queue_metrics). Enige bron voor decision-hot reads na refresh. Heeft `updated_at` per rij; contract: decision-eligible = state uit refresh in deze evaluation-cycle. | `src/db/run_symbol_state.rs` |

Relatie: **Lineage** (1) → **Epochs** (N) → elk epoch optioneel **ExecutionUniverseSnapshot** (1). **State** onafhankelijk: per `run_id` één refresh die raw → run_symbol_state overschrijft.

### Contracts naar consumers (na implementatie)

| Consumer | Epoch | Snapshot | State |
|----------|-------|----------|-------|
| **live_runner** | Bindt 1 valid/degraded per cyclus; max_epoch_age_secs. | Leest snapshot by id voor exec_allowed. | **Refresh vóór elke evaluation**; leest daarna alleen state. |
| **ingest_runner** | Maakt epochs, update status, koppelt snapshot. | Schrijft snapshots. | Zelfde refresh + state-read. |
| **route_selector** | Niet direct. | Niet direct. | Alleen `analyze_run_from_state` → run_symbol_state. |
| **strategy_pipeline** | Niet direct. | Ontvangt allowed_execution_symbols. | Readiness en dataset uit state; l3 uit `l3_symbol_stats_for_run_from_state`. |
| **execution** | Indirect via live_runner. | — | positions, execution_orders, fills. |

### Stale-risico (voor fix)

- Ingest → raw. State refresh → alleen bij refresh_due (voorheen). Route leest state; readiness **las raw** (analyze_run). Pipeline **las raw** (readiness + l3_symbol_stats_for_run). Twee waarheden. Na fix: één refresh per cycle, één state, één readiness-from-state, één pipeline op die state.

---

## DEEL B — Hot / Warm / Cold + Decision-hot / Context-hot

| Tabel / dataflow | Decision-hot | Context-hot | Warm | Cold | Live read | Live write | Direct execution use | Retention | Freshness-eis |
|------------------|--------------|-------------|------|------|-----------|------------|----------------------|-----------|---------------|
| run_symbol_state | Ja (na refresh) | — | — | — | Ja | Alleen via refresh | Ja | Run-bound | updated_at = refresh in cycle |
| observation_runs | — | — | — | Metadata | Ja | Ja | Nee | Lang | — |
| ingest_lineage | — | — | — | Metadata | Ja | Ja | Nee | Lang | — |
| ingest_epochs | Ja (bind) | — | — | Metadata | Ja | Ingest | Nee (alleen bind) | Lang | completed_at binnen max_epoch_age_secs |
| execution_universe_snapshots | Ja (by id) | — | — | — | Ja | Ingest | Ja (exec set) | Lang | Gebonden in cycle |
| positions | Ja (exit) | — | — | — | Ja | Execution | Ja | Lang | — |
| symbol_safety_state | Ja (hard_blocked) | — | — | — | Ja | WS/safety | Ja (filter) | Lang | — |
| execution_orders | Ja (exit/context) | — | — | — | Ja | Execution | Ja | Lang | — |
| execution_order_events | — | — | Warm | — | Ja | Execution | Nee | Lang | — |
| fills | — | — | Warm | — | Ja | Execution | Nee (ledger) | Lang | — |
| realized_pnl | — | — | Warm | — | Ja | Execution | Nee | Lang | — |
| execution_order_latency | — | — | Warm | — | Ja | Execution | Nee | Lang | — |
| pair_summary_24h | — | — | Warm | — | Nee (live path) | Ingest | Nee | Run | — |
| shadow_trades | — | — | Warm | — | Ja | Pipeline | Nee | Lang | — |
| ticker_samples | — | — | — | Cold | Nee (live path) | Ja | Nee | Run | — |
| trade_samples | — | — | — | Cold | Nee | Ja | Nee | Run | — |
| l2_snap_metrics | — | — | — | Cold | Nee | Ja | Nee | Run | — |
| l3_queue_metrics | — | — | — | Cold | Nee | Ja | Nee | Run | — |

Read-only decision layer: run_symbol_state (na refresh), execution_universe_snapshots (by id), symbol_safety_state (read), epoch-queries (read). Write-heavy (nooit direct decisioning): ticker_samples, trade_samples, l2_snap_metrics, l3_queue_metrics; execution_orders/fills/events append.

---

## DEEL C — Read/Write boundary

- **Live code mag niet** uit write-heavy/raw tabellen lezen voor decisioning. Toegestaan: run_symbol_state, execution_universe_snapshots by id, symbol_safety_state, epoch-queries, positions/execution_orders voor exit/exposure.
- **Derivation:** refresh_run_symbol_state maakt van raw → decision-eligible state. Na refresh: alle decision reads uit state + gebonden snapshot.

---

## DEEL D — Freshness contract

### Per bron (seconden)

| Bron | Max age decision | Max age context | Stale | Execution-eligible cutoff |
|------|------------------|-----------------|-------|---------------------------|
| State (run_symbol_state) | Alleen uit refresh in deze cycle | — | Buiten cycle | Nee buiten cycle |
| Epoch completed_at | max_epoch_age_secs (config) | — | Buiten window | Nee |
| Snapshot | Gebonden in cycle | — | — | Alleen gebonden snapshot |
| Last message (ticker/trade) | LIVE_DATA_MAX_AGE_SECS (60) | — | > 60s | Nee als stale |
| L3-derived | Via state | — | Via state age | Via state |
| L2-derived | Via state | — | Via state age | Via state |
| Safety state | Real-time read | — | — | — |

### Per route-type (route-specifieke freshness)

| Route-type | Decision-hot bronnen | Max state/message age | Context-only | Execution blocked |
|------------|----------------------|------------------------|--------------|--------------------|
| BreakoutContinuation | State, L2/L3, message | 60s message; state = cycle | > 60s message | Stale state/message |
| PullbackContinuation | State, L2/L3, message | 60s message; state = cycle | > 60s message | Stale state/message |
| PumpFadeExhaustion | State, L2/L3, message | 60s message; state = cycle | > 60s message | Stale state/message |
| PassiveSpreadCapture | State, L2/L3, message | 60s message; state = cycle | > 60s message | Stale state/message |
| Maker unwind / mean-reversion | State, L2, message | 60s message; state = cycle | > 60s message | Stale state/message |

Globale limiet 60s (LIVE_DATA_MAX_AGE_SECS); per route kunnen strengere limieten worden toegevoegd (const in code).

---

## DEEL E — Forensische stale-risk (voor fix)

| # | File | Functie | Bron | Freshness-check | Kritiek |
|---|------|---------|------|-----------------|---------|
| 1 | strategy_readiness_report.rs | run_readiness_analysis_for_run | analyze_run (raw) | Geen state-age | Kritiek |
| 2 | strategy_pipeline.rs | run_strategy_pipeline_v2 | readiness (raw), l3_symbol_stats_for_run (raw) | Geen | Kritiek |
| 3 | live_runner.rs | evaluation-loop | refresh alleen bij refresh_due | State kon oud zijn | Middel |
| 4 | — | eligibility | Geen state_updated_at in gate | — | Middel |

Na implementatie: readiness from state, pipeline from state, refresh vóór elke evaluation, state_updated_at in eligibility en logging.

---

## DEEL G — Schaalmodel 50 / 200 / 500 L3-markten

| Laag | Groeit mee (50→500) | Opmerking |
|------|---------------------|-----------|
| Decision-hot | State rows ~symbols; snapshot size ~symbols | Schaalbaar |
| Context-hot | Idem | — |
| Warm | pair_summary_24h, shadow_trades, latency rows | Beperkt door retention |
| Cold | Raw rows (ticker, trade, l2, l3) | Eventvolume; geen decision read |

Querypaden: decision path mag niet met raw rows meegroeien; refreshkosten mogen met symbol count groeien; refresh mag niet met raw eventvolume in dezelfde transactie blokkeren. Eerste risico: refresh duur (do_refresh CTE op 4 raw tables) bij zeer hoge raw volume; tweede: l3_queue_metrics write load. Conclusie: logische scheiding haalbaar tot 500 L3; bij contention fysieke scheiding onderzoeken.

---

## DEEL H — Logische vs fysieke scheiding

- **Model A (logisch, één PG):** Write-heavy raw + read-only decision state + warm + cold in één instance. Winst: eenvoud, geen replica-lag. Risico: contention op zware refresh. Voldoende zolang refresh en decision reads niet geblokkeerd worden door write load.
- **Model B (fysiek):** Aparte ingest DB, runtime decision DB. Winst: isolation. Risico: sync/replica-lag, operatie. Niet direct noodzakelijk voor stale-edge; wel optie bij bewezen contention.

**Aanbeveling:** Start met logische scheiding; alle live decision reads uit state + snapshot; refresh vóór elke evaluation. Fysieke scheiding alleen indien metingen (lock wait, refresh duration) dat rechtvaardigen.

---

## DEEL I — Uitvoeringsregel

### Direct noodzakelijk (uitgevoerd)

- **State-first readiness:** `run_readiness_analysis_for_run_from_state` in `strategy_readiness_report.rs`; live_runner gebruikt alleen deze voor readiness (geen raw `analyze_run` in live path).
- **State-first pipeline:** `l3_symbol_stats_for_run_from_state` in `strategy_pipeline.rs`; pipeline leest alleen state.
- **Refresh vóór elke evaluation:** In beide evaluation-loops in `live_runner.rs`: `refresh_run_symbol_state(bound_run_id)` / `refresh_run_symbol_state(run_id)` vóór readiness; bij refresh-fout wordt de evaluation overgeslagen.
- **run_symbol_state updated_at-contract:** `state_updated_at(pool, run_id)` in `db/run_symbol_state.rs`; data_stale in from_state = (now - state_updated_at) > 60s.
- **Route-specifieke freshness:** `RouteFreshnessLimit` en `LIVE_DATA_MAX_AGE_SECS` in `execution/decision_eligibility.rs`; globale 60s; per-route aanscherping mogelijk via default impl.
- **DecisionEligibility struct:** `execution/decision_eligibility.rs`; gevuld in live_runner na readiness; doorgegeven aan logging.
- **Logging:** `DATA_FRESHNESS_EVALUATED` (run_id, evaluation_index, state_updated_at, state_age_secs, data_stale, execution_eligible) en `ROUTE_EXECUTION_BLOCKED_STALE_DATA` (bij data_stale && !execution_eligible) in beide evaluation-loops.

### Uitgevoerd (vervolg — freshness/safety/500 L3)

| Item | Uitvoering |
|------|------------|
| **Route-specifieke seconden per route-type** | `route_freshness_limit(RouteType)` in `decision_eligibility.rs`: Breakout/PumpFade/DumpReversal 30s, Pullback/PassiveSpread 45s. `apply_route_freshness_filter` filtert `exec_allowed` op route-limiet. |
| **ROUTE_FRESHNESS_* per symbol/route** | Per evaluation: `ROUTE_FRESHNESS_OK` / `ROUTE_FRESHNESS_STALE` / `ROUTE_FRESHNESS_CONTEXT` en `ROUTE_EXECUTION_BLOCKED_STALE_DATA` per (symbol, route_type, horizon) in `apply_route_freshness_filter`. |
| **Fysieke DB-scheiding** | **Beoordeling:** Logische scheiding alleen is *niet* voldoende voor 500 L3. **Uitgevoerd:** `DbPools`, `DECISION_DATABASE_URL`, `create_pools`, refresh op ingest, `sync_run_symbol_state_to_decision`, epoch/snapshot dual-write, live path leest alleen decision. **Definitie:** Fysieke scheiding = **tweede PostgreSQL-cluster/instance** (eigen poort, datadir); twee DBs/schemas/pools op dezelfde instance tellen niet. Zie [DUAL_DB_SECOND_INSTANCE_PLAN.md](DUAL_DB_SECOND_INSTANCE_PLAN.md). |
| **Partitioning raw (500 L3)** | **Cutover uitgevoerd.** `20260313120000`: L3 partitioned tabel. `20260313130000`: L3 cutover (rename). `20260313140000`: ticker_samples, trade_samples, l2_snap_metrics partitioned + cutover. App gebruikt nu overal de gepartitioneerde tabellen onder de oorspronkelijke namen; retention blijft DELETE WHERE run_id. |
| **Refresh generation contract** | `20260313150000`: sequence + `generation_id` op `run_symbol_state`. Elke refresh krijgt één generation_id; sync kopieert die naar decision. Live: `INGEST_DECISION_SYNC_VISIBLE` log; execution gate: alleen als `state_generation_id(decision)` = cycle generation_id, anders `EXECUTION_BLOCKED_GENERATION_MISMATCH` en exec_allowed geleegd. |
| **Refresh-complexiteit** | **Bewijs:** refresh is O(rows) (CTE scant alle rijen per run_id). Zie `docs/REFRESH_COMPLEXITY_AND_GENERATION.md`. Meet duration_ms; bij groei incrementeel/watermark overwegen. |

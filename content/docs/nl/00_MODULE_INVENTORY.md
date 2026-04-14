# 00 — Module-inventaris

[← Index](./DOC_INDEX.md) | **00 — Module-inventaris** | [01 — Architectuur](./01_ARCHITECTURE.md) →

---

Technisch overzicht van alle Rust-modules onder `src/`. Per module: **primair** (hoofddoel), **secundair** (ondersteunend / randvoorwaarden), **runtime** (wanneer actief / gates).

## Navigatiemenu

- [Root (`src/`)](#root-src)
- [`alerts/`](#alerts)
- [`analysis/`](#analysis)
- [`app/`](#app)
- [`cli/`](#cli)
- [`config/`](#config)
- [`core/`](#core)
- [`db/`](#db)
- [`domain/`](#domain)
- [`edge/`](#edge)
- [`edgeboard/`](#edgeboard)
- [`edge_engine/`](#edge_engine)
- [`exchange/`](#exchange)
- [`execution/`](#execution)
- [`export/`](#export)
- [`fees/`](#fees)
- [`health/`](#health)
- [`ignition/`](#ignition)
- [`l3/`](#l3)
- [`logging/`](#logging)
- [`market/`](#market)
- [`observability/`](#observability)
- [`observe/`](#observe)
- [`pipeline/`](#pipeline)
- [`probe/`](#probe)
- [`redis/`](#redis)
- [`risk/`](#risk)
- [`route_engine/`](#route_engine)
- [`route_state/`](#route_state)
- [`selection/`](#selection)
- [`state/`](#state)
- [`trading/`](#trading)
- [`universe/`](#universe)

---

## Globaal

- Er is **geen** Cargo `[features]`-splitsing: alles compileert in één binary.
- **Runtime-gating** gebeurt via CLI-subcommands, procesmodus (observe / ingest / execution) en **environment-variabelen** (o.a. `EDGE_ENGINE_V2`, `IGNITION_ENABLED`, `ENABLE_VWAP_LIVE_FEED`, `ENABLE_ROUTE_STATE_STORE`, `ENABLE_RANKING_TOD`, `ENABLE_PER_FAMILY_EDGE_LIFETIME`, `RESEARCH_DATABASE_URL`, Pushover, Redis voor MSP, enz.).

---

<a name="root-src"></a>
## Root (`src/`)

### `main.rs`
- **Primair:** Binary entry: configuratie laden, logging, DB-pools, CLI-dispatch, kiezen tussen observe- en execution-pad.
- **Secundair:** Globale bootstrap en foutafhandeling vóór de hoofdloop van het gekozen mode.
- **Runtime:** Altijd actief bij processtart.

### `git_info.rs`
- **Primair:** Leest git-commit, branch en dirty-flag voor traceerbaarheid in logs en snapshots.
- **Secundair:** Ondersteunt deploy- en incident-onderzoek zonder handmatige versie-invoer.
- **Runtime:** Startup.

### `execution_runtime_verify.rs`
- **Primair:** Zet execution-runtime markers en voert self-verify uit (worker/binary proof).
- **Secundair:** Koppelt runtime aan verwachte execution-modus voor audits en scripts.
- **Runtime:** Execution modes.

---

<a name="alerts"></a>
## `alerts/`

### `pushover.rs`
- **Primair:** Verstuurt notificaties via de Pushover HTTP API wanneer geconfigureerd.
- **Secundair:** Isolatie van alerting van de trading-hot path.
- **Runtime:** Env-gated: o.a. `pushover_enable` en credentials.

---

<a name="analysis"></a>
## `analysis/`

### `mod.rs`
- **Primair:** Bundelt analyse-hulpfuncties en partial-dataset loading voor de strategy pipeline.
- **Secundair:** Herexporteert submodulegrenzen voor overzichtelijke imports.
- **Runtime:** Runtime + CLI (afhankelijk van aanroep).

### `adverse_selection.rs`
- **Primair:** Post-trade signaal dat fills classificeert als relatief gunstig of “toxic” t.o.v. verwachting.
- **Secundair:** Voedt feedback- en rapportagelagen; geen directe order-submit.
- **Runtime:** Runtime.

### `capturable_move.rs`
- **Primair:** Schat welk deel van de verwachte prijsbeweging praktisch vangbaar is (timing, queue, microprice).
- **Secundair:** Input voor readiness en route-economie.
- **Runtime:** Runtime.

### `cost_breakdown.rs`
- **Primair:** Legt kosten en resterende “surplus” expliciet vast, inclusief strategy-aware spread-behandeling.
- **Secundair:** Maakt vergelijking tussen strategieën eerlijk qua kostencomponenten.
- **Runtime:** Runtime.

### `current_run_analysis.rs`
- **Primair:** Berekent per-run metrics, edge/pair-scores en lijsten met kandidaten en uitsluitingen.
- **Secundair:** Ondersteunt CLI-rapporten en live evaluatie-snapshots.
- **Runtime:** Runtime + CLI.

### `directional_forward_signal.rs`
- **Primair:** Levert activation-metadata voor forward-return observability en persistentie.
- **Secundair:** Koppelt live signalen aan research-side observability zonder decision-DB als SSOT te misbruiken.
- **Runtime:** Gated: o.a. `RESEARCH_DATABASE_URL` / forward-returns configuratie.

### `doctrine_alignment_report.rs`
- **Primair:** Implementeert CLI `report-trading-doctrine-alignment`.
- **Secundair:** Vergelijkt gedrag met vastgelegde trading-doctrine.
- **Runtime:** CLI.

### `drift.rs`
- **Primair:** Berekent getekende drift en versnelling uit `price_cache` voor multi-horizon momentum.
- **Secundair:** Feature-input voor route-engines en filters.
- **Runtime:** Runtime.

### `edge_distribution.rs`
- **Primair:** Analyseert de verdeling van edge-scores over een run.
- **Secundair:** Diagnostiek voor model- en universe-skew.
- **Runtime:** CLI.

### `edge_score.rs`
- **Primair:** Microstructure edge-score (spread, microprice, density, refill).
- **Secundair:** Combineert meerdere microstructure-signalen tot één rankbare maat.
- **Runtime:** Runtime.

### `exit_feasibility.rs`
- **Primair:** Beoordeelt of een realistische exit haalbaar is (slippage, spread, exit-drag) vóór entry.
- **Secundair:** Voorkomt entries in illiquide of te dure exit-paden.
- **Runtime:** Runtime.

### `expected_move.rs`
- **Primair:** Strategy-aware model voor verwachte prijsbeweging (maker vs momentum context).
- **Secundair:** Voedt edge- en sizing-achtige redeneringen.
- **Runtime:** Runtime.

### `expansion_classifier.rs`
- **Primair:** Labelt expansion-regime (Phase 1 shadow; geen execution-wijziging door dit label alleen).
- **Secundair:** Data voor CDV/shadow en latere calibratie.
- **Runtime:** Runtime.

### `fill_probability.rs`
- **Primair:** Schat fill-kans via L3, hybride paden of fallback.
- **Secundair:** Maakt maker/taker-economie en queue-wachttijd explicieter.
- **Runtime:** Runtime.

### `friction_attribution.rs`
- **Primair:** Legt na een trade vast waarom realized surplus afwijkt van verwacht (wrijving).
- **Secundair:** Feedback-loop voor parameters en gates.
- **Runtime:** Runtime.

### `latency_breakdown.rs`
- **Primair:** Decompositie van latency decision → submit → ack → fill.
- **Secundair:** Operationele diagnose en SLA-achtige rapportage.
- **Runtime:** Runtime.

### `latency_heatmap.rs`
- **Primair:** Bouwt histogrammen over `execution_order_latency` voor recente orders.
- **Secundair:** CLI-rapport voor tail-latency en buckets.
- **Runtime:** CLI.

### `l3_diagnostics.rs`
- **Primair:** Diagnostiek op L3-tabellen, coverage en writers.
- **Secundair:** Ondersteuning bij ingest- en capacity-problemen.
- **Runtime:** CLI.

### `l3_quality.rs`
- **Primair:** Per-symbol L3-kwaliteitsscore gedeeld door readiness en route-features.
- **Secundair:** Eén gezamenlijke definitie van “L3 betrouwbaar genoeg”.
- **Runtime:** Runtime.

### `margin_paper_resolver.rs`
- **Primair:** TP/SL first-touch resolver op `trade_samples` voor the paper margin-lane.
- **Secundair:** Offline/paper PnL zonder live exchange-exits.
- **Runtime:** Runtime (paper pad).

### `model_distribution.rs`
- **Primair:** Statistieken over strategie-verdeling uit readiness-rapporten.
- **Secundair:** Helpt bias in strategie-selectie te zien.
- **Runtime:** CLI.

### `pair_classifier.rs`
- **Primair:** Pair-taxonomie en onderbouwing welk edge-model past.
- **Secundair:** Verklaart waarom pairs anders behandeld worden.
- **Runtime:** Runtime.

### `partial_dataset.rs`
- **Primair:** Laadt pair-statistieken en bouwt edge-inputs voor de pipeline zonder volledige 24h dataset.
- **Secundair:** Snellere iteratie en CLI-analyse.
- **Runtime:** Runtime.

### `realized_surplus.rs`
- **Primair:** Houdt expected vs realized surplus bij na trades.
- **Secundair:** Sluit aan op friction- en performance-tracking.
- **Runtime:** Runtime.

### `realized_vol.rs`
- **Primair:** Realized volatility uit 1m candles (diagnostisch).
- **Secundair:** Input voor rapporten en sanity checks.
- **Runtime:** CLI.

### `realized_vol_diagnostic.rs`
- **Primair:** What-if: vervangt vol-input in V1 route-analyse voor vergelijking.
- **Secundair:** Geen invloed op live orders; puur rapportage.
- **Runtime:** CLI.

### `regime_detection.rs`
- **Primair:** Classificeert markt in o.a. TREND/RANGE/CHAOS op basis van mid, spread, density.
- **Secundair:** Stuurt strategy- en route-keuzes indirect aan.
- **Runtime:** Runtime.

### `safety_invariants_audit.rs`
- **Primair:** Harde invariant audit (A/B) met DB- en journal-bewijs.
- **Secundair:** Bedoeld voor compliance-achtige “bewijsdrager” checks.
- **Runtime:** CLI.

### `safety_invariants_v2.rs`
- **Primair:** V2-classificatie van invarianten (breach/prevented/uncertain) uit funneldata.
- **Secundair:** Rijkt safety-reporting uit ten opzichte van V1.
- **Runtime:** CLI.

### `safety_report.rs`
- **Primair:** Samenvatting safety-integriteit (o.a. WS safety, latency health).
- **Secundair:** Eén entrypoint voor operators.
- **Runtime:** CLI.

### `shadow_evaluator.rs`
- **Primair:** Hypothetische trades voor geblokkeerde entries; shadow markouts en dual-pool logica waar van toepassing.
- **Secundair:** Voedt edgeboard refresh en training zonder live risk.
- **Runtime:** Runtime.

### `slippage_estimator.rs`
- **Primair:** Data-gedreven slippageschatting per pair.
- **Secundair:** Verbetering van cost- en exit-feasibility modellen.
- **Runtime:** Runtime.

### `strategy_readiness_report.rs`
- **Primair:** Readiness-gate: kosten, capturable move, exit feasibility, dominante blockers.
- **Secundair:** Centrale “mag deze strategie op dit pair” samenvatting.
- **Runtime:** Runtime.

### `tod_multiplier.rs`
- **Primair:** Time-of-day tradability multiplier voor ranking (multi-regio sessies).
- **Secundair:** Vermindert traden in statistisch zwakke uren zonder hardcoded één tijdzone.
- **Runtime:** Env-gated: o.a. `ENABLE_RANKING_TOD`.

### `trading_throughput_report.rs`
- **Primair:** Rapport over doorvoer / activiteit van trading.
- **Secundair:** Capaciteits- en frequentie-inzicht.
- **Runtime:** CLI.

### `vwap_window.rs`
- **Primair:** Rolling VWAP uit trades voor reversion-thesis.
- **Secundair:** Koppelt aan VWAP-buffer en route/move-thesis waar geconfigureerd.
- **Runtime:** Runtime.

---

<a name="app"></a>
## `app/`

### `runtime.rs`
- **Primair:** Tokio-runtime setup en nette shutdown.
- **Secundair:** Eén plek voor worker-threads en runtime policy.
- **Runtime:** Runtime.

---

<a name="cli"></a>
## `cli/`

### `analysis_commands.rs`
- **Primair:** Dispatcht analyse- en report-CLI modes die geen probes zijn.
- **Secundair:** Houdt `commands.rs` overzichtelijk.
- **Runtime:** CLI.

### `commands.rs`
- **Primair:** Hoofd-CLI-router: retention, probes, parquet-export, execution-subcommands, enz.
- **Secundair:** Centrale mapping argv → async handlers.
- **Runtime:** CLI.

### `edge_reports.rs`
- **Primair:** Gedeelde helpers voor edge- en regime-rapporten.
- **Secundair:** Voorkomt duplicatie tussen analysis commands.
- **Runtime:** CLI.

### `execution_readiness.rs`
- **Primair:** `check-execution-readiness`: bewijst dual-DB binding en basiscondities zonder te traden.
- **Secundair:** Pre-flight voor deploy en CI-achtige checks.
- **Runtime:** CLI.

---

<a name="config"></a>
## `config/`

### `mod.rs`
- **Primair:** Laadt environment-driven configuratie (dual DB verplicht, universe caps, toggles).
- **Secundair:** Normaliseert defaults en validatie-errors naar één type.
- **Runtime:** Altijd actief.

---

<a name="core"></a>
## `core/`

### `clock.rs`
- **Primair:** Abstracte tijdsbron (trait) voor testbaarheid.
- **Secundair:** Voorkomt directe `SystemTime`-spaghetti in kernlogica.
- **Runtime:** Types / infrastructureel.

### `engine.rs`
- **Primair:** `Runnable`-achtige componenttrait voor modulaire engine-delen.
- **Secundair:** Documenteert lifecycle-contract op hoog niveau.
- **Runtime:** Types.

### `event_bus.rs`
- **Primair:** Event-envelop en bus-trait voor interne messaging-concepten.
- **Secundair:** Uitbreidbaarheid zonder directe coupling.
- **Runtime:** Types.

### `state.rs`
- **Primair:** State snapshot trait/types voor engine snapshots.
- **Secundair:** Consistente terminologie voor “wat is de huidige wereldtoestand”.
- **Runtime:** Types.

---

<a name="db"></a>
## `db/`

### `mod.rs`
- **Primair:** Pool factory, migratie-hooks, schema-constanten.
- **Secundair:** SSOT voor “hoe verbinden we met ingest/decision/research”.
- **Runtime:** Runtime.

### `candidate_decision_vectors.rs`
- **Primair:** Persisteert CDV en rijke decision-traces naar Postgres.
- **Secundair:** Optioneel gedrag via env/OnceLock voor experimenten zonder schema-explosie.
- **Runtime:** Runtime (evaluatiepad).

### `cli_db_target.rs`
- **Primair:** Dwingt af welke DB-pool welk CLI-commando mag gebruiken.
- **Secundair:** Voorkomt cross-pool verkeerde conclusies bij diagnose.
- **Runtime:** Runtime + CLI safety.

### `connection_identity.rs`
- **Primair:** Parse DB-URLs en logt veilige identity (host/db/port) na connect.
- **Secundair:** Bewijs voor “welke pool is dit” in logs.
- **Runtime:** Startup.

### `consistency_recovery.rs`
- **Primair:** Insert-paden voor consistency watchdog recovery op decision DB.
- **Secundair:** Herstelacties los van normale trading flow.
- **Runtime:** Runtime.

### `data_quality_snapshot.rs`
- **Primair:** Schrijft rolling data-quality metrics snapshots.
- **Secundair:** Observability voor ingest/kwaliteit degradering.
- **Runtime:** Runtime.

### `edge_bias_entry_capture.rs`
- **Primair:** Entry-time bias snapshot; achtergrond job vult mid-at-horizon aan.
- **Secundair:** Post-hoc calibratie van edge vs uitkomst.
- **Runtime:** Runtime.

### `edge_detection.rs`
- **Primair:** Counters/queries rond “positive mandate vs zero orders” mismatches en edge-kandidaten.
- **Secundair:** Detectie van stille failures in execution funnel.
- **Runtime:** Runtime / observability.

### `exchange_balances.rs`
- **Primair:** Persistente helpers voor exchange balance snapshots.
- **Secundair:** Reconcile en audits tegen WS-cache.
- **Runtime:** Runtime.

### `execution_eval_cycle_funnel.rs`
- **Primair:** Per-evaluatie funnel rijen op decision DB.
- **Secundair:** Granulaire forensics waarom een cycle skip/allow gaf.
- **Runtime:** Runtime.

### `execution_orders.rs`
- **Primair:** Insert/update/query van orderrijen o.a. op `cl_ord_id`.
- **Secundair:** SSOT-laag tussen adapter en `execution_orders` tabel.
- **Runtime:** Runtime.

### `exposure_nav_snapshot.rs`
- **Primair:** Periodieke exposure/NAV snapshot persistence.
- **Secundair:** Dashboarding en risk reporting.
- **Runtime:** Runtime.

### `fills.rs`
- **Primair:** Fill insert helpers en gerelateerde DB-operaties.
- **Secundair:** Afgestemd op idempotente fill processing.
- **Runtime:** Runtime.

### `ingest_epoch.rs`
- **Primair:** Ingest lineage en epoch create/update voor universe snapshots.
- **Secundair:** Koppelt observe/ingest runs aan reproduceerbare epoch-id’s.
- **Runtime:** Runtime.

### `margin_paper_trades.rs`
- **Primair:** Paper margin-short trades op decision DB.
- **Secundair:** Scheiding van live spot SSOT.
- **Runtime:** Runtime (paper lane).

### `market_forecast_15m_snapshots.rs`
- **Primair:** Batch upsert van 15m forecast snapshots.
- **Secundair:** Voedt route/forecast lagen.
- **Runtime:** Runtime.

### `market_state_projection.rs`
- **Primair:** Typed CRUD voor `market_state_projection` rijen.
- **Secundair:** Alignement tussen Redis-projectie en DB.
- **Runtime:** Runtime.

### `models.rs`
- **Primair:** Row structs die SQL-schema spiegelen.
- **Secundair:** sqlx/query compile-time typing.
- **Runtime:** Types (gebruikt overal).

### `order_events.rs`
- **Primair:** Persistente execution order events.
- **Secundair:** Audit trail naast ruwe WS logs.
- **Runtime:** Runtime.

### `order_latency.rs`
- **Primair:** Persistente T0..T3 latency per order.
- **Secundair:** KPI’s en incident-analyse.
- **Runtime:** Runtime.

### `positions.rs`
- **Primair:** Upsert/repair helpers voor `krakenbot.positions` op basis van fills en truth-branches.
- **Secundair:** Interne bot-“trade inventory” laag (niet exchange SSOT).
- **Runtime:** Runtime.

### `raw_private_executions.rs`
- **Primair:** Logt ruwe private WS execution payloads naar Postgres.
- **Secundair:** Post-mortem en reconcile bij parser gaps.
- **Runtime:** Runtime.

### `realized_pnl.rs`
- **Primair:** Realized PnL rijen wanneer posities flat gaan.
- **Secundair:** Performance- en risk-rapportage.
- **Runtime:** Runtime.

### `retention.rs`
- **Primair:** Chunked purge van raw/ingest/diagnostic tabellen (niet execution SSOT).
- **Secundair:** Voorkomt onbeperkte DB-groei.
- **Runtime:** CLI / maintenance.

### `role.rs`
- **Primair:** Enum van logische pool rollen (ingest/decision/research).
- **Secundair:** Type-safe routing in applicatielaag.
- **Runtime:** Types.

### `run_symbol_state.rs`
- **Primair:** Incrementele refresh en hot-path reads voor pipeline state per symbool/run.
- **Secundair:** Scheiding ingest-writes vs decision-reads waar van toepassing.
- **Runtime:** Runtime.

### `symbol_exit_lease.rs`
- **Primair:** Per-symbol exit lease (wie mag exit aansturen).
- **Secundair:** Voorkomt race tussen modules (CSS / monitor / manual).
- **Runtime:** Runtime.

### `symbol_safety_state.rs`
- **Primair:** Per-symbol safety state voor WS-native hardening.
- **Secundair:** Gate tussen datakwaliteit en order submit.
- **Runtime:** Runtime.

### `trading_funnel_events.rs`
- **Primair:** Gestructuraliseerde funnel events voor gate/decision tracing.
- **Secundair:** JSON/query vriendelijke forensics.
- **Runtime:** Runtime.

### `writer.rs`
- **Primair:** Async gebatcherde ingest writer queue naar Postgres.
- **Secundair:** Backpressure en lag-beperking voor hot ingest path.
- **Runtime:** Runtime (observe/ingest).

### `db/read/consistency_queries.rs`
- **Primair:** Epoch fingerprints en funnel-activiteit over pools heen.
- **Secundair:** Input voor watchdog en split-brain detectie.
- **Runtime:** Runtime.

### `db/read/epoch_queries.rs`
- **Primair:** Leest epochs en execution-universe snapshots.
- **Secundair:** Universe manager en live runner voeden.
- **Runtime:** Runtime.

### `db/read/observability_queries.rs`
- **Primair:** Read-only queries voor observability JSON export.
- **Secundair:** Website BFF / export tooling.
- **Runtime:** CLI.

### `db/read/observation_queries.rs`
- **Primair:** Queries op observation runs en `run_id`.
- **Secundair:** CLI + runtime helpers.
- **Runtime:** Runtime + CLI.

### `db/read/pair_queries.rs`
- **Primair:** Pair summary en ranking reads.
- **Secundair:** Pipeline en rapporten.
- **Runtime:** Runtime + CLI.

### `db/read/stats_queries.rs`
- **Primair:** Run-level counts en per-symbol statistieken.
- **Secundair:** Dashboards en sanity checks.
- **Runtime:** Runtime + CLI.

### `db/read/tape_queries.rs`
- **Primair:** Rolling trade-count windows uit `trade_samples`.
- **Secundair:** Activiteit en liquiditeitsproxy.
- **Runtime:** Runtime.

### `db/read/universe_queries.rs`
- **Primair:** Sample counts en pinning voor universe manager.
- **Secundair:** “Waarom zit symbool X in universe” uitleg.
- **Runtime:** Runtime.

---

<a name="domain"></a>
## `domain/`

*(Pure domain types — geen exchange I/O in deze module.)*

### `capital_state.rs`
- **Primair:** Model voor equity en inzetbaar kapitaal.
- **Secundair:** Brug tussen risk en allocator concepten.
- **Runtime:** Types.

### `execution_decision.rs`
- **Primair:** Execute vs skip beslissing op domainniveau.
- **Secundair:** Verklaarbare enum i.p.v. losse booleans.
- **Runtime:** Types.

### `inventory_state.rs`
- **Primair:** Base/quote inventory view.
- **Secundair:** Normalisatie van “wat bezitten we” in domeintermen.
- **Runtime:** Types.

### `market_snapshot.rs`
- **Primair:** Bid/ask/last snapshot struct.
- **Secundair:** Input voor strategies zonder volledige orderbook.
- **Runtime:** Types.

### `order_intent.rs`
- **Primair:** Maker vs taker intent concepten.
- **Secundair:** Richting execution planner zonder wire-format.
- **Runtime:** Types.

### `order_plan.rs`
- **Primair:** Bedoelde orderbeschrijving vóór exchange mapping.
- **Secundair:** Testbare tussenlaag.
- **Runtime:** Types.

### `position_state.rs`
- **Primair:** Position state struct in domain zin.
- **Secundair:** Niet hetzelfde als DB `positions` row — abstract model.
- **Runtime:** Types.

### `quote_currency.rs`
- **Primair:** Quote currency contract (USD-only observability).
- **Secundair:** Voorkomt impliciete multi-quote chaos.
- **Runtime:** Types.

### `risk_decision.rs`
- **Primair:** Allow/block risk beslissing.
- **Secundair:** Uniforme output van risk checks.
- **Runtime:** Types.

### `side.rs`
- **Primair:** Buy/sell side type.
- **Secundair:** Voorkomt stringly-typed sides op domeingrens.
- **Runtime:** Types.

### `symbol.rs`
- **Primair:** Normalisatie van symbolen (o.a. BTC vs XBT conventies).
- **Secundair:** Consistente keys in maps en DB joins.
- **Runtime:** Types.

---

<a name="edge"></a>
## `edge/`

*(Edge domain traits en types — scoring infrastructure.)*

### `edge_model.rs` — trait voor edge estimate  
### `expected_edge.rs` — placeholder expected edge (move × vol)  
### `fee_model.rs` — maker/taker fee types  
### `metrics.rs` — inputs voor edge metrics  
### `probability.rs` — probability types  
### `reversion_probability.rs` — mean-reversion probability placeholder  
### `score_model.rs` — metrics → suitability score mapping  
### `scoring.rs` — scoring trait en score types  
### `slippage_model.rs` — expected slippage (bps) types  

- **Primair (gezamenlijk):** Definieert het “edge calculus” vocabulary zonder Kraken wire details.
- **Secundair:** Maakt unit tests en alternatieve modellen mogelijk zonder execution coupling.
- **Runtime:** Types.

---

<a name="edgeboard"></a>
## `edgeboard/`

### `mod.rs`
- **Primair:** RESEARCH-only deterministische ranking laag voor edgeboard.
- **Secundair:** Documenteert grenzen: geen allocator in deze crate-module.
- **Runtime:** Runtime.

### `buckets.rs`
- **Primair:** Deterministische bucket indices voor historische matching.
- **Secundair:** Stabiele hashing voor reproduceerbare reports.
- **Runtime:** Runtime.

### `cache.rs`
- **Primair:** In-process replica van laatste edgeboard snapshot (optioneel fast path).
- **Secundair:** Vermindert DB round-trips bij lezen.
- **Runtime:** Env-gated: o.a. `EDGEBOARD_CACHE_READ_ENABLE`.

### `cache_metrics.rs`
- **Primair:** Telt cache read policy events.
- **Secundair:** Observability voor cache hit/miss gedrag.
- **Runtime:** Runtime.

### `constants.rs`
- **Primair:** Constanten en batch sizes voor RESEARCH edgeboard jobs.
- **Secundair:** Eén plek voor tuning parameters.
- **Runtime:** Runtime.

### `coverage.rs`
- **Primair:** Feature coverage uit hot columns + JSON quality velden.
- **Secundair:** Detecteert incomplete training snapshots.
- **Runtime:** Runtime.

### `live_blend.rs`
- **Primair:** Laadt boosts en resolved live velden vanuit RESEARCH snapshots.
- **Secundair:** Vermengt live en research velden volgens contract.
- **Runtime:** Runtime.

### `live_signal.rs`
- **Primair:** Gedeelde structs voor live edgeboard velden.
- **Secundair:** Type safety tussen refresh en consumers.
- **Runtime:** Types / load path.

### `match_tiers.rs`
- **Primair:** Historische bucket matching tiers 0–3.
- **Secundair:** Graduele degradeerstrategie bij dataverlies.
- **Runtime:** Runtime.

### `outcomes.rs`
- **Primair:** Post-hoc outcome joins op exact signaal-tijdstip.
- **Secundair:** Training labels en calibration.
- **Runtime:** Runtime.

### `refresh.rs`
- **Primair:** Orchestreert shadow eval + training ingest + snapshot refresh.
- **Secundair:** Periodieke worker flow voor edgeboard dataset.
- **Runtime:** Runtime.

### `route_semantic_scale.rs`
- **Primair:** Semantische schaling wanneer route-historie wordt gepoold.
- **Secundair:** Voorkomt domme gemiddelden over niet-vergelijkbare routes.
- **Runtime:** Runtime.

### `routes.rs`
- **Primair:** Route predicate drempels en thresholds.
- **Secundair:** Centrale tuning voor route families.
- **Runtime:** Runtime.

### `scoring.rs`
- **Primair:** Shrinkage, kosten, net edge, confidence, reason codes.
- **Secundair:** Mens-leesbare uitleg bij scores.
- **Runtime:** Runtime.

### `snapshot_run.rs`
- **Primair:** Enkele transactie edgeboard snapshot op RESEARCH.
- **Secundair:** Atomiciteit van batch writes.
- **Runtime:** Runtime.

### `training_ingest.rs`
- **Primair:** Backfill van training examples en shadow markouts.
- **Secundair:** Bulk jobs en repair flows.
- **Runtime:** Runtime.

---

<a name="edge_engine"></a>
## `edge_engine/`

### `mod.rs`
- **Primair:** Adaptive edge engine V2 orchestratie; default off = passthrough naar V1 pad.
- **Secundair:** Feature gate documentatie voor operators.
- **Runtime:** Env-gated: `EDGE_ENGINE_V2=true`.

### `admissibility.rs`
- **Primair:** Tail-aware admissibility gate voor route kandidaten.
- **Secundair:** Vermindert “lucky tail” trades in adaptieve modus.
- **Runtime:** V2.

### `diagnostics.rs`
- **Primair:** Volledige diagnostic report voor `report-adaptive-edge`.
- **Secundair:** Vergelijkt interne componenten van V2.
- **Runtime:** CLI.

### `exit_path.rs`
- **Primair:** Component-based exit drag en trail simulatie.
- **Secundair:** Realistischere exit economics in V2.
- **Runtime:** V2.

### `fee_realism.rs`
- **Primair:** Probabilistisch fee model.
- **Secundair:** Betere match met werkelijke fee distributie.
- **Runtime:** V2.

### `market_regime.rs`
- **Primair:** Vier-regime classifier uit `MarketFeatures`.
- **Secundair:** Conditioneert adaptieve parameters.
- **Runtime:** V2.

### `move_distribution.rs`
- **Primair:** Move distribution en adaptieve trace output.
- **Secundair:** Legt uit waarom V2 anders scoret dan V1.
- **Runtime:** V2.

### `route_selector_v2.rs`
- **Primair:** `run_adaptive_route_analysis` orchestratie.
- **Secundair:** Hoofd-entry voor V2 selectie pipeline.
- **Runtime:** V2.

### `shadow_compare.rs`
- **Primair:** V1 vs V2 vergelijking op dezelfde run.
- **Secundair:** Veilig A/B zonder live execution switch.
- **Runtime:** CLI.

---

<a name="exchange"></a>
## `exchange/`

### `auth_rest.rs`
- **Primair:** REST: WebSockets token en TradeVolume fee endpoint.
- **Secundair:** Enige toegestane REST voor WS auth pad.
- **Runtime:** Runtime.

### `auth_ws.rs`
- **Primair:** Private WS v2 client; token direct vóór connect.
- **Secundair:** Reconnect policy en request mux hooks.
- **Runtime:** Runtime.

### `balance_cache.rs`
- **Primair:** Globale balances uit private WS `balances` kanaal.
- **Secundair:** Reconcile en protection qty caps.
- **Runtime:** Runtime.

### `balance_feed.rs`
- **Primair:** Optionele dedicated balances subscription task.
- **Secundair:** Alternatief wanneer hub geen balances mux’t.
- **Runtime:** Runtime (optioneel).

### `execution_holdings_cache.rs`
- **Primair:** Holdings schatting uit executions deltas.
- **Secundair:** Secundaire waarheid naast balance cache.
- **Runtime:** Runtime.

### `fees.rs`
- **Primair:** Live fee tier engine uit TradeVolume.
- **Secundair:** Actualiseert maker/taker bps voor economics.
- **Runtime:** Runtime.

### `instruments.rs`
- **Primair:** Instrument cache en order normalisatie (tick/lot/min).
- **Secundair:** SSOT voor pair precisie op wire.
- **Runtime:** Runtime.

### `kraken_private.rs`
- **Primair:** Diverse private API/WS helpers en glue.
- **Secundair:** Gedeelde low-level routines.
- **Runtime:** Runtime.

### `kraken_public.rs`
- **Primair:** Public WS connect, subscribe, reconnect.
- **Secundair:** Fan-out naar ticker/trade/book handlers.
- **Runtime:** Runtime.

### `messages.rs`
- **Primair:** WS v2 message types (ticker, trade, subscribe payloads).
- **Secundair:** Serde modellen voor checksum-kritieke paden waar van toepassing.
- **Runtime:** Types.

### `own_orders_cache.rs`
- **Primair:** Open orders uit executions snapshot + incrementele updates.
- **Secundair:** Wrong-side/orphan detectie en coverage checks.
- **Runtime:** Runtime.

### `price_cache.rs`
- **Primair:** Globale mid/bid/ask/last uit ticker WS; mid-tick subscribers.
- **Secundair:** Tier1 driver en tradability voeden.
- **Runtime:** Runtime.

### `private_ws_hub.rs`
- **Primair:** Enkele gedeelde private WS: executions, balances, trading requests.
- **Secundair:** req_id multiplex en backpressure.
- **Runtime:** Runtime.

### `trade_flow_window.rs`
- **Primair:** Rolling buy/sell notionals voor imbalance.
- **Secundair:** Microstructure en OFI-achtige features.
- **Runtime:** Runtime.

### `universe_source.rs`
- **Primair:** USD spot universe uit instrument cache + denylist.
- **Secundair:** Consistente symbol set voor observe/execution.
- **Runtime:** Runtime.

### `vwap_buffer.rs`
- **Primair:** Live VWAP uit trades; no-op wanneer live feed uit staat.
- **Secundair:** Voedt `vwap_window` / reversion features.
- **Runtime:** Env-gated: `ENABLE_VWAP_LIVE_FEED`.

---

<a name="execution"></a>
## `execution/`

### `choke.rs`
- **Primair:** Centrale ALLOW/SKIP/HALT choke met gestructureerde reason codes.
- **Secundair:** Eén enforcement point voor “mag er gehandeld worden”.
- **Runtime:** Runtime.

### `data_integrity.rs`
- **Primair:** Integrity matrix voor engine gating (data bronnen en freshness).
- **Secundair:** Voorkomt silent trading op stale books.
- **Runtime:** Runtime.

### `decision_eligibility.rs`
- **Primair:** Eligibility audit: welke bronnen, leeftijden, limieten gelden.
- **Secundair:** Logging voor “waarom niet eligible”.
- **Runtime:** Runtime.

### `deterministic_proof.rs`
- **Primair:** State-machine exerciser over DB zonder live exchange.
- **Secundair:** Regression tests en proofs.
- **Runtime:** CLI.

### `directional_forward_obs.rs`
- **Primair:** Re-export shim naar `observability::forward_returns`.
- **Secundair:** Stabiele import path voor execution code.
- **Runtime:** Runtime.

### `dust_msp_sync.rs`
- **Primair:** Sync MSP/projectie wanneer dust posities worden gezeroed.
- **Secundair:** Voorkomt zombie projection state.
- **Runtime:** Runtime.

### `economic_guards.rs`
- **Primair:** Deployed equity cap en loss-trigger exposure throttle.
- **Secundair:** Macro-prudentie boven per-trade gates.
- **Runtime:** Runtime.

### `edge_heap.rs`
- **Primair:** Global flow heap: scoring, merge, wake; per-family edge lifetime hooks.
- **Secundair:** Koppelt pipeline outcomes aan execution opportunities buiten de eval tick.
- **Runtime:** Runtime.

### `engine_mode.rs`
- **Primair:** Normal / exit-only / halt mode enum.
- **Secundair:** Uniforme mode transitions in runner.
- **Runtime:** Runtime.

### `execution_realism.rs`
- **Primair:** Freshness en market-age checks vóór “realistic” execution.
- **Secundair:** Voorkomt orders op ancient mids.
- **Runtime:** Runtime.

### `exit.rs`
- **Primair:** Market exit submit pad (bouwt `ExecutionIntent`).
- **Secundair:** Gedeelde exit logic voor meerdere callers.
- **Runtime:** Runtime.

### `exit_coverage_semantics.rs`
- **Primair:** SSOT welke order statussen als exit coverage tellen vs “protection confirmed”.
- **Secundair:** Voorkomt dubbele interpretatie in reconcile.
- **Runtime:** Runtime.

### `exit_lifecycle.rs`
- **Primair:** Post-fill native trailing, optioneel maker TP, time/panic exits.
- **Secundair:** Spot guards tegen nonsensical buy-protection paths.
- **Runtime:** Runtime.

### `exposure_ghost_lock.rs`
- **Primair:** Lost stale DB longs op wanneer exchange flat is vóór locks.
- **Secundair:** Voorkomt phantom exposure blocks.
- **Runtime:** Runtime.

### `exposure_reconcile.rs`
- **Primair:** Startup/periodic merge van DB, balances, executions; protection triggers.
- **Secundair:** “Exposure rows” terminologie i.p.v. misleidende “positions” in logs waar nodig.
- **Runtime:** Runtime.

### `fills_ledger.rs`
- **Primair:** Transactionele keten fill → position → PnL → order update.
- **Secundair:** Idempotentie en SSOT voor fill verwerking.
- **Runtime:** Runtime.

### `flow_execution.rs`
- **Primair:** Enkelvoudige candidate execute path voor flow poller.
- **Secundair:** Scheiding van “eval tick” vs “continuous drain”.
- **Runtime:** Runtime.

### `flow_observability_metrics.rs`
- **Primair:** Atomics voor flow/heap observability.
- **Secundair:** Export en dashboards.
- **Runtime:** Runtime.

### `flow_parallel_metrics.rs`
- **Primair:** Parallel drain counters.
- **Secundair:** Detecteert worker starvation of contention.
- **Runtime:** Runtime.

### `flow_poller.rs`
- **Primair:** Continue poller die flow heap leegmaakt buiten de eval tick.
- **Secundair:** Vermindert latency van heap-kandidaten naar submit.
- **Runtime:** Runtime.

### `generation_state.rs`
- **Primair:** Generation/admission snapshot voor heap (Phase 5 contract).
- **Secundair:** Voorkomt stale merges over generatiegrenzen.
- **Runtime:** Runtime.

### `historical_backfill_exit_repair.rs`
- **Primair:** One-shot repair voor legacy filled rows zonder post-fill exit.
- **Secundair:** Operatoren/maintenance tool.
- **Runtime:** CLI.

### `ignition_exit.rs`
- **Primair:** Ignition-specifiek native trailing exit gedrag.
- **Secundair:** Strategy-context specifieke trail policy.
- **Runtime:** Runtime.

### `ingest_runner.rs`
- **Primair:** `run-ingest`: public feeds, universe, epochs — geen execution.
- **Secundair:** Dedicated ingest proces mode.
- **Runtime:** Ingest proces.

### `intent.rs`
- **Primair:** Rich execution intent van pipeline naar adapter.
- **Secundair:** Type-safe order construction input.
- **Runtime:** Runtime.

### `kraken_adapter.rs`
- **Primair:** Map intent naar genormaliseerde WS orders / amend / cancel.
- **Secundair:** Kraken wire quirks en precision handling.
- **Runtime:** Runtime.

### `live_runner.rs`
- **Primair:** `run-execution-live` / `run-execution-only` hoofdlussen en bootstrap.
- **Secundair:** Vult `RouteStoreSlot` na bootstrap voor position monitor advisory.
- **Runtime:** Runtime.

### `margin_paper_lane.rs`
- **Primair:** Paper margin short persistence eligibility alleen.
- **Secundair:** Scheiding van live spot pad.
- **Runtime:** Runtime.

### `market_edge_refresher.rs`
- **Primair:** Loop A: mid ticks → bounded pipeline refresh + heap merge.
- **Secundair:** Houdt edge heap vers zonder full re-eval storm.
- **Runtime:** Runtime.

### `order_buffer.rs`
- **Primair:** Out-of-order WS event buffer op order ids.
- **Secundair:** Correlatie robuustheid bij burst updates.
- **Runtime:** Runtime.

### `order_reconcile.rs`
- **Primair:** Disconnect suspect → snapshot reconcile pad.
- **Secundair:** Herstel van order state na WS gaps.
- **Runtime:** Runtime.

### `order_state.rs`
- **Primair:** 13-state order lifecycle enum.
- **Secundair:** Eén vocabulaire voor DB en logs.
- **Runtime:** Types.

### `order_tracker.rs`
- **Primair:** DashMap in-flight order cache + OOO buffers.
- **Secundair:** Snelle lookups tijdens WS storm.
- **Runtime:** Runtime.

### `path_tape.rs`
- **Primair:** Tape/path classificatie en tape-aware exit routing.
- **Secundair:** Kiest exit style op marktstructuur.
- **Runtime:** Runtime.

### `position_monitor.rs`
- **Primair:** Achtergrond monitoring: protection, trailing, orphan recovery, route advisory via store slot.
- **Secundair:** Integratie `position_linkage` wanneer route store actief is.
- **Runtime:** Runtime.

### `position_reconcile.rs`
- **Primair:** Durable reconcile choke voor exits met WS snapshot doctrine.
- **Secundair:** Voorkomt dubbele exits bij race conditions.
- **Runtime:** Runtime.

### `position_truth.rs`
- **Primair:** Hiërarchie van position truth en balance-aligned repair.
- **Secundair:** Labelt degraded vs normal quality van inventory rows.
- **Runtime:** Runtime.

### `private_msg_source.rs`
- **Primair:** Trait die hub broadcast en dedicated mpsc bridged.
- **Secundair:** Testability en alternatieve wiring.
- **Runtime:** Runtime.

### `proof_runner.rs`
- **Primair:** Foreground monitor rond `run-execution-once` met timeout.
- **Secundair:** CI/server validation helper.
- **Runtime:** CLI.

### `protection_flow.rs`
- **Primair:** Emergency protection orders voor onbeschermde exposure; spot long-only guards.
- **Secundair:** Qty cap naar exchange balance.
- **Runtime:** Runtime.

### `raw_execution_backfill.rs`
- **Primair:** Poll raw executions om ledger gaps te dichten.
- **Secundair:** Post-mortem recovery tool path.
- **Runtime:** Runtime.

### `runner.rs`
- **Primair:** `run-execution-once` en gedeelde submit/wacht helpers.
- **Secundair:** Kern lifecycle documentatie voor execution.
- **Runtime:** Runtime.

### `state_machine.rs`
- **Primair:** DB state transitions: submit/ack/fill/cancel/reject/amend/reconcile.
- **Secundair:** SSOT voor order row status machine.
- **Runtime:** Runtime.

### `trail_atr.rs`
- **Primair:** ATR-style vol uit 15m bars in `trade_samples`.
- **Secundair:** Trail width input.
- **Runtime:** Runtime.

### `trail_bps_v1.rs`
- **Primair:** Deterministische trail bps uit fees + ATR + regime.
- **Secundair:** V1 trail model (voorspelbaar gedrag).
- **Runtime:** Runtime.

### `ws_handler.rs`
- **Primair:** Executions kanaal handler: correlatie, idempotente fills, fill feedback.
- **Secundair:** Heartbeat van order truth vs exchange.
- **Runtime:** Runtime.

---

<a name="export"></a>
## `export/`

### `parquet_cold.rs`
- **Primair:** Cold-store Parquet export voor CDV, funnel, orders, fills.
- **Secundair:** Analytics buiten Postgres.
- **Runtime:** CLI.

---

<a name="fees"></a>
## `fees/`

### `fee_provider.rs`
- **Primair:** Fee provider trait (uitbreidbaarheid).
- **Secundair:** Dunne laag boven live fees.
- **Runtime:** Types.

### `fee_schedule.rs`
- **Primair:** Maker/taker bps schedule types.
- **Secundair:** Static defaults en tests.
- **Runtime:** Types.

---

<a name="health"></a>
## `health/`

### `consistency_watchdog.rs`
- **Primair:** Periodieke dual-DB / epoch / WS freshness checks en recovery ladder.
- **Secundair:** Voorkomt split-brain trading decisions.
- **Runtime:** Runtime.

### `execution_progress.rs`
- **Primair:** Gedeelde progress snapshot voor watchdog.
- **Secundair:** Heartbeat van main loop health.
- **Runtime:** Runtime.

---

<a name="ignition"></a>
## `ignition/`

### `mod.rs`
- **Primair:** Compression → ignition → expansion state engine.
- **Secundair:** Feature off = geen ignition-gedrag in routing.
- **Runtime:** Env-gated: `IGNITION_ENABLED`.

### `diagnostics.rs`
- **Primair:** CLI bootstrap voor `report-ignition-state`.
- **Secundair:** Operator visibility.
- **Runtime:** CLI.

### `followthrough.rs`
- **Primair:** `report-ignition-followthrough` trade-history report.
- **Secundair:** Post-hoc kwaliteit van ignition signalen.
- **Runtime:** CLI.

### `metrics.rs`
- **Primair:** 1m candle metrics voor ignition engine.
- **Secundair:** Input features voor transitions.
- **Runtime:** Ignition aan.

### `route_map.rs`
- **Primair:** Map ignition state → toegestane route families.
- **Secundair:** Harde koppeling regime ↔ strategie.
- **Runtime:** Ignition aan.

### `state.rs`
- **Primair:** State machine met hysteresis en cooldown.
- **Secundair:** Voorkomt flip-flop rond drempels.
- **Runtime:** Ignition aan.

### `store.rs`
- **Primair:** Ring buffer van candles + transition notifications.
- **Secundair:** Efficiente sliding window voor metrics.
- **Runtime:** Ignition aan.

### `trade_flow_report.rs`
- **Primair:** `report-ignition-trade-flow` telemetrie.
- **Secundair:** CLI rapportage.
- **Runtime:** CLI.

---

<a name="l3"></a>
## `l3/`

### `client.rs`
- **Primair:** ws-l3 connect en subscribe met token en rate limits.
- **Secundair:** Budget enforcement per connection.
- **Runtime:** Runtime.

### `messages.rs`
- **Primair:** L3 wire types.
- **Secundair:** Parsing en tests.
- **Runtime:** Types.

### `orderbook.rs`
- **Primair:** Lokale L3 orderbook apply snapshot/delta.
- **Secundair:** Basis voor queue metrics.
- **Runtime:** Runtime.

### `pipeline_metrics.rs`
- **Primair:** Ingest-side L3 pipeline counters en lag.
- **Secundair:** Capacity planning.
- **Runtime:** Runtime.

### `queue_metrics.rs`
- **Primair:** Queue metrics uit L3 events.
- **Secundair:** Fill probability en quality inputs.
- **Runtime:** Runtime.

### `refill_metrics.rs`
- **Primair:** Refill-achtige metrics uit L3.
- **Secundair:** Microstructure signalen.
- **Runtime:** Runtime.

### `subscribe_test.rs`
- **Primair:** `l3-subscribe-test` load harness.
- **Secundair:** Stress test tooling.
- **Runtime:** CLI.

---

<a name="logging"></a>
## `logging/`

### `mod.rs`
- **Primair:** Initialiseert `tracing` subscriber en filters vanuit config.
- **Secundair:** Uniforme log format voor alle modes.
- **Runtime:** Startup.

---

<a name="market"></a>
## `market/`

### `market_state.rs`
- **Primair:** Geaggregeerde market state per symbol (domain model).
- **Secundair:** Observability DTOs.
- **Runtime:** Types.

### `orderbook_state.rs`
- **Primair:** Book depth model.
- **Secundair:** Niet hetzelfde als exchange wire book.
- **Runtime:** Types.

### `trade_flow.rs`
- **Primair:** Trade flow metrics model.
- **Secundair:** Feature inputs.
- **Runtime:** Types.

### `volatility.rs`
- **Primair:** Volatility metrics model.
- **Secundair:** Risk en sizing concepten.
- **Runtime:** Types.

---

<a name="observability"></a>
## `observability/`

### `export.rs`
- **Primair:** Schrijft JSON snapshot files volgens observability contract.
- **Secundair:** Website BFF consumptie.
- **Runtime:** CLI.

### `fill_feedback.rs`
- **Primair:** Atomic counters voor verwacht vs werkelijk fill gedrag.
- **Secundair:** Post-trade calibration (geen dode snapshot API meer na cleanup).
- **Runtime:** Runtime.

### `resource_telemetry.rs`
- **Primair:** Periodieke RSS/CPU logging.
- **Secundair:** Host saturation detectie.
- **Runtime:** Env-gated: `RESOURCE_TELEMETRY_INTERVAL_SECS > 0`.

### `snapshots.rs`
- **Primair:** DTOs voor snapshot JSON schema.
- **Secundair:** Versiebare export shapes.
- **Runtime:** Types.

### `tier2_data_bundle.rs`
- **Primair:** Tier-2 bundle uit ingest+decision zonder cross-DB SQL joins.
- **Secundair:** Performance en correct pool routing.
- **Runtime:** CLI.

### `timing_metrics.rs`
- **Primair:** Route timing atomics (signal age, maker miss, taker fallback).
- **Secundair:** `TIMING_METRICS_SNAPSHOT` style observability.
- **Runtime:** Runtime.

### `observability/forward_returns/mod.rs`
- **Primair:** Forward-return subsystem; alleen RESEARCH als write SSOT.
- **Secundair:** Scheiding van legacy decision migratie paden.
- **Runtime:** Gated: `RESEARCH_DATABASE_URL` + config.

### `forward_returns/capture.rs`
- **Primair:** Insert pending rows na readiness events.
- **Secundair:** Koppelt activation aan observation window.
- **Runtime:** Runtime.

### `forward_returns/persistence.rs`
- **Primair:** RESEARCH persistence helpers.
- **Secundair:** Batch en transaction helpers.
- **Runtime:** Runtime.

### `forward_returns/providers.rs`
- **Primair:** Scope providers voor capture metadata.
- **Secundair:** Pluggable bronnen voor “waarom deze row”.
- **Runtime:** Runtime.

### `forward_returns/sweeper.rs`
- **Primair:** Batch finalizer voor due observations.
- **Secundair:** Voorkomt stuck rows.
- **Runtime:** Runtime.

### `observability/microstructure/mod.rs`
- **Primair:** Microstructure snapshots subsystem op RESEARCH.
- **Secundair:** Phase C schema features.
- **Runtime:** Runtime.

### `microstructure/capture.rs`
- **Primair:** Open/periodic capture entrypoints.
- **Secundair:** Orchestreert extract + persist.
- **Runtime:** Runtime.

### `microstructure/extract.rs`
- **Primair:** Pure feature extractie + hash.
- **Secundair:** Deterministische reproducibility.
- **Runtime:** Runtime.

### `microstructure/metrics.rs`
- **Primair:** Capture quality counters.
- **Secundair:** Alerts op extract failures.
- **Runtime:** Runtime.

### `microstructure/persistence.rs`
- **Primair:** Inserts naar `market_microstructure_snapshots`.
- **Secundair:** Hot columns + JSON features.
- **Runtime:** Runtime.

### `microstructure/periodic.rs`
- **Primair:** Broad vs execution-universe periodic sampling loops.
- **Secundair:** Beheert kosten van brede sampling.
- **Runtime:** Runtime.

---

<a name="observe"></a>
## `observe/`

### `l2_book_registry.rs`
- **Primair:** DashMap registry van L2-afgeleide microstructure voor readers.
- **Secundair:** On-tick read path voor pipeline zonder lock convoy.
- **Runtime:** Runtime.

### `l2_feed.rs`
- **Primair:** L2 WS reader + sampler tasks + writer handoff.
- **Secundair:** CRC en resync policy op L2 pad.
- **Runtime:** Runtime.

### `l3_feed.rs`
- **Primair:** Multi-connection L3 subscribe met rate limits in observe context.
- **Secundair:** Parallelliseert symbol load.
- **Runtime:** Runtime.

### `metrics.rs`
- **Primair:** Rolling microstructure metrics tijdens observe runs.
- **Secundair:** End-of-run aggregatie input.
- **Runtime:** Runtime.

### `microprice.rs`
- **Primair:** Microprice deviation wiskunde.
- **Secundair:** Gedeeld door readiness en edge features.
- **Runtime:** Runtime.

### `persistence.rs`
- **Primair:** End-of-run aggregatie naar `pair_summary_24h`.
- **Secundair:** Sluit observe run netjes af.
- **Runtime:** Runtime.

### `queue_model.rs`
- **Primair:** Maker queue wait schatting.
- **Secundair:** Readiness gate input.
- **Runtime:** Runtime.

### `runner.rs`
- **Primair:** 24h observation loop en shutdown sequencing.
- **Secundair:** Hoofd “observe mode” proces.
- **Runtime:** Observe proces.

### `symbols.rs`
- **Primair:** Resolve observe symbol lists met instrument cache en degraded fallback.
- **Secundair:** Voorkomt stille 50-symbol cap zonder preload (zie main observe path).
- **Runtime:** Runtime.

### `ticker_feed.rs`
- **Primair:** Ticker WS subscription pad.
- **Secundair:** Price cache voeding.
- **Runtime:** Runtime.

### `trade_feed.rs`
- **Primair:** Trade WS subscription pad.
- **Secundair:** VWAP buffer voeding.
- **Runtime:** Runtime.

---

<a name="pipeline"></a>
## `pipeline/`

### `bootstrap_live_edge.rs`
- **Primair:** Live microstructure-only bootstrap edge (zonder Edgeboard).
- **Secundair:** Cold start edge voor nieuwe symbolen.
- **Runtime:** Runtime.

### `chaos_routing.rs`
- **Primair:** CHAOS subtype routing table met harde blocks.
- **Secundair:** Voorkomt risk-off trades in verkeerde subtype.
- **Runtime:** Runtime.

### `conflict_lane.rs`
- **Primair:** Optionele liquidity-aware admission gate.
- **Secundair:** Research-aligned filters voor conflict detection.
- **Runtime:** Runtime.

### `entry_route.rs`
- **Primair:** Strategy → entry route family mapping met rejection reasons.
- **Secundair:** Traceerbaar waarom entry route X gekozen/afgewezen werd.
- **Runtime:** Runtime.

### `execution_mandate.rs`
- **Primair:** Bundelt activation + entry + exit policy per candidate.
- **Secundair:** Eén struct voor downstream execution.
- **Runtime:** Runtime.

### `execution_surface.rs`
- **Primair:** Spot vs paper margin surface onderscheid.
- **Secundair:** Voorkomt verkeerde sizing op verkeerde surface.
- **Runtime:** Runtime.

### `horizon_selector.rs`
- **Primair:** Horizon-first candidate ranking uit hot state.
- **Secundair:** Voorkomt verkeerde horizon bucket collisions in store keys.
- **Runtime:** Runtime.

### `outcome.rs`
- **Primair:** Pipeline outcome type (edge/risk/execution samenvatting).
- **Secundair:** Eén return type voor `strategy_pipeline`.
- **Runtime:** Types.

### `position_policy.rs`
- **Primair:** Authoritative exit policy selectie uit strategy context.
- **Secundair:** Voorkomt conflicting exit modules.
- **Runtime:** Runtime.

### `position_state_machine.rs`
- **Primair:** Per-fill trade lifecycle (`TradeLifecycle`) policy state.
- **Secundair:** Koppelt aan `evaluate_with_route_advice` type shapes.
- **Runtime:** Runtime.

### `sizing.rs`
- **Primair:** Strategy-aware position sizing uit edge.
- **Secundair:** Respecteert caps en min notionals via instruments.
- **Runtime:** Runtime.

### `snapshot.rs`
- **Primair:** Pipeline input snapshot type.
- **Secundair:** Immutable input bundle voor planning.
- **Runtime:** Types.

### `strategy_activation.rs`
- **Primair:** Rijke strategy taxonomy en scoring.
- **Secundair:** Bepaalt welke strategieën überhaupt in aanmerking komen.
- **Runtime:** Runtime.

### `strategy_pipeline.rs`
- **Primair:** End-to-end planning: dataset → filters → readiness → rank → plan.
- **Secundair:** Hoofd “denk” pad vóór execution intent.
- **Runtime:** Runtime.

### `strategy_selector.rs`
- **Primair:** Regime-conditional geordende strategy/route candidates.
- **Secundair:** Voorkomt starre volgorde onafhankelijk van markt.
- **Runtime:** Runtime.

---

<a name="probe"></a>
## `probe/`

### `l3_probe.rs`
- **Primair:** Korte L3 subscribe metrics probe.
- **Secundair:** Snelle sanity check van L3 pad.
- **Runtime:** CLI.

### `l3_stream_probe.rs`
- **Primair:** 60s BTC/ETH L3 stream statistieken.
- **Secundair:** Stream health tooling.
- **Runtime:** CLI.

### `live_execution_probe.rs`
- **Primair:** Maker + round-trip live orders voor proof.
- **Secundair:** Geen productie strategie; test harness.
- **Runtime:** CLI.

### `live_strategy_probe.rs`
- **Primair:** Eén productie-achtige maker order uit huidige run pick.
- **Secundair:** End-to-end smoke test.
- **Runtime:** CLI.

### `probe_full_lifecycle.rs`
- **Primair:** Entry → protection → exit volledige lifecycle probe.
- **Secundair:** Valideert post-fill paden.
- **Runtime:** CLI.

---

<a name="redis"></a>
## `redis/`

### `mod.rs`
- **Primair:** Globale Redis connection manager + `noeviction` policy waarschuwing.
- **Secundair:** MSP projection en gedeelde state wanneer geconfigureerd.
- **Runtime:** Gated: Redis URL geconfigureerd.

---

<a name="risk"></a>
## `risk/`

### `capital_allocator.rs`
- **Primair:** Edge-gewogen allocator met vloeren en plafonds.
- **Secundair:** Voorkomt overconcentratie in één symbool.
- **Runtime:** Runtime.

### `capital_model.rs`
- **Primair:** Capital model en compound notities.
- **Secundair:** Documentatie van equity definities.
- **Runtime:** Types.

### `checks.rs`
- **Primair:** Pure risk checks zonder side effects.
- **Secundair:** Unit test friendly.
- **Runtime:** Runtime.

### `exposure.rs`
- **Primair:** Aggregate exposure model types.
- **Secundair:** Sommeert posities en limieten conceptueel.
- **Runtime:** Types.

### `inventory_limits.rs`
- **Primair:** Per-symbol inventory caps model.
- **Secundair:** Hard limits op inventory concentration.
- **Runtime:** Types.

### `risk_gate.rs`
- **Primair:** Allow/block gate uit capital/positions/inventory inputs.
- **Secundair:** Laatste risk veto vóór submit.
- **Runtime:** Runtime.

### `risk_policy.rs`
- **Primair:** Policy contracts zonder enforcement in module.
- **Secundair:** Configureerbare drempels als data.
- **Runtime:** Types.

---

<a name="route_engine"></a>
## `route_engine/`

### `cost_model.rs`
- **Primair:** Route-aware cost stack (maker vs taker realism).
- **Secundair:** Consistente kosten voor alle route families.
- **Runtime:** Runtime.

### `exit_regime.rs`
- **Primair:** Exit regime selectie uit exit mode + market stress.
- **Secundair:** Bepaalt hoe agressief exit mag zijn.
- **Runtime:** Runtime.

### `expected_path.rs`
- **Primair:** Verwacht pad per route thesis en horizon.
- **Secundair:** Legt “move thesis” vast als scenario.
- **Runtime:** Runtime.

### `forecast_15m.rs`
- **Primair:** Soft 15m directional forecast helper.
- **Secundair:** Context voor horizon trades.
- **Runtime:** Runtime.

### `market_features.rs`
- **Primair:** Feature extractie uit run data voor routes (incl. VWAP deviation hook).
- **Secundair:** Eén feature bundle voor selectors.
- **Runtime:** Runtime.

### `route_expectancy.rs`
- **Primair:** Single-route evaluatie met volledige cost/time stack + TOD multiplier hook.
- **Secundair:** Rankt routes eerlijk binnen dezelfde run context.
- **Runtime:** Runtime.

### `route_selector.rs`
- **Primair:** Candidate matrix, winnaar, `V2RouteReport` assembly.
- **Secundair:** Hoofd orchestrator van market-first route engine.
- **Runtime:** Runtime.

### `run_metrics.rs`
- **Primair:** Run-level metrics (edge velocity, L3 quality, …).
- **Secundair:** Logging voor tuning.
- **Runtime:** Runtime.

### `shadow.rs`
- **Primair:** Mandatory shadow logging van niet-gekozen kandidaten.
- **Secundair:** Voorkomt “winner’s curse” blindheid.
- **Runtime:** Runtime.

### `taker_fallback.rs`
- **Primair:** Maker-window expiry → taker economics rerank.
- **Secundair:** Voorkomt eeuwig wachten in maker queue.
- **Runtime:** Runtime.

### `types.rs`
- **Primair:** Kern V2 types (routes, horizons, modes).
- **Secundair:** SSOT voor route engine vocabulary.
- **Runtime:** Types.

### `route_engine/move_thesis/atr_breakout.rs`
- **Primair:** ATR expansion breakout thesis implementatie.
- **Secundair:** Move model voor specifieke route family.
- **Runtime:** Runtime.

### `move_thesis/breakout.rs`
- **Primair:** Compression→expansion breakout thesis.
- **Secundair:** Koppelt aan regime detection outputs.
- **Runtime:** Runtime.

### `move_thesis/fade.rs`
- **Primair:** Counter-trend fade thesis.
- **Secundair:** Mean reversion variant op sterkere trends.
- **Runtime:** Runtime.

### `move_thesis/grid.rs`
- **Primair:** Range grid thesis.
- **Secundair:** Passive range harvesting logic.
- **Runtime:** Runtime.

### `move_thesis/ignition_momentum.rs`
- **Primair:** High-impulse + trend ignition thesis.
- **Secundair:** Gebruikt ignition metrics wanneer actief.
- **Runtime:** Runtime.

### `move_thesis/liquidity_sweep.rs`
- **Primair:** Sweep / absorption thesis.
- **Secundair:** Microstructure event driven entries.
- **Runtime:** Runtime.

### `move_thesis/market_making.rs`
- **Primair:** Passive spread-capture thesis.
- **Secundair:** Maker-first economics.
- **Runtime:** Runtime.

### `move_thesis/mean_reversion.rs`
- **Primair:** Mean reversion thesis.
- **Secundair:** Korte horizon revert plays.
- **Runtime:** Runtime.

### `move_thesis/momentum.rs`
- **Primair:** Trend continuation thesis.
- **Secundair:** Langere horizon trend plays.
- **Runtime:** Runtime.

### `move_thesis/order_flow_imbalance.rs`
- **Primair:** OFI / L3 asymmetry thesis.
- **Secundair:** Order flow gedreven entries.
- **Runtime:** Runtime.

### `move_thesis/pullback.rs`
- **Primair:** Breakout-retest thesis.
- **Secundair:** Betere entries na impulse.
- **Runtime:** Runtime.

### `move_thesis/scalping.rs`
- **Primair:** Ultra-short oscillation thesis.
- **Secundair:** Hoge frequentie micro moves.
- **Runtime:** Runtime.

### `move_thesis/tod_overlay.rs`
- **Primair:** Volatility-shaped time-of-day overlay op verwachte move.
- **Secundair:** Multi-session shape zonder dubbele TOD ranking penalty waar uitgesloten.
- **Runtime:** Runtime.

### `move_thesis/vwap_reversion.rs`
- **Primair:** VWAP deviation reversion thesis.
- **Secundair:** Gebruikt VWAP features wanneer feed actief is.
- **Runtime:** Runtime.

---

<a name="route_state"></a>
## `route_state/`

### `edgeboard_bridge.rs`
- **Primair:** Map Edgeboard kandidaten naar route-state rijen.
- **Secundair:** Voedt store vanuit research-aligned signalen.
- **Runtime:** Env-gated: `ENABLE_ROUTE_STATE_STORE`.

### `key.rs`
- **Primair:** Composite route identity key (o.a. horizon bucketing).
- **Secundair:** Voorkomt key collisions tussen routes.
- **Runtime:** Types.

### `pipeline_bridge.rs`
- **Primair:** Map pipeline outcomes naar route-state (Tier 2).
- **Secundair:** Koppelt evaluatie cyclus aan timing economie.
- **Runtime:** Env-gated: `ENABLE_ROUTE_STATE_STORE`.

### `position_linkage.rs`
- **Primair:** Koppelt open inventory aan route context en `ManagementAdvice`.
- **Secundair:** Informative exits/tighten hints; geen margin/short semantiek.
- **Runtime:** Env-gated: `ENABLE_ROUTE_STATE_STORE` + monitor leest store via OnceLock slot.

### `row.rs`
- **Primair:** Volledige per-route economic + timing row struct.
- **Secundair:** Serialisatie/observability velden.
- **Runtime:** Types.

### `store.rs`
- **Primair:** In-memory SSOT store met pruning en metric hooks.
- **Secundair:** `prune_expired` en timing counters.
- **Runtime:** Env-gated: `ENABLE_ROUTE_STATE_STORE`.

### `tier1_driver.rs`
- **Primair:** Mid-tick gedreven Tier 1 timing updates (signal age, viability).
- **Secundair:** Registreert subscriber op `price_cache`.
- **Runtime:** Env-gated: `ENABLE_ROUTE_STATE_STORE`.

### `timing_profile.rs`
- **Primair:** Per-family timing half-life en urgency parameters.
- **Secundair:** Gedeeld door edge lifetime en timing selectie.
- **Runtime:** Runtime.

### `timing_selection.rs`
- **Primair:** Timing-aware globale winner selectie (`TIMING_SELECTION_TOP_ROUTES`).
- **Secundair:** Alternatieve ranking vs puur edge sorting.
- **Runtime:** Env-gated: `ENABLE_ROUTE_STATE_STORE`.

### `route_state/mod.rs`
- **Primair:** Architectuur documentatie en submodule exports voor route state systeem.
- **Secundair:** Grenzen ownership Tier1/Tier2/Tier3.
- **Runtime:** Compile-time docs + imports.

---

<a name="selection"></a>
## `selection/`

### `pair_filters.rs`
- **Primair:** Threshold filters op pair lijsten.
- **Secundair:** Herbruikbare filter primitives.
- **Runtime:** Runtime.

### `pair_ranker.rs`
- **Primair:** Sorteert pairs op suitability/trades/spread proxies.
- **Secundair:** Voedt pair reports.
- **Runtime:** Runtime.

### `pair_report.rs`
- **Primair:** Candidate en exclude list report types en output helpers.
- **Secundair:** CLI formatting.
- **Runtime:** CLI.

### `run_loader.rs`
- **Primair:** Laadt run en bouwt pair report.
- **Secundair:** Eén entry voor selection CLI flows.
- **Runtime:** CLI.

### `summary_view.rs`
- **Primair:** Unified view over `pair_summary_24h`.
- **Secundair:** Abstractie over partial vs volledige runs.
- **Runtime:** CLI.

---

<a name="state"></a>
## `state/`

### `horizon_mirror.rs`
- **Primair:** 5s batch UPSERT van horizon mirror naar decision DB.
- **Secundair:** Historische horizon state voor UI/analytics.
- **Runtime:** Runtime.

### `horizon_movers.rs`
- **Primair:** Rolling multi-horizon movers per symbol uit trades.
- **Secundair:** Hot state voor horizon selector.
- **Runtime:** Runtime.

### `projection.rs`
- **Primair:** Redis-backed market state projection + DB `market_state_projection` coherentie.
- **Secundair:** MSP halt/drift interactie met execution choke.
- **Runtime:** Runtime.

### `tradability.rs`
- **Primair:** Per-symbol tradability uit price cache + L2 registry.
- **Secundair:** Voorkomt entries zonder verse book data.
- **Runtime:** Runtime.

---

<a name="trading"></a>
## `trading/`

### `entry_filter.rs`
- **Primair:** Queue-aware entry filter (spread, fill time, notional).
- **Secundair:** Beschermt maker entries tegen onrealistische queues.
- **Runtime:** Runtime.

### `entry_plan.rs`
- **Primair:** Maker entry plan struct.
- **Secundair:** Input voor execution planner.
- **Runtime:** Types.

### `execution_intent.rs`
- **Primair:** Intent enums vóór concrete order construction.
- **Secundair:** Scheiding planning vs adapter.
- **Runtime:** Types.

### `execution_planner.rs`
- **Primair:** Queue join vs improve beslissing + plan builder.
- **Secundair:** Minimaliseert adverse selection op entry.
- **Runtime:** Runtime.

### `exit_manager.rs`
- **Primair:** Exit rules: protective stop resident, TP CASE A/B.
- **Secundair:** Hoog niveau exit orchestration zonder direct WS.
- **Runtime:** Runtime.

### `exit_plan.rs`
- **Primair:** Taker exit plan struct.
- **Secundair:** Sluit aan op emergency/market exit paths.
- **Runtime:** Types.

### `exit_state.rs`
- **Primair:** “Geen onbeschermde positie” state machine types.
- **Secundair:** Formaliseert protection invariant conceptueel.
- **Runtime:** Runtime.

### `inventory.rs`
- **Primair:** Inventory aggregate type.
- **Secundair:** Domain view op holdings.
- **Runtime:** Types.

### `liquidity_exec_policy.rs`
- **Primair:** Tier A/B liquidity classificatie en price staleness tiers.
- **Secundair:** Gate op “is de markt tradable genoeg”.
- **Runtime:** Runtime.

### `liquidity_strategy.rs`
- **Primair:** Maker-both-sides volume strategy regels (logica only).
- **Secundair:** Strategie-specifiek gedrag los van execution adapter.
- **Runtime:** Runtime.

### `momentum_strategy.rs`
- **Primair:** Momentum strategy regels (logica only).
- **Secundair:** Zelfde scheiding als liquidity strategy.
- **Runtime:** Runtime.

### `order.rs`
- **Primair:** Order type/status modellen.
- **Secundair:** Gedeelde vocabulary met exchange mapping.
- **Runtime:** Types.

### `order_management.rs`
- **Primair:** Replace-on-bid-change en minimum lifetime regels.
- **Secundair:** Voorkomt thrash op snelle books.
- **Runtime:** Runtime.

### `position.rs`
- **Primair:** Position side/size model in trading laag.
- **Secundair:** Niet automatisch gelijk aan DB `positions` row semantiek.
- **Runtime:** Types.

### `readiness_gate.rs`
- **Primair:** Tradable per pair met dominant blocker en economics snapshot.
- **Secundair:** Mens-leesbare “waarom niet tradable”.
- **Runtime:** Runtime.

### `take_profit.rs`
- **Primair:** Dynamic TP target uit fees, slip, buffers, microstructure.
- **Secundair:** Integreert fee floor en realism.
- **Runtime:** Runtime.

---

<a name="universe"></a>
## `universe/`

### `mod.rs`
- **Primair:** Dynamic universe manager: atomische snapshot swap, rotatie, hysteresis, pins, caps uit config.
- **Secundair:** Voorkomt oscillatie in universe membership.
- **Runtime:** Runtime.

---

## Samenvatting

- **~220 modules** onder `src/`, gegroepeerd in **~24 directories**.
- Voor **edge/** domain types is één gezamenlijke beschrijving gegeven om herhaling te beperken; elk bestand heeft dezelfde rol: **type vocabulary** voor edge calculus.

---

[← Index](./DOC_INDEX.md) | **00 — Module-inventaris** | [01 — Architectuur](./01_ARCHITECTURE.md) →

---

*Document gegenereerd voor technische documentatie. Laatst bijgewerkt: 2026-04-13.*

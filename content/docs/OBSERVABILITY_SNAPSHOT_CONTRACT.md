# Observability Snapshot Contract (Bot ↔ Website)

DOC_STATUS: SSOT  
DOC_ROLE: observability_contract  

**Contract version:** 1.1  
**Doel:** Versioned contract tussen KRAKENBOTMAART (export) en KapitaalBot-Website (BFF). De website leest uitsluitend deze snapshots; geen directe queries op execution-tabellen.

---

## 1. Algemeen

- Elk snapshot-bestand bevat een veld **`contract_version`** (string, bijv. `"1.0"`).
- Export schrijft naar een configureerbare directory (bijv. `/srv/krakenbot/observability_export/` of `OBSERVABILITY_EXPORT_DIR`).
- Bestandsnamen: `{snapshot_family}.json` (bijv. `public_status_snapshot.json`).
- **Vertraging (Tier 1):** Publieke snapshots gebruiken afgeronde/vertraagde timestamps (bijv. kwartier of uur); geen realtime regime-switch events.
- **Aggregatie:** Tier 1 alleen geaggregeerde tellers en samenvattingen; geen raw order- of fill-ID’s.

---

## 2. Snapshot-families

| Bestand | Tier | Beschrijving |
|---------|------|--------------|
| `public_status_snapshot.json` | 1 | Runtime health, laatste snapshot_ts, data freshness, run_id, epoch status |
| `public_regime_snapshot.json` | 1 | Actieve regimes (geaggregeerd), regime-switch samenvatting, dominant regime per periode (vertraagd) |
| `public_strategy_snapshot.json` | 1 | Actieve strategieën, strategy count, geaggregeerd |
| `public_market_snapshot.json` | 1 | Suitability per symbol, spread stats, market-overview (pair_summary_24h / L2/L3 agg) |
| `public_trading_snapshot.json` | 1 | Trades laatste 24h (counts), equity trend (vertraagd), drawdown |
| `public_demo_trades.json` | 1 | Geselecteerde demo trades; lifecycle, exit reason, resultaat |
| `tier2_execution_snapshot.json` | 2 | Order/fill-detail, expected vs realized (alleen bij Tier 2 sessie) |
| `tier2_latency_snapshot.json` | 2 | Submit→ack, fill→exit, histogrammen |
| `tier2_pnl_snapshot.json` | 2 | PnL-detail, exposure |
| `tier2_safety_snapshot.json` | 2 | Symbols per mode, quiet/hard-block |
| `tier2_data_bundle.json` | 2 | Multi-page **Data**-menu: intake/universe (ingest), route/no-trade, risk, entry, path/doctrine, infra (decision); dual-DB; zie §3.8 |
| `admin_observability_snapshot.json` | 3 | Full observability, raw lifecycle (alleen admin) |

---

## 3. Velden per familie (v1.0)

### 3.1 public_status_snapshot

- `contract_version`: "1.0"
- `exported_at`: ISO8601 (UTC)
- `run_id`: number | null
- `run_started_at`: string | null (ISO8601, afgerond voor Tier 1 indien gewenst)
- `run_ended_at`: string | null
- `latest_epoch_id`: number | null
- `epoch_status`: "valid" | "degraded" | null
- `epoch_run_id`: number | null (optioneel). `ingest_epochs.run_id` van de laatste epoch-rij; zelfde run als waar `epoch_symbol_count` bij hoort.
- `epoch_symbol_count`: number | null
- `data_freshness_secs`: number | null (max ts_local vs now, run-consistent over ticker/trade/L2/L3 voor dezelfde status-run).
- `ticker_count`, `trade_count`, `l2_count`, `l3_count`: numbers voor één **status-run**: `epoch_run_id` wanneer die bestaat, anders de freshest active `run_id`.
- `l3_symbol_count`: L3-statistiek voor diezelfde status-run. Zo is "L3 availability %" = (l3_symbol_count / epoch_symbol_count) × 100 consistent wanneer `epoch_run_id` aanwezig is.
- `safety_normal_count`, `safety_exit_only_count`, `safety_hard_blocked_count`: numbers

### 3.2 public_regime_snapshot

- `contract_version`, `exported_at`
- `active_regimes`: array van { regime: string, count: number } (geaggregeerd)
- `dominant_regime`: string | null
- `regime_switches_last_hour`: number (afgerond/vertraagd)
- `regime_stability_summary`: string (bijv. "stable" | "volatile") (optioneel)

### 3.3 public_strategy_snapshot

- `contract_version`, `exported_at`
- `active_strategies`: array van { strategy: string, count: number }
- `strategy_count`: number

### 3.4 public_market_snapshot

- `contract_version`, `exported_at`
- `run_id`: number | null
- `pairs`: array van { symbol, trade_count, avg_spread_bps, suitability_score } (van pair_summary_24h of L2/trade agg)
- `symbol_count`: number

### 3.5 public_trading_snapshot

- `contract_version`, `exported_at`
- `trades_24h_count`: number — aantal **fill-rijen** in DB met `COALESCE(ts_exchange, ts_local)` in de laatste 24h (beurstijd waar bekend).
- `orders_24h_count`: number — orders met `created_at` in de laatste 24h (werkelijk geplaatste orders in het venster).
- `equity_trend_delayed`: array van { ts_bucket: string, value: number } (vertraagd, optioneel)
- `drawdown_pct`: number | null (optioneel)
- `recent_orders` (optioneel, leeg weggelaten): max 10 nieuwste rijen uit `execution_orders`, tijd `ts_bucket` = 15 min afgerond; `order_ref` = verkorte client-order-ref (suffix), geen volledige exchange ids.
- `recent_fills` (optioneel, leeg weggelaten): max 10 nieuwste rijen uit `fills`, tijd `ts_bucket` = 15 min afgerond; qty/prijs als string (decimal).

### 3.6 public_demo_trades

- `contract_version`, `exported_at`
- `demo_trades`: array van { symbol, side, outcome, result_bps, lifecycle_summary } (geen exacte prijzen/tijden indien disclosure)

### 3.7 tier2_* en admin_observability_snapshot

- Zelfde `contract_version` + `exported_at`; inhoud uitgebreider (order/fill/latency/PnL/safety detail). Exacte velden in volgende iteratie of in code (Rust structs) gedefinieerd.
- `tier2_pnl_snapshot` bevat vanaf nu ook risk-adjusted velden:
  - `sharpe_like_24h` (optioneel)
  - `sortino_like_24h` (optioneel)
  - `max_drawdown_duration_buckets_24h` (optioneel, aantal 15m buckets)
- `admin_observability_snapshot` kan optioneel een compacte `edgeboard` samenvatting bevatten: `available`, `snapshot_ts`, `visible_symbols`, `positive_edge_symbols`, `max_expected_net_edge_bps`, `training_examples_24h`, `outcomes_24h`.

### 3.8 tier2_data_bundle (contract 1.1+)

- **Doel:** één JSON voor KapitaalBot **Data**-menu: geaggregeerde, querybare observability over **ingest**- en **decision**-DB (gecombineerd in export; geen cross-database SQL).
- `contract_version`: `"1.1"` (gebundeld met [`CONTRACT_VERSION`](../src/observability/snapshots.rs)).
- `disclosure_policy`: object met o.a. `kind` (`"delayed"`), `bucket_minutes`, `as_of_utc`, `explanation_nl` — **opzettelijke vertraging** t.o.v. live trading (copytrading-bescherming); geen foutieve latentie.
- `source_db`: `{ "intake_role": "ingest", "decision_role": "decision" }` — welk DB-role per subsysteem.
- Subsecties (elk met eigen `source_db` veld `"ingest"` | `"decision"`):
  - `intake_universe`: epoch-criteria, optioneel `run_id` + `run_symbol_state`/raw sums.
  - `route_no_trade`: funnel stage/decision_code/reason/path_tape tellingen 24h; optioneel shadow `blocker_reason`-verdeling voor geselecteerde run.
  - `risk_capital`: `symbol_safety_state` per mode; `capital`-stage funnel count 24h.
  - `entry_execution`: execution/fill funnel counts 24h; rijen met `correlation_id` 24h.
  - `path_doctrine`: `execution_orders` per `path_tape_class` 24h; funnel met path_tape 24h.
  - `infra`: recovery requests 24h; laatste watchdog `state`; optioneel event-buffer unknown voor run.
  - `market_forecast_15m`: per symbool afgeleide 15m-forecast uit route/path engine (`expected_direction_15m`, `expected_move_15m_bps`, `confidence_15m`, `recommended_route_*`, `reason_code`, `soft_gate_score`, `forecast_basis`).
  - `edgeboard`: **RESEARCH**-gevoede delayed Edgeboard-samenvatting met `available`, laatste zichtbare `snapshot_ts`, `visible_rows`, `visible_symbols`, `positive_edge_symbols`, `avg_confidence`, `avg_expected_net_edge_bps`, `max_expected_net_edge_bps`, `training_examples_24h`, `outcomes_24h`, plus `top_signals[]` met `rank`, `symbol`, `route_name`, `horizon_sec`, `expected_net_edge_bps`, `confidence`, `sample_size`, `boost`, en optioneel `dominant_reason_code` / `feature_coverage_class` / `freshness_ms`.

- **Belangrijk:** `market_forecast_15m` is een **afgeleide soft signal** (ranking/weging), geen harde prijsvoorspelling of hard execution-block.
- **Belangrijk:** `edgeboard` is eveneens **read-only ranking observability**. Het toont welke delayed RESEARCH-snapshots live blend zouden voeden; het is geen directe order- of gate-truth.

---

## 4. Vertraging en aggregatieregels (Tier 1)

- **Timestamps:** Afronden naar 15 min of 1 uur voor public snapshots.
- **Regime-switch:** Geen realtime event feed; alleen aantal per periode en dominante regimes.
- **Strategy/regime counts:** Alleen tellers; Tier 1 mag wel **samengevatte** laatste orders/fills tonen (`recent_orders` / `recent_fills`) zoals hierboven, geen realtime feed.

---

## 5. Backward compatibility

- Nieuwe velden: optioneel toevoegen zonder contract_version te bumpen.
- Breaking changes: contract_version verhogen (bijv. 1.1); documenteer in dit bestand.
- Website kan meerdere versies ondersteunen tijdens overgang.

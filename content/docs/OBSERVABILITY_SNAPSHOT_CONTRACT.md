# Observability Snapshot Contract (Bot ↔ Website)

DOC_STATUS: SSOT  
DOC_ROLE: observability_contract  

**Contract version:** 1.0  
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
- `epoch_symbol_count`: number | null
- `data_freshness_secs`: number | null (max ts_local vs now)
- `ticker_count`, `trade_count`, `l2_count`, `l3_count`: numbers (laatste run). **l3_count** = totaal aantal rijen in l3_queue_metrics (geen percentage).
- `l3_symbol_count`: number | null (optioneel). Aantal symbolen in run_symbol_state met l3_count >= 1; gebruikt voor "L3 availability %" = (l3_symbol_count / epoch_symbol_count) * 100.
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
- `trades_24h_count`: number
- `orders_24h_count`: number
- `equity_trend_delayed`: array van { ts_bucket: string, value: number } (vertraagd, optioneel)
- `drawdown_pct`: number | null (optioneel)
- `recent_orders` (optioneel): max 10 nieuwste `execution_orders`; `ts_bucket` 15 min; `order_ref` = suffix van client order id.
- `recent_fills` (optioneel): max 10 nieuwste `fills`; `ts_bucket` 15 min; qty/prijs als string.

### 3.6 public_demo_trades

- `contract_version`, `exported_at`
- `demo_trades`: array van { symbol, side, outcome, result_bps, lifecycle_summary } (geen exacte prijzen/tijden indien disclosure)

### 3.7 tier2_* en admin_observability_snapshot

- Zelfde `contract_version` + `exported_at`; inhoud uitgebreider (order/fill/latency/PnL/safety detail). Exacte velden in volgende iteratie of in code (Rust structs) gedefinieerd.

---

## 4. Vertraging en aggregatieregels (Tier 1)

- **Timestamps:** Afronden naar 15 min of 1 uur voor public snapshots.
- **Regime-switch:** Geen realtime event feed; alleen aantal per periode en dominante regimes.
- **Strategy/regime counts:** Alleen tellers; Tier 1 mag wel **samengevatte** laatste orders/fills tonen (`recent_orders` / `recent_fills`), geen realtime feed.

---

## 5. Backward compatibility

- Nieuwe velden: optioneel toevoegen zonder contract_version te bumpen.
- Breaking changes: contract_version verhogen (bijv. 1.1); documenteer in dit bestand.
- Website kan meerdere versies ondersteunen tijdens overgang.

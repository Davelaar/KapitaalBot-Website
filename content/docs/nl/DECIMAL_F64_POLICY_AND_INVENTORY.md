# Decimal / f64 policy and f64 inventory (Krakenbot)

**Evidence:** The execution L2-only feed suffered ~98.7% CRC32 mismatches because JSON numbers were parsed via `f64`, destroying trailing precision; combined with wrong Decimal keys, the registry never updated. Fix: `RawValue` wire strings + `Decimal::from_str_exact` + depth truncation (`8188ba4` series). **Same failure class can reappear** on trades, ticker, order wire, sizing, and reconciliation if `f64` remains on those paths.

**This document is the SSOT** for the engineering rule and inventory until the phased migration completes. Update it when you change a listed module.

---

## 1. DECIMAL RULE TABLE

| Rule | Scope | Exception policy |
|------|--------|-------------------|
| No `f64` for **price** SSOT | Checksum-critical, orderbook apply, execution order/fill SSOT, registry snapshots | Only non-critical derived metrics (e.g. normalized scores), with inline justification |
| No `f64` for **quantity / size / order amount** SSOT | Same as above | Same |
| No `f64` for **notional** used in caps / risk / live sizing | Execution + risk gates | Same |
| No `f64` in **snapshot/delta/apply/checksum** path | L2 (and any future book feeds) | Lossless wire (`RawValue` / `String`) + `Decimal` for book state |
| No `f64` on **execution decision path** where price/qty/order amount is SSOT | Protection, exits, reconcile, WS order build, instrument quantize to wire | Temporary legacy only; mark `must-fix` in inventory |
| **Spread/mid/bps** | Prefer `Decimal` when compared to fee floors or used as gate SSOT; `f64` bps acceptable for **analytics-only** if documented | If the value **gates** `tradable` / order send, treat as critical |
| New serde fields for exchange **price/qty** | Must not default to `f64` | Use `RawValue`, `String`, or `rust_decimal` with correct serde |

---

## 2. F64 INVENTORY TABLE

Rows are **module-granular** (file + primary struct/API). Many files contain additional local `f64` temporaries; grep `f64` in that file for exhaustiveness. Classification:

- **C** = checksum-critical  
- **E** = execution-critical  
- **A** = analytics-only / non-gating derived  

Priority: **P0** = fix before expanding live scope; **P1** = next phase; **P2** = acceptable-temporary / migrate with module; **P3** = analytics, low risk.

| file | symbol_or_field | current type | semantic_role | checksum_critical | execution_critical | priority |
|------|------------------|--------------|---------------|-------------------|--------------------|----------|
| `src/state/horizon_movers.rs` | `HorizonWindow::push`, `record_trade`, `sample_l2_mid` — `mid_price` | `f64` | Mid/trade tick storage in ring | no | yes (feeds horizon SSOT for selector) | **P0** |
| `src/observe/l2_feed.rs` | `qty_f` (zero / remove detection) | `f64` from `str::parse` | Branch only; book state is `Decimal` | no (state is Decimal) | no | **P2** (replace with Decimal zero-compare) |
| `src/exchange/messages.rs` | `TradeData::{price,qty}` | `Decimal` | Public WS trade serde | no | — | **OK** (migrated `3ead075`) |
| `src/exchange/messages.rs` | `TickerData::{bid,ask,last,bid_qty,ask_qty}` | `Option<Decimal>` | Public WS ticker serde | no | — | **OK** (migrated `c2657ac`) |
| `src/exchange/messages.rs` | `BookLevel::{price,qty}` | `f64` | Legacy serde surface (unused by L2 hot path after Raw path) | no | no if unused | **P2** deprecate/remove callers |
| `src/exchange/messages.rs` | `ExecutionReport` / `ExecutionFee` (inbound: `order_qty`, `limit_price`, `cum_qty`, `cum_cost`, `last_qty`, `last_price`, fee `qty`) | `Option<Decimal>` | Private WS inbound serde | no | — | **OK** (migrated `950bdd3`) |
| `src/exchange/messages.rs` | `AddOrderParams`, `TriggerParams`, `ConditionalParams`, `AmendOrderParams` (outbound fields) | `Decimal` + `ser_kraken_float` → JSON **number** | Private WS outbound; Kraken rejects string qty (`number_float` rule) | no | **yes** (wire SSOT) | **OK** — `serialize_f64` at serde boundary only |
| `src/exchange/auth_ws.rs` | function params, `quantize_limit_price_wire` | `Decimal` | Order wire construction — **DONE** | no | — | **OK** (migrated `ed7d26b`) |
| `src/exchange/instruments.rs` | `InstrumentConstraints`, `normalize_order`, `normalize_exit_qty`, `quantize_*`, `NormalizedOrder` | `Decimal` | Exact instrument arithmetic — **DONE** | no | — | **OK** (migrated `ed7d26b`) |
| `src/exchange/price_cache.rs` | `TickerSnapshot` bid/ask/qty | `f64` | L1 cache | no | yes (readiness / features) | **P1** |
| `src/exchange/trade_flow_window.rs` | trade `price`, `qty` | `f64` | Flow aggregates | no | yes if gates routing | **P1** |
| `src/exchange/balance_cache.rs` | `balance` | `f64` | Balances | no | **yes** | **P0** |
| `src/exchange/kraken_public.rs` | `spread_bps(bid, ask)` | `f64` in | Spread helper | no | yes (downstream features) | **P1** |
| `src/observe/l2_book_registry.rs` | snapshot fields | `Decimal` | **GOOD** — reference | — | — | OK |
| `src/l3/messages.rs` | `limit_price`, `order_qty` | `Decimal` via `de_decimal::deserialize` | L3 serde — **DONE** | no | — | **OK** (migrated) |
| `src/l3/orderbook.rs` | `PriceLevel` qty, `OrderedPrice` scale, `best_bid/ask`, `bid/ask_depth_at_best` | `Decimal` | L3 book state — **DONE** | no | — | **OK** (migrated) |
| `src/execution/live_runner.rs` | `sample_l2_mid` call — `mid` from `to_string().parse::<f64>()` | `f64` | Horizon L2 sample | no | yes | **P0** |
| `src/execution/protection_flow.rs` | qty, stop, notional, normalize — boundary converts f64↔Decimal at instruments/auth_ws calls | `f64` internal | Stops / protection | no | **yes** | **P1** (Phase 3: internals) |
| `src/execution/position_monitor.rs` | `net_qty`, prices, trail — boundary converts at auth_ws calls | `f64` internal | Live position management | no | **yes** | **P1** (Phase 3) |
| `src/execution/exit_lifecycle.rs` | fill qty/price, SL/TP — boundary converts at instruments/auth_ws calls | `f64` internal | Exit state machine | no | **yes** | **P1** (Phase 3) |
| `src/execution/ignition_exit.rs` | same class — boundary converts | `f64` internal | Ignition exits | no | **yes** | **P1** (Phase 3) |
| `src/execution/position_reconcile.rs` | `db_position_qty`, intended qty — boundary converts | `f64` internal | Reconcile | no | **yes** | **P1** (Phase 3) |
| `src/execution/exposure_reconcile.rs` | `qty_f64` parses — boundary converts | `f64` internal | Exposure | no | **yes** | **P1** (Phase 3) |
| `src/pipeline/sizing.rs` | `size_quote`, `equity_quote`, spreads | `f64` | Sizing → orders | no | **yes** | **P0** |
| `src/risk/capital_allocator.rs` | `notional_quote`, `equity_quote` | `f64` | Capital slots | no | **yes** | **P0** |
| `src/config/mod.rs` | limits, equity, spreads (config) | `f64` | Thresholds | no | yes (compared to runtime) | **P1** |
| `src/trading/readiness_gate.rs` | `spread_bps`, surpluses | `f64` | **Gates tradable** | no | **yes** | **P1** |
| `src/pipeline/strategy_pipeline.rs` | `spread_bps`, `max_order_quote` | `f64` | Pipeline / candidates | no | **yes** | **P1** |
| `src/route_engine/*.rs`, `src/trading/entry_filter.rs`, `conflict_lane.rs` | spread_bps, sizes | `f64` | Route / entry | no | yes if live | **P1** |
| `src/analysis/*` (edge_score, fill_probability, cost_breakdown, strategy_readiness_report, …) | scores, bps | `f64` | Features / reports | no | **yes** when feeds gates | **P1** / **A** |
| `src/state/tradability.rs` | `spread_now_bps` | `f64` | Tradability mirror | no | yes | **P1** |
| `src/db/margin_paper_trades.rs` | `entry_price`, `exit_price` | `f64` | DB row types | no | paper lane | **P2** |
| `src/export/parquet_cold.rs` | `price`, `qty` | `f64` | Export | no | no | **P3** |
| `src/observability/snapshots.rs` | PnL, positions | `f64` | Observability | no | no | **P3** |
| `src/ignition/store.rs` | `on_trade(price)` | `f64` | Ignition | no | yes if gates | **P1** |

*Exhaustive line-level f64: run `rg ': f64|\\bf64\\b' src/` and filter by directory.*

---

## 3. IMMEDIATE FIX TABLE (highest danger, smallest ambiguity)

| location | why dangerous now | exact replacement type | risk |
|----------|-------------------|------------------------|------|
| ~~`messages.rs` `TradeData` / `TickerData` / `ExecutionReport`~~ | **DONE** — migrated to `Decimal` via `de_decimal` RawValue deserializer | `Decimal` at serde boundary | Commits `3ead075`, `c2657ac`, `950bdd3` |
| ~~`auth_ws.rs` + `instruments.rs` wire quantize~~ | **DONE** — `Decimal` end-to-end; f64 only in final outbound struct (safe post-quantize) | `Decimal` | Commits `ed7d26b`–`ba0fd0e` |
| `protection_flow.rs` / `position_monitor.rs` / `exit_lifecycle.rs` | Internal arithmetic still f64; boundary conversions added | `Decimal` internally (Phase 3) | Medium — mitigated by Decimal quantize at boundary |
| `horizon_movers.rs` ring | Mixed float mid + Decimal L2 → inconsistent horizon state | `Decimal` in ring or fixed-point i128 | Medium |
| `live_runner.rs` L2 mid → `f64` for `sample_l2_mid` | Reintroduces float on hot path | `Decimal` or `rust_decimal` + horizon API change | Low–medium |
| `balance_cache.rs` balances as `f64` | Ghost exposure / reconcile errors | `Decimal` | Medium |

---

## 4. PHASED REFACTOR TABLE

| phase | target area | files (representative) | migration risk | validation method |
|-------|-------------|-------------------------|----------------|-------------------|
| **0** | Policy + inventory | this doc, cursor rule | none | Review |
| **1** | Exchange serde ingress (public + private) | `messages.rs`, `kraken_public.rs` | High | `cargo test`, live WS smoke, compare Decimal string to RawValue — **DONE** commits `3ead075`–`950bdd3` |
| **2** | Order construction + instruments | `auth_ws.rs`, `instruments.rs` + 15 callers | **Critical** | `cargo test`, live service restart, L2 checksum=0 — **DONE** commits `ed7d26b`–`ba0fd0e` |
| **3** | Execution core | `protection_flow.rs`, `position_monitor.rs`, `exit_lifecycle.rs`, `ignition_exit.rs`, `position_reconcile.rs`, `exposure_reconcile.rs` | **Critical** | Full execution proof, reconcile invariants |
| **4** | Sizing + risk + config comparisons | `sizing.rs`, `capital_allocator.rs`, `config/mod.rs` | High | Unit tests on boundaries, min notional |
| **5** | Horizon + tradability + mirror | `horizon_movers.rs`, `live_runner.rs`, `tradability.rs`, `horizon_mirror.rs` | Medium | Mirror row parity, selector latency |
| **6** | Analysis / route engine | `readiness_gate.rs`, `strategy_pipeline.rs`, `route_engine/*`, `analysis/*` | Medium | Golden tests on gate outcomes |
| **7** | Analytics / export | `export/*`, `observability/snapshots.rs` | Low | Report diff |

---

## 5. NO-GO TABLE (forbidden immediately for *new* code)

| Place | Rule |
|-------|------|
| L2 `OrderBook` internal maps / checksum payload | **No new `f64` fields**; state stays `Decimal` + string map for CRC |
| `l2_book_registry::L2BookSnapshot` | **No `f64`** — already `Decimal` |
| Any new Kraken book/trade/ticker serde struct | **No `f64` for price/qty** — use `RawValue`/`String`/`Decimal` |
| Private WS order JSON building | **No new f64** for price/qty/trigger; extend `Decimal` path |
| Fill → position update SSOT | **No new f64** for fill qty/price |
| Checksum validation branch | **No f64** on compared book state |

Legacy `f64` in the files listed in section 2 may remain **only until migrated**; do not copy that pattern into new modules.

---

## Maintenance

When you complete a phase, update section 2 (priority → OK or remove row) and note the commit range in the phase row.

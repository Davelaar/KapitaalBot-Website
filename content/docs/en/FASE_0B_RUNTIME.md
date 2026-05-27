# Fase 0B — VWAP, RouteStateStore, multi-regio TOD (feitelijke status)

Dit document beschrijft **hoe het in de code zit**: wiring, defaults, en wat je moet aanzetten in productie. Geen roadmap-taal — alleen traceerbare paden.

---

## 1. Samenvatting

| Onderdeel | Env-flag | Default | Status |
|-----------|----------|---------|--------|
| **Live VWAP-feed** | `ENABLE_VWAP_LIVE_FEED` | `false` | **Gebouwd en wired**: trades → buffer → `MarketFeatures.vwap_deviation_bps` → o.a. `vwap_reversion` thesis. Zonder flag: geen ticks, deviation altijd `None`. |
| **RouteStateStore** | `ENABLE_ROUTE_STATE_STORE` | `false` | **Gebouwd en wired**: store, Tier1 mid-tick driver, pipeline bridge, edgeboard bridge, timing selection logging, timing metrics snapshot task, `position_linkage` via monitor (`RouteStoreSlot` na bootstrap). Zonder flag: geen store, geen advisory. |
| **Ranking TOD (multi-regio)** | `ENABLE_RANKING_TOD` | `false` | **Gebouwd en wired**: `tod_multiplier(hour, weekday)` in `route_expectancy` op `time_adjusted_score`. Uur en weekdag komen uit **dezelfde** `Utc::now()`-snapshot in `market_features_from_row` (`utc_hour` / `utc_weekday`), dus geen midnight-mismatch. Asia / EU / EU+US / US / dead zone + weekend factor — zie `analysis/tod_multiplier.rs`. |

**Operationeel:** Fase 0B is **implementatie-klaar**; in `.env` staan de toggles typisch nog uit (`false`) tot je ze bewust aanzet voor live validatie.

---

## 2. VWAP wiring (detail)

**Pad**

1. `exchange/kraken_public.rs` — bij trade events: `vwap_buffer::record_trade(...)` (naast `trade_flow_window` en `horizon_movers`).
2. `exchange/vwap_buffer.rs` — als `enable_vwap_live_feed()` false is → `record_trade` is **no-op**; `vwap_deviation_bps_sync` → `None`.
3. `route_engine/market_features.rs` — `market_features_from_row` zet `vwap_deviation_bps` via `vwap_deviation_bps_sync(symbol, last_price)`.
4. `route_engine/move_thesis/vwap_reversion.rs` — gebruikt `features.vwap_deviation_bps`; zonder feed blijft effect beperkt / fallback-gedrag per implementatie.

**Extra env:** `VWAP_WINDOW_MS` (clamp 10s–30m), default5 minuten.

**Numeriek:** VWAP-buffer gebruikt `f64` op dit pad; canonical financial policy staat in `DECIMAL_F64_POLICY_AND_INVENTORY.md` (bekend trade-off op derived analytics buffer).

---

## 3. RouteStateStore activatie (detail)

**Pad (live execution)**

- `execution/live_runner.rs` — `bootstrap_live_preloop_runtime`: als `enable_route_state_store()` → `RouteStateStore::new()`, `install_tier1_subscriber`, edgeboard sync task, timing metrics snapshot, pipeline outcomes → `ingest_outcomes`, periodiek `timing_selection` logging waar geïmplementeerd.
- `execution/position_monitor.rs` — `RouteStoreSlot` (`OnceLock`) wordt **na bootstrap** gevuld met dezelfde `Arc` als de main loop → `position_linkage::lookup_route_context` / `advise_management` alleen nuttig als store **én** flag aan staan.

**Zonder flag:** geen store, slot blijft leeg, Tier1 niet geregistreerd — **geen** runtime-kosten van deze subsystemen.

---

## 4. Multi-regio TOD (detail)

**Twee lagen (bewust gescheiden)**

| Laag | Module | Doel |
|------|--------|------|
| **Ranking** | `analysis/tod_multiplier.rs` | Liquiditeit/tradability: schaalt `time_adjusted_score` in `route_expectancy.rs`. |
| **Move-thesis** | `route_engine/move_thesis/tod_overlay.rs` | Volatiliteitsvorm / amplitude van de move — **niet** hetzelfde als ranking-TOD. |

**Anti-double-counting:** In `route_expectancy.rs` wordt de ranking-`tod_multiplier` **niet** toegepast als `family_selected_for_dispatch == "tod_overlay"` (zie comment in `tod_multiplier.rs` en guard in expectancy).

---

## 5. Aanbevolen activatie-checklist (productie)

1. Stel env in op staging of korte live window:
   - `ENABLE_VWAP_LIVE_FEED=true` (alleen als je VWAP-reversion echt wilt voeden).
   - `ENABLE_RANKING_TOD=true`.
   - `ENABLE_ROUTE_STATE_STORE=true` (alleen na acceptatie van store-gedrag op volume).
2. Controleer logs: o.a. VWAP ticks, `TIMING_SELECTION_*`, `ROUTE_STATE_STORE_*`, `ROUTE_STORE_SLOT_FILLED`.
3. DB-pool discipline: execution/safety blijft **decision** — zie `AGENTS.md`.

---

## Zie ook

- [`01_ARCHITECTURE.md`](./01_ARCHITECTURE.md) — proces- en pool-overzicht.
- [`00_MODULE_INVENTORY.md`](./00_MODULE_INVENTORY.md) — modules `vwap_buffer`, `vwap_window`, `route_state/*`, `tod_multiplier`.

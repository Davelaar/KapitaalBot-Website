# 02_DATA_INGEST.md - Data Ingest and Market Data Layer

This document details how Krakenbot ingests market data and user-specific data from the Kraken exchange,
its internal processing, and the persistence mechanisms.

## WebSocket Feeds (Kraken v2)

Krakenbot primarily relies on WebSocket v2 for real-time data ingestion, minimizing latency and maximizing freshness.

### Public Market Data (`wss://ws.kraken.com/v2`)

-   **`ticker` channel**: Provides top-of-book (L1) bid/ask, last trade, and 24-hour volume. Used for high-level market overview and basic freshness checks. Updates are frequent.
-   **`trade` channel**: Delivers individual trade events. These are bundled into messages and provide the raw input for volume and price movement analysis.
-   **`book` channel (L2 Order Book)**: Provides aggregated order book snapshots and delta updates (up to 1000 depth). Critical for microstructure analysis and order placement. Updates are processed sequentially, and CRC32 checksums are validated to ensure data integrity. Mismatches trigger a resubscribe and full book rebuild.
-   **`ohlc` channel**: Open, High, Low, Close (OHLC) bar data for various intervals. Updates are driven by trade events.
-   **`instrument` channel**: Provides static instrument metadata (tick sizes, quantity increments, minimum order sizes, tradability status). This is the **Single Source of Truth (SSOT)** for order normalization and position actionability. The `exchange::instruments` module caches this data.

### Private Trading & User Data (`wss://ws-auth.kraken.com/v2`)

-   **`executions` channel**: Provides real-time updates on all order lifecycle events (new, partial fills, full fills, cancellations). This is the **SSOT for order lifecycle and fills**, superseding individual WS method responses.
-   **`balances` channel**: Delivers snapshots and delta updates of user balances. Used for position reconciliation and capital management.

### Authenticated L3 Order Book (`wss://ws-l3.kraken.com/v2`)

-   **`level3` channel**: Provides individual order-level data (raw bids/asks). This is a high-fidelity, high-volume feed that requires careful budget management (symbol count, rate limits).

## Internal Processing and Persistence

### `trade_samples`

Incoming trade data is processed to generate `trade_samples` which capture granular information about market activity, crucial for calculating volume-weighted metrics and identifying liquidity shifts.

### `l2_snap_metrics` and `l3_queue_metrics`

-   **`l2_snap_metrics`**: Derived from L2 order book snapshots, these metrics quantify various aspects of market depth and imbalance, serving as inputs for strategy signals.
-   **`l3_queue_metrics`**: Generated from L3 order book data, these capture very fine-grained insights into order queue dynamics and order flow pressure.

These metrics are typically stored in the `INGEST_DATABASE_URL` for later use by the strategy pipeline and for historical analysis.

### Run Lifecycle and Epoch Generation

Krakenbot operates within defined `run` lifecycles. Each run has an associated `epoch` which represents a specific period of market data and configuration context. Epochs are generated to ensure deterministic processing and backtesting capabilities.

-   **Run Lifecycle**: A `run` is an instance of the bot operating for a defined duration. During a run, data is ingested, processed, and trading decisions are made.
-   **Epoch Generation**: Epochs define time-bound segments for data. They are crucial for ensuring that a given set of input data produces consistent results across different analyses and for preventing look-ahead bias.

### Refresh Mechanisms

To maintain data freshness and system integrity, several refresh mechanisms are in place:

-   **Instrument Cache Refresh**: `exchange::instruments` periodically refreshes its cached instrument constraints to reflect any changes on the exchange.
-   **Balance Cache Refresh**: `exchange::balance_cache` is updated by the `balances` WS channel to ensure an up-to-date view of account holdings.
-   **Order Cache Refresh**: `exchange::own_orders_cache` is kept current by `executions` WS channel events to accurately track open orders and prevent stale state. This is vital for `exposure_reconcile`.
-   **Position Monitor Refresh**: The `position_monitor` periodically reloads its active position list from the DB to catch any discrepancies or external changes.

These mechanisms collectively ensure that the bot operates on the freshest possible data while maintaining a robust and consistent internal state.
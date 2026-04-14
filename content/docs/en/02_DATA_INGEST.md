# KapitaalBot — Data Ingest & Market Data

**[← 01 — Architecture](./01_ARCHITECTURE.md) · [03 — Strategy Pipeline →](./03_STRATEGY_PIPELINE.md)**

---

## What this document covers

How KapitaalBot receives, validates, and processes market data into usable state representations. The focus is on the principles behind the implementation, not the implementation itself.

---

## What is ingested

KapitaalBot receives four types of market data from the exchange:

**Ticker / L1 (top-of-book)**
The best bid and ask price, plus the most recent trade price. This is the basis for the price cache used as a fast reference by all decision paths.

**L2 orderbook**
Aggregated order depth at multiple price levels. Provides insight into liquidity, spread stability, and book imbalance. Requires continuous integrity verification via checksums.

**Individual trades**
Every executed trade with direction, price, and volume. Feeds volume analysis, trade density calculations, and the VWAP computation.

**L3 orderbook (authenticated)**
Individual orders per price level — not aggregated. Provides visibility into queue dynamics. Requires authentication and a separate connection endpoint.

---

## Integrity: L2 checksums

The L2 orderbook is particularly sensitive to errors: a single missed delta message corrupts the entire local book. KapitaalBot implements the official Kraken CRC32 checksum validation on every update.

```
Receive L2 delta
  → Apply delta to local book representation
  → Calculate checksum over top price levels
  → Compare with checksum from the exchange
  → Match: book is reliable → update metrics
  → No match: mark symbol as unreliable → resubscribe
```

A checksum mismatch has immediate consequences: the trading pair is temporarily marked as unreliable until a fresh full snapshot has been received and validated. New entries are blocked during this period. This is not a soft warning but a hard block.

**Why this matters**: the decision engine makes assumptions about spread width and liquidity depth based on the L2 book. A corrupted book leads directly to incorrect edge calculations. Checksum validation is the first line of defence.

---

## From raw data to state tables

Raw market data is never used directly by the decision engine. The ingest process transforms incoming messages into persistent samples:

- **Trade samples table**: every trade classified with direction, price, volume, and timestamp
- **L2 snap metrics**: periodic summaries of book imbalance and density
- **L3 queue metrics**: summaries of order queue positions at the best levels

These samples are periodically aggregated into a **consolidated state row per trading pair** (`run_symbol_state`). That state row is the input for the strategy pipeline. The pipeline never queries raw tables directly.

**Why this intermediate step?** Direct queries on raw data are too slow for the evaluation frequency the system requires. The state table also makes audit trails straightforward: you can always determine exactly which data a decision was based on.

---

## Runs and epochs

KapitaalBot segments its execution into `runs` and `epochs`:

**Run**: a process instance. Each time the system starts, a new run begins with a unique ID. All data is linked to a run ID, which simplifies forensics and data retention.

**Epoch**: a time window within a run. At the start of each epoch, the universe of trading pairs to follow is established based on current instrument data from the exchange. Trading pairs that do not meet the requirements (minimum trading volume, minimum order size) are excluded.

This structure ensures the system always knows which data a decision was based on, and that historical analysis remains traceable.

---

## WebSocket connection principles

The ingest layer connects via three types of WebSocket connections, each with distinct responsibilities:

**Public connection** — market data such as orderbooks, trades, and ticker. No authentication required.

**Authenticated private connection** — private orderbook data (L3) and live orders/fills. Requires a session token that is re-fetched on every reconnect.

**Reconnect policy**: on every reconnect, the session token is refreshed. Tokens are only valid for the duration of the active connection. On reconnect to the public orderbook, a complete new snapshot is requested before delta updates are processed.

---

*Next: [03 — Strategy Pipeline](./03_STRATEGY_PIPELINE.md)*

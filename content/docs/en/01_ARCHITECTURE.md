# KapitaalBot — System Architecture

**[← Index](./DOC_INDEX.md) · [02 — Data Ingest →](./02_DATA_INGEST.md)**

---

## What this document covers

The architectural principles of KapitaalBot: how the layers work together, how data flows through the system, and why the key design choices were made. This is not an implementation guide — it describes the system at the level needed to understand *what* it does and *why*.

---

## Three core principles

KapitaalBot is built on three principles that explain every architectural choice:

**1. State-first, not event-first**
The system never makes decisions directly from raw incoming market messages. It first builds a consolidated state representation per trading pair, then evaluates exclusively on that state. This prevents market data noise from propagating into trading decisions.

**2. DB-first, not in-memory-first**
The database is the authority for all decision-relevant state: which orders exist, which positions are open, which safety rules apply. In-memory caches are speed aids, not sources of truth.

**3. Observability by design**
The system is built to make its own behaviour transparent. Every decision — including decisions not to trade — is classified, reasoned, and stored.

---

## Layers

KapitaalBot consists of four logical layers with strict responsibilities:

```
Market data (exchange)
        ↓
  [ Ingest layer ]
  Receives, validates, and persists raw market data.
  Builds state tables per trading pair.
        ↓
  [ Strategy pipeline ]
  Detects market regimes. Selects strategy families.
  Estimates expected profit margin (edge) per candidate.
  Produces execution mandates.
        ↓
  [ Execution layer ]
  Manages the order lifecycle. Monitors open positions.
  Enforces protection through multiple layers.
        ↓
  [ Observability ]
  Logs funnel events, decision reasons, and outcomes.
  Exports snapshots to the observability website.
```

---

## Database topology

KapitaalBot uses three logically separated database roles. Each role has its own responsibility and is never combined with another:

| Role | Primary content |
|------|----------------|
| **Ingest** | Raw market data, orderbook metrics, state tables per trading pair |
| **Decision** | Orders, fills, positions, safety rules |
| **Research** | Forward-looking observations, microstructure snapshots for quality analysis |

This separation is not a design preference but an operational requirement: ingest load must not affect the latency of execution decisions, and execution decisions must not compromise the integrity of raw market data.

---

## Process model

The system runs as two independent long-running processes:

**Ingest process**
Continuously connects to the exchange via WebSocket connections. Processes market data and persists it in the ingest database. Runs independently of execution decisions.

**Execution process**
Periodically reads the state built up by the ingest process. Runs through the strategy pipeline. Executes trading decisions via the private WebSocket connection with the exchange. Writes decisions and outcomes to the decision database.

The decoupling between these two processes is deliberate: a problem in the ingest layer stops observation but does not immediately block the execution layer. Conversely, a problem in the execution layer does not impair data collection.

---

## Data flow overview

```
Exchange (public WebSocket)
  → Ingest process receives and validates
  → Ingest database (raw samples + consolidated state)
      ↓
Execution process reads state
  → Strategy pipeline evaluates
  → Mandate: execute / observe / block
      ↓ (on execute)
Exchange (private WebSocket)
  → Order placed
  → Fill received
  → Position updated in decision database
```

---

## Exchange connectivity

All communication with the exchange goes via WebSocket API v2. There are three logical connection types:

- **Public market data**: prices, orderbooks, trades — for the ingest layer
- **Private trading**: placing orders, receiving fills, monitoring balances — for the execution layer
- **Authenticated L3**: deeper orderbook data for maker strategies — for the ingest layer

REST calls are reserved exclusively for fetching authentication tokens for private connections. All trading interaction goes through WebSocket.

---

## Why these choices?

**WebSocket-first**: Lower latency than REST polling. Kraken-specific: the private WebSocket feed (`executions`) is the only reliable source for order updates.

**Dual-pool database**: Isolation of ingest load (high volume, continuous writes) from execution decisions (latency-critical, consistency-required).

**State-first evaluation**: Avoids reprocessing the same raw messages through multiple pipelines. Makes the system auditable: the state at any moment is fully reconstructible from the database.

---

*Next: [02 — Data Ingest](./02_DATA_INGEST.md)*

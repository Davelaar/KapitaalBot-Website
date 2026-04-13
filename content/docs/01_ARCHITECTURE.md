# 01_ARCHITECTURE.md - System Architecture

This document provides a high-level overview of the Krakenbot trading engine architecture,
its core components, data flow, database topology, and communication models.

## Module Map (High-Level)

The Krakenbot codebase is organized into several key modules, each with a distinct responsibility:

- `src/main.rs`: Entry point and main orchestration logic.
- `src/config`: Manages application configuration from environment variables.
- `src/db`: Database interaction layer (Postgres), including schema definitions, migrations, and data access.
- `src/exchange`: Handles all external exchange communication (Kraken), including WebSocket (WS) feeds and REST API calls (for authentication).
- `src/pipeline`: The core strategy pipeline, responsible for signal generation, route evaluation, and decision-making.
- `src/execution`: Manages order placement, position monitoring, and exit logic.
- `src/state`: State management and projection, including Redis interaction for MSP (Managed State Projection).
- `src/universe`: Manages the set of tradable symbols and instrument constraints.
- `src/observability`: Contains logging, metrics, and forward-return observability components.

## Data Flow (Ingest -> Pipeline -> Execution)

Krakenbot operates on a data-driven loop:

1.  **Ingest (Exchange Data)**: Market data (tickers, trades, L2/L3 order book) is ingested from Kraken via WebSocket v2 connections (`exchange::auth_ws`). Private user data (executions, balances) is also ingested via authenticated WS.
2.  **Preprocessing & Persistence**: Raw market data is preprocessed and persisted into the `INGEST_DATABASE_URL` for historical analysis and feature generation.
3.  **Strategy Pipeline (Decision)**: The `pipeline` module consumes processed market data and internal state to generate trading signals and evaluate potential routes. This involves complex algorithms for edge calculation, confidence scoring, and route selection. Decisions are often persisted into the `DECISION_DATABASE_URL` (e.g., `candidate_decision_vectors`).
4.  **Execution**: Based on the pipeline's decisions, the `execution` module interacts with the exchange to place orders, monitor open positions, and manage protection/exit strategies. This includes handling fills, amendments, and cancellations.
5.  **State Management & Observability**: Throughout the process, the `state` and `observability` modules maintain a consistent view of the bot's internal state (in-memory, Redis, DB) and emit logs and metrics for monitoring and diagnostics.

## Database Topology (INGEST, DECISION, RESEARCH)

Krakenbot uses a partitioned PostgreSQL database model to separate concerns and optimize performance:

-   **INGEST_DATABASE_URL**: Primarily used for storing raw and lightly processed market data. This is a high-throughput write-heavy database. Examples: `l2_snap_metrics`, `l3_queue_metrics`, ingest-side `observation_runs`.
-   **DECISION_DATABASE_URL**: Stores operational data related to trading decisions, orders, fills, and safety state. This database is critical for live execution and reconciliation. Examples: `symbol_safety_state`, `execution_orders`, `fills`.
-   **RESEARCH_DATABASE_URL**: Used for storing forward-return observability data and microstructure snapshots for post-hoc analysis and model calibration. This database is write-only for app data, read-heavy for research. Example: `krakenbot.directional_forward_observations`, `krakenbot.market_microstructure_snapshots`.

Separation ensures that ingest load does not impact execution latency and allows for independent scaling and data retention policies.

## WebSocket Connections

-   **Public Market Data (`wss://ws.kraken.com/v2`)**: Used for `ticker`, `book` (L2), `trade`, `ohlc`, `instrument` channels. Read-only, unauthenticated.
-   **Private Trading & User Data (`wss://ws-auth.kraken.com/v2`)**: Authenticated connection for `executions` and `balances` channels, and for sending trading requests (`add_order`, `amend_order`, `cancel_order`, etc.). Requires a token obtained via REST `GetWebSocketsToken`.
-   **Authenticated L3 (`wss://ws-l3.kraken.com/v2`)**: Dedicated authenticated connection for `level3` order book data. Requires the same token as private trading WS.

WebSocket connections are long-lived and reused to minimize overhead. Token rotation is handled automatically on reconnect for authenticated endpoints.

## Process Model

Krakenbot runs as a set of `systemd` services on the server, orchestrating various components:

-   `krakenbot-ingest.service`: Handles market data ingestion and writes to `INGEST_DATABASE_URL`.
-   `krakenbot-execution.service`: Contains the core trading logic, pipeline, position monitoring, and interacts with `DECISION_DATABASE_URL`.
-   `krakenbot-research.service`: (If separate) Handles specific research/observability writes to `RESEARCH_DATABASE_URL`.

Each service is designed to be fault-tolerant with restart policies. Communication between services and external components (like Redis for MSP) ensures a coherent view of the system state.
# 04_EXECUTION_ORDERS.md - Order Lifecycle and Execution

This document details how Krakenbot executes trading decisions, manages the order lifecycle,
and ensures reliable interaction with the Kraken exchange.

## Flow Poller and Flow Execution

The execution process is orchestrated by two main components:

-   **Flow Poller**: Periodically polls for new trading decisions from the strategy pipeline (persisted in the DB). It identifies actionable signals and initiates the execution flow.
-   **Flow Execution**: Manages the step-by-step execution of a trading decision. This includes validating constraints, allocating capital, and interacting with the exchange to place and manage orders.

## Order Placement (WebSocket v2)

Krakenbot uses Kraken's WebSocket v2 API for all trading actions to minimize latency and ensure real-time feedback.

-   **`add_order`**: Used to place new orders (market, limit, etc.).
-   **`amend_order`**: Allows for in-place modification of existing orders (e.g., updating price or quantity) while attempting to maintain queue priority.
-   **`cancel_order`**: Used to cancel individual open orders.
-   **`batch_add` / `batch_cancel`**: Support for processing multiple orders in a single request for improved efficiency.

All requests include a `req_id` for correlation and are routed through a request multiplexer.

## Order Lifecycle and Statuses

The `executions` WS channel is the **Single Source of Truth (SSOT)** for order status. Key statuses include:

-   `pending_new`: Order submitted but not yet acknowledged by the exchange.
-   `new`: Order acknowledged and active on the book.
-   `partially_filled`: Order has been partially executed.
-   `filled`: Order has been completely executed.
-   `canceled`: Order has been successfully canceled.
-   `expired`: Order has expired (e.g., due to a deadline).

Final order state is always derived from the `executions` channel, not just the WS method response.

## Fill Handling

Fill events (both full and partial) are processed in real-time:

-   **Position Updates**: Fills trigger updates to the bot's internal view of its positions (in-memory and DB).
-   **Protection Triggering**: Fills on entry orders immediately trigger the creation of associated protection orders (e.g., stop-loss, trailing-stop).
-   **Fill Feedback**: Information about fills (price, quantity, timing) is recorded for performance analysis and model calibration (`observability::fill_feedback`).

## Dead-Man's-Switch (`cancel_all_orders_after`)

For safety, Krakenbot utilizes Kraken's `cancel_all_orders_after` request. This acts as a dead-man's-switch: if the bot loses connection to the exchange and fails to renew this switch within a specified timeout, all open orders are automatically canceled by the exchange. This prevents orders from remaining active in an unmonitored state.

## `execution_orders` Table

All order-related data is persisted in the `execution_orders` table in the `DECISION_DATABASE_URL`. This includes:

-   `exchange_order_id`: The unique ID assigned by the exchange.
-   `cl_ord_id`: The client-side order ID used for correlation.
-   `symbol`, `side`, `order_type`, `quantity_base`, `limit_price_quote`.
-   `status`, `reason_code`, `strategy_context`.
-   Timestamps for creation and updates.

This table provides a complete audit trail of all trading activity and is critical for reconciliation and reporting.

The execution layer is designed for robustness and reliability, with extensive error handling and reconciliation mechanisms to ensure consistent operation even in the face of network issues or exchange anomalies.
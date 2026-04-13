# 07_OBSERVABILITY.md - Monitoring and Diagnostics

This document details the observability framework implemented in Krakenbot,
providing insights into system health, trading performance, and data integrity.

## Logging Taxonomy

Krakenbot uses a structured logging approach to ensure that logs are informative and easy to analyze.

-   **`info!`**: Used for significant system events (startup, shutdown, order placement, fills, position updates). These are essential for normal monitoring.
-   **`warn!`**: Indicates potential issues or unexpected conditions that require attention but don't necessarily halt operation (e.g., API errors, minor data delays).
-   **`error!`**: Critical failures that impact the bot's ability to trade or maintain state.
-   **`debug!`**: Detailed diagnostic information, primarily used for troubleshooting and during development. Many high-volume diagnostic logs are demoted to this level to reduce noise.

Logs are emitted using the `tracing` crate and can be directed to various outputs (stdout, files, journald).

## STANDARD_FUNNEL_COUNTERS

The bot maintains a set of standardized counters to track the flow of signals through the strategy pipeline and execution layer.

-   **Signals Generated**: Total number of potential trading signals produced.
-   **Signals Filtered**: Signals rejected due to risk limits, confidence thresholds, or other constraints.
-   **Orders Submitted**: Number of orders successfully sent to the exchange.
-   **Orders Filled**: Number of orders that resulted in a fill.

These counters provide a high-level view of the bot's "funnel" and help identify bottlenecks or inefficiencies.

## Forward-Return Observability

This component tracks the performance of trading signals over time, even if they weren't executed.

-   **`directional_forward_observations`**: Records the initial signal and its predicted direction.
-   **Finalization**: The system periodically "finalizes" these observations by comparing the predicted price move against the actual market movement over various time horizons.
-   **Calibration**: The resulting data is used to calibrate strategy models and improve the accuracy of future signals.

This data is stored in the `RESEARCH_DATABASE_URL`.

## Edgeboard Snapshots

The **Edgeboard** provides a real-time view of the strategy pipeline's internal state, including evaluated routes, edges, and confidence scores.

-   **Snapshots**: Periodic snapshots of the Edgeboard state are captured and persisted for analysis.
-   **Visualization**: (If applicable) Tools are available to visualize these snapshots, helping operators understand the bot's current decision-making process.

## Resource Telemetry

The bot monitors its own resource usage to ensure stable operation.

-   **CPU and Memory**: Tracks usage to identify potential performance issues or memory leaks.
-   **Database Latency**: Monitors the time taken for DB operations to identify bottlenecks.
-   **WebSocket Latency**: Tracks the round-trip time for WS messages to ensure data freshness.

## Fill Feedback

The `observability::fill_feedback` module records detailed information about every fill event.

-   **Execution Price**: The actual price at which the order was filled.
-   **Slippage**: The difference between the intended price and the actual execution price.
-   **Timing**: The time taken from order submission to fill.

This feedback is crucial for refining execution strategies and transaction cost models.

The observability framework is designed to provide a comprehensive and actionable view of Krakenbot's operation, enabling proactive monitoring, efficient troubleshooting, and continuous performance improvement.
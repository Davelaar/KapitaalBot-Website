# 03_STRATEGY_PIPELINE.md - Signal Generation and Strategy Pipeline

This document describes the core of Krakenbot's decision-making logic: the strategy pipeline.
It details how raw market data is transformed into actionable trading signals and routes.

## Route Engine and Move Thesis Dispatch

The **Route Engine** is responsible for evaluating potential trading opportunities across various symbols and time horizons. It acts as a central orchestrator for the strategy pipeline.

-   **Move Thesis Dispatch**: The engine dispatches "move theses" which are specific hypotheses about future price movements based on current market conditions. Each thesis is evaluated by one or more strategy families.
-   **Route Evaluation**: A "route" represents a specific execution path for a thesis (e.g., a specific symbol, entry side, and target horizon). The engine evaluates multiple routes in parallel to find the most promising opportunities.

## Market Features

Signals are generated based on a rich set of **Market Features**, which are derived from ingested market data:

-   **L2/L3 Metrics**: Imbalance, depth, and queue pressure metrics from the order book.
-   **Trade Dynamics**: Volume-weighted price movements, trade frequency, and liquidity flow.
-   **Price History**: Short-term and long-term price trends, volatility, and mean reversion indicators.
-   **Microstructure Snapshots**: Granular snapshots of market state at specific points in time, captured for research and calibration.

Features are normalized and combined to form the input for strategy models.

## Strategy Families

Trading logic is organized into **Strategy Families**, each with a specific focus or methodology:

-   **Momentum/Expansion**: Identifies and capitalizes on strong price trends and volatility expansions.
-   **Mean Reversion**: Targets price corrections after significant deviations from average values.
-   **Liquidity Flow**: Analyzes shifts in buying and selling pressure to anticipate price moves.
-   **Custom Families**: The system is designed to be extensible, allowing for the addition of new strategy families as needed.

Each family produces signals and associated metrics (edge, confidence) for its evaluated routes.

## Edge Computation and Route Expectancy

-   **Edge Computation**: An "edge" is a measure of the expected profit (in basis points, bps) for a given route, relative to the risk. It's calculated by comparing the predicted price move against transaction costs (fees, spread, slippage).
-   **Route Expectancy**: This is a broader measure that combines the edge with the probability of success. It represents the long-term expected value of taking a particular route.

The pipeline prioritizes routes with the highest positive expectancy and edge.

## Confidence Scoring

Each signal is assigned a **Confidence Score**, reflecting the model's certainty about its prediction.

-   **Confidence Calculation**: Confidence is derived from various factors, including the strength of the underlying features, the consistency of signals across different strategy families, and historical performance metrics for similar market conditions.
-   **Impact on Execution**: Confidence scores are used to filter signals and adjust position sizing. Higher confidence signals may lead to larger positions or more aggressive execution.

## Decision Persistence

Final trading decisions, including the selected routes and their associated metrics, are persisted into the `DECISION_DATABASE_URL` (e.g., `candidate_decision_vectors`). This allows for detailed post-hoc analysis and performance monitoring.

The strategy pipeline is a continuous process, constantly evaluating the market and updating its decisions as new data arrives. It's designed for high performance and low latency to ensure that the bot can react quickly to changing market conditions.
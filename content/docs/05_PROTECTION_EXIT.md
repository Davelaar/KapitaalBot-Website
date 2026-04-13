# 05_PROTECTION_EXIT.md - Position Management and Exit Strategies

This document details how Krakenbot manages open positions, places protection orders,
and handles various exit scenarios to ensure profitability and limit risk.

## Protection Placement (TSL, SL, TP)

Once a position is opened, the bot immediately places protection orders to manage the downside and lock in profits.

-   **Stop-Loss (SL)**: A static price trigger that exits the position if the price moves against it. Used as a primary safety net.
-   **Trailing-Stop (TSL)**: A dynamic stop-loss that moves with the price as it moves in a favorable direction. This allows for capturing larger gains while still providing protection.
-   **Take-Profit (TP)**: A target price at which the bot will exit the position to realize gains. This can be implemented as a limit order or a market exit.

The choice of protection type and its parameters (distance, trigger price) is determined by the strategy pipeline and the specific characteristics of the trade.

## Trailing Stop Logic

The trailing stop logic is designed to be adaptive:

-   **Tightening Curve**: As the price moves in favor of the position, the trailing distance can be tightened to lock in more profit.
-   **ATR-Based Trailing**: Trailing distances can be calculated based on Average True Range (ATR) to account for market volatility.
-   **Breakeven Activation**: Once a certain profit threshold is reached, the stop-loss is moved to the entry price (breakeven) to ensure the trade doesn't turn into a loss.

Tightening is handled via `amend_order` requests to the exchange.

## Exit Scenarios

The bot employs several exit strategies to handle different market conditions:

-   **Hard Loss Cap (1%)**: A non-negotiable exit trigger. If a position's loss exceeds 1%, it is immediately exited at market price. This is a critical safety guard.
-   **Stale Position Exit**: If a position's price has not moved significantly within a defined window (e.g., 5 minutes) and the position is in a loss, it is exited at market. This prevents capital from being tied up in non-performing trades.
-   **15-Minute Regime Shift**: Positions held longer than 15 minutes are subject to a regime shift exit. If losing, they are exited at market. If profitable, the trailing stop is aggressively tightened to lock in gains.
-   **Route-State Advisory**: The strategy pipeline can provide real-time advice to exit or tighten protection based on decaying edge or changing market conditions.

## Recovery Mechanisms

To handle edge cases and exchange anomalies, several recovery paths are implemented:

-   **Orphan Recovery**: Detects positions that exist on the exchange but lack associated protection orders in the bot's DB. The bot will attempt to place a trailing-stop protection on these "orphans".
-   **Top-Up Recovery**: If an exit or protection order fails because the position size is slightly below the exchange's minimum base quantity, the bot can perform a "top-up" buy to reach the minimum size and then immediately place protection. This is a strictly controlled technical recovery path.

## Position Monitor

The `position_monitor` is a background task that continuously evaluates all open positions against current market prices and applies the exit and protection logic described above. It ensures that all positions are actively managed and protected at all times.

These strategies collectively ensure that Krakenbot can effectively manage its risk and capitalize on profitable opportunities while maintaining a robust and resilient operation.
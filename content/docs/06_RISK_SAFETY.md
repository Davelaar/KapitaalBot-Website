# 06_RISK_SAFETY.md - Risk Management and Safety Guards

This document details the various layers of risk management and safety guards implemented in Krakenbot
to protect capital and ensure stable operation.

## Capital Allocator

The **Capital Allocator** is responsible for managing the bot's overall exposure and ensuring that individual trades and total positions remain within defined limits.

-   **Exposure Limits**: Sets maximum notional limits for individual symbols and for the entire portfolio.
-   **Slot Management**: Controls the number of concurrent open positions (slots) to ensure diversification and prevent over-concentration.
-   **Dynamic Sizing**: Adjusts position sizes based on signal confidence, market volatility, and available capital.

## Exposure Reconcile

The `exposure_reconcile` module ensures consistency between the bot's internal view of its positions and the actual state on the exchange.

-   **Startup Reconciliation**: Runs on boot or reconnect to detect any discrepancies and trigger necessary protection or recovery actions.
-   **Periodic Checks**: Lightweight periodic checks to identify and resolve mismatches between DB-tracked positions and exchange balances.
-   **Dust Handling**: Identifies and manages "dust" positions (sizes below exchange minimums) to prevent them from interfering with normal operation.

## Symbol Safety State and Execution Lock

-   **Symbol Safety State**: Tracks the operational status of each symbol (e.g., `normal`, `exit_only`, `hard_blocked`). Certain conditions (like recent errors or large drawdowns) can move a symbol into a restricted state.
-   **Execution Lock**: A mechanism to prevent duplicate or conflicting actions on a symbol. A lock is acquired before initiating a new entry or exit and released once the action is complete or confirmed. This prevents "race conditions" and ensures orderly execution.

## Circuit Breakers and Drawdown Caps

-   **Circuit Breakers**: Automated triggers that halt trading for specific symbols or the entire bot if certain risk thresholds are exceeded (e.g., excessive error rates, extreme price volatility).
-   **Drawdown Cap**: A global safety guard that stops all new entries if the total portfolio drawdown exceeds a predefined limit. This protects against catastrophic losses during periods of poor performance.

## Consistency Watchdog

The **Consistency Watchdog** is a background task that monitors the overall health and integrity of the system.

-   **Data Freshness**: Checks that market data feeds and internal caches are up-to-date.
-   **Order Integrity**: Verifies that all open orders on the exchange are accounted for in the bot's DB and vice versa.
-   **Process Monitoring**: Ensures that all critical services and background tasks are running as expected.

Any detected inconsistencies trigger alerts and, if necessary, automated remediation actions.

These risk management and safety layers are designed to be multi-faceted and redundant, providing a robust defense against market volatility, exchange issues, and internal software errors. Safety is the highest priority in Krakenbot's design.
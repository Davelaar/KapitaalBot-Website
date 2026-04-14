# KapitaalBot — Investor Overview

**[← Index](./DOC_INDEX.md) · [13 — Investor Risk Report →](./13_INVESTOR_RISK_REPORT.md)**

---

> **Notice**: This document is purely informational. It contains no investment advice, no return guarantees, and no invitation to invest. All claims in this document are technically defensible from the source code and system behaviour.

---

## Summary

KapitaalBot is an autonomous algorithmic trading system operating on spot markets at Kraken. The system combines regime detection, multi-strategy selection, and layered risk protection in a fully observable runtime.

The purpose of this document is to provide insight into the technical architecture, risk approach, and operational state of the system — without marketing language and without claims that cannot be verified from the system itself.

---

## What the system is

KapitaalBot is a **research and trading engine** with the following demonstrable properties:

**Fully autonomous**: the system makes decisions without human intervention. An operator can start, stop, and configure the system, but all trading decisions are made entirely algorithmically.

**Multi-regime**: the system detects five market regimes (trend, range, high volatility, low liquidity, chaos) and adapts its strategy selection to the detected regime.

**Multi-strategy**: eleven strategy variants, grouped into six families, are assessed per trading pair and per evaluation cycle. Selection is deterministic and fully documented.

**DB-first**: the database is the source of truth for all decision-relevant state. In-memory caches are tools, not authorities.

**Observable by design**: every decision — including decisions not to trade — is classified, reasoned, and stored. The observability website provides public and tiered access to aggregated information.

**Exchange-specific**: the current implementation is exclusively focused on spot markets at Kraken via WebSocket API v2.

---

## What the system is not

**Not a backtest-optimised system**: strategies are designed from market structure principles, not fitted to historical data.

**Not a black box**: the system is deliberately designed to explain its own behaviour. Every trading decision has a machine-readable reason.

**Not a calculator for expected returns**: this document contains no return claims, no simulation results, and no forecasts. Algorithmic trading in crypto spot markets carries real risks of capital loss.

**Not a product for end clients**: KapitaalBot is a proprietary trading system, not a managed fund or retail product.

---

## Architecture overview

The system consists of four layers:

| Layer | Primary function |
|-------|----------------|
| **Ingest** | Receive, validate, and persist market data via WebSocket connections |
| **Strategy pipeline** | Regime detection, strategy activation, edge estimation, mandate production |
| **Execution** | Manage order lifecycle, monitor positions, enforce protection |
| **Observability** | Log decisions, measure outcomes, export snapshots |

The architecture is built on the principle of strong separation: ingest load does not affect execution latency, and execution decisions do not affect the integrity of market data.

---

## Risk management

The system implements risk management at four levels:

**Position level**: every open position always has an active protective stop on the exchange. Exit policy is pre-committed at entry.

**Symbol level**: every trading pair has a safety status (normal / exit-only / blocked). Unreliable market data or abnormal execution automatically leads to restrictions.

**Portfolio level**: limits on total exposure and the number of simultaneously open positions.

**System level**: circuit breakers on error rates, stale data, and global loss limits. Dead man's switch at the exchange for protection against system failure.

---

## Operational infrastructure

The system runs as two systemd services on a dedicated Linux server:
- **Ingest service**: continuous data collection
- **Execution service**: strategy evaluation and trading

All code is version-controlled via Git. Every runtime execution is traceable to a specific commit hash. Deployment always requires a Git pull; direct server modifications are architecturally forbidden.

---

## Observability and transparency

A distinguishing feature of KapitaalBot is its explicit observability. The public website (kapitaalbot.nl) displays aggregated system information without account-sensitive data or reproduction information:

- Current system status, regimes, and strategy distribution
- Why-no-trade analysis: why specific trading pairs were not traded
- Execution quality metrics (Tier 2, on request)
- Historical funnel analysis

---

## What investors are buying

This is an investment in the **further development and scaling** of the system, not in a proven profitable strategy. What is concretely available:

- Working, live trading engine
- Full observability infrastructure
- Documented architecture and design principles
- Actively maintained codebase (Rust)

What is **not** available as evidence:
- Audited financial results
- Formal backtesting infrastructure
- Track record across varying market conditions
- Third-party validation

---

*See also: [13 — Investor Risk Report](./13_INVESTOR_RISK_REPORT.md)*

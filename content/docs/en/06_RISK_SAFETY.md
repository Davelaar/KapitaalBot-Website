# KapitaalBot — Risk & Safety

**[← 05 — Protection & Exit](./05_PROTECTION_EXIT.md) · [07 — Observability →](./07_OBSERVABILITY.md)**

---

## What this document covers

The risk and safety layer of KapitaalBot: how the system protects capital against market failure, exchange outages, and unexpected system behaviour. Safety is organised hierarchically, from portfolio level down to individual trading pair.

---

## Safety hierarchy

```
Portfolio level (global)
  └─ Maximum total loss within a time window
  └─ Maximum total market exposure

Trading pair level (per symbol)
  └─ Maximum exposure per symbol
  └─ Safety status (normal / exit-only / hard blocked)

Order level (per decision)
  └─ Spread too wide relative to stop?
  └─ Fill probability too low?
  └─ Execution mandate coherent?
```

Every layer can block a decision. A green light at portfolio level does not automatically grant permission at symbol level.

---

## Safety status per trading pair

Every trading pair has a permanent safety status in the database:

| Status | Meaning |
|--------|---------|
| **Normal** | Fully active; new entries and exits are permitted |
| **Exit-only** | No new entries; existing positions are protected and closed |
| **Hard blocked** | All actions blocked; no trading, no protection adjustments |

A trading pair can enter a more restricted status through multiple mechanisms:
- unreliable L2 orderbook (checksum failure)
- abnormal slippage on recent fills
- external trigger from the watchdog
- manual override by the operator

Transition to a less restrictive status requires that the triggering condition is no longer present.

---

## Capital allocation

The system actively manages how much capital is deployed at any time:

**Slot management**: the maximum number of simultaneously open positions is capped. If all slots are occupied, new candidates are blocked regardless of their quality.

**Exposure limits**: the total market value of all open positions is capped, both per trading pair and across the whole portfolio. No individual trading pair can ever take more than a certain percentage of total capital.

**Size calibration to quality**: position size is scaled based on estimated edge and fill probability. Higher quality justifies larger position size — but always bounded by absolute limits.

---

## Exposure reconciliation

The system regularly verifies that its internal records match reality on the exchange:

**At startup**: all balances and open orders are synchronised with the exchange before the first trading decision is made.

**Periodically**: the system checks whether positions recorded internally as open are actually still open on the exchange. Positions that are closed on the exchange but still shown as open internally are cleaned up.

**Ghost lock prevention**: this is the scenario where the system keeps a slot occupied for a position that has already been closed. Without reconciliation, this would result in less available capacity than actually exists.

---

## Circuit breakers

When abnormal system behaviour is detected, breakers are automatically triggered:

**Error rate**: if a significant fraction of API requests fail, the system stops opening new entries.

**Global loss**: if the cumulative loss over a time window reaches a limit, the system switches to exit-only mode.

**Stale data**: if the price cache or the L2 orderbook has not received updates for longer than a threshold, new entries are blocked. Decisions based on stale data are unreliable.

---

## Consistency watchdog

A background process continuously monitors consistency between the ingest database and the decision database:

- Are the two processes (ingest and execution) running on the same epoch?
- Are there positions or orders that are contradictory between the two databases?
- Are there trading pairs where the decision data is older than expected?

On detected inconsistency:
1. The affected trading pair enters exit-only mode
2. An alert is sent
3. The recovery action is logged

This is the protection against the "split-brain" scenario: where the execution engine makes decisions based on data that no longer reflects the actual market.

---

## What the system cannot prevent

Honesty about limitations is part of a transparent architecture:

- **Flash crashes and extreme gapping**: a price can move through a stop in milliseconds before the exchange can execute it
- **Exchange outages**: if the exchange is unreachable, protective stops cannot be updated; the dead man's switch provides a time-bounded backstop
- **Unknown correlations**: the system treats trading pairs individually; systemic market shocks affecting multiple pairs simultaneously are not handled differently from individual shocks

---

*Next: [07 — Observability](./07_OBSERVABILITY.md)*

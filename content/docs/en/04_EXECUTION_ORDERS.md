# KapitaalBot — Execution & Order Lifecycle

**[← 03 — Strategy Pipeline](./03_STRATEGY_PIPELINE.md) · [05 — Protection & Exit →](./05_PROTECTION_EXIT.md)**

---

## What this document covers

How KapitaalBot turns a trading decision into an order on the exchange, and how the full lifecycle of that order is tracked. The emphasis is on reliability and traceability.

---

## From decision to order

The strategy pipeline produces execution mandates. The execution system converts those mandates into actions:

```
Mandate (Execute)
  ↓
Candidate placed in a priority queue
  ↓
Execution choke checks safety conditions
  ↓ (green light)
Order created in the database (status: pending)
  ↓
Order sent via private WebSocket
  ↓
Exchange confirms receipt (ACK)
  ↓
Exchange sends status updates: open, partially filled, filled, cancelled
  ↓
Database updated on every status transition
```

Important: the order exists in the database *before* it is sent to the exchange. If the system restarts at any point, the order state is always reconstructible from the database.

---

## The executions feed as source of truth

The WebSocket acknowledgement on a placed order is only an ACK — a confirmation that the exchange received the request. The actual status (open, filled, cancelled) comes exclusively via the `executions` feed.

This distinction is critical: a positive ACK does not mean an order has been filled. The system waits for explicit status messages via the executions feed before updating its internal state.

---

## Order state machine

Orders move through a fixed sequence of states. Every transition has a reason and is logged:

```
[created] → [sent to exchange] → [open on the exchange]
  → [partially filled] → [fully filled]
  → [cancelled]
  → [rejected by exchange]
  → [expired]
```

Every state is documented. There are no implicit transitions. An order that is no longer in an active state always has a final state with a reason.

---

## Execution intent

KapitaalBot makes an explicit distinction between three execution intents:

| Intent | Description |
|--------|-------------|
| **MakerEntry** | Limit order at or near the best price; providing liquidity |
| **TakerEntry** | Order that immediately crosses with existing supply in the book; taking liquidity |
| **TakerExit** | Exit via a market order; priority is speed, not price |

The intent determines what type of order is placed and how the exchange will process it.

---

## Fill processing

When an order is (partially) filled, a coordinated sequence of actions begins:

1. The fill is recorded in the fills table
2. The net position is updated
3. For entry fills: protection is immediately activated (see [05 — Protection & Exit](./05_PROTECTION_EXIT.md))
4. For closing fills: realised PnL is calculated

Fill processing is **idempotent**: if the same fill message arrives twice (which can happen during reconnects), the duplicate is detected and ignored. No double-booking occurs.

---

## Dead man's switch

The system maintains a safety automaton at the exchange: if the bot stops sending a renewal signal, all open orders are automatically cancelled by the exchange after a configured time window.

This protects against situations where the system crashes, loses connectivity, or otherwise becomes unreachable while orders are open. The exchange then takes initiative to clean up orders — no operator action is required.

---

## Concurrency management

The system can evaluate and execute multiple trading pairs simultaneously. For each trading pair, however, one concurrency constraint applies: two evaluation cycles cannot simultaneously try to open an order for the same trading pair. A per-symbol safety lock prevents race conditions.

---

## Traceability

Every order is fully traceable:

- **Creation time**: when the decision was made
- **Submission time**: when the order was sent to the exchange
- **Acknowledgement time**: when the exchange confirmed receipt
- **Fill time**: when execution occurred
- **Reason**: why each type of order was chosen

This enables forensic analysis after the fact: every action is traceable to a specific decision moment.

---

*Next: [05 — Protection & Exit](./05_PROTECTION_EXIT.md)*

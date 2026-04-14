# KapitaalBot — Protection & Exit

**[← 04 — Execution](./04_EXECUTION_ORDERS.md) · [06 — Risk & Safety →](./06_RISK_SAFETY.md)**

---

## What this document covers

How KapitaalBot protects and closes open positions. Protection is not an afterthought — it is an integral part of every trading decision: exit policy is committed at the time of entry, not retroactively.

---

## The principle: protection is not optional

An open position without protection is architecturally forbidden. The system provides an explicit guarantee: every open position always has an active protective stop on the exchange. If that protection is absent for any reason, it is immediately restored.

This is not a policy rule but a hard system property: the state machine for open positions has no state that permits "open without protection."

---

## Protection layers

### Initial stop
Placed immediately after a successful entry fill. Protects against immediate adverse movement. The stop distance is strategy-dependent and is part of the execution mandate.

### Breakeven trigger
Once a position has accumulated sufficient profit, the stop is moved to the entry price. From that point, the maximum loss on this position is zero (excluding fees and slippage).

### Trailing stop
The primary method for locking in profit on favourable moves. The stop "travels with" the price in the favourable direction but does not move back on adverse movements.

The width of the trailing stop is calibrated to market conditions at the time of entry. A volatile instrument needs a wider trail to absorb noise; a stable instrument can use a tight trail.

### Profit target
For certain exit policy types, a fixed profit target is used. When the price reaches that target, the position is actively closed — either via a limit order (maker exit) or directly via a market order.

### Time limit
Every position has a maximum duration. If a position is still open after that time, it is automatically closed. This prevents positions from being "forgotten" in the system.

### Panic exit
If the loss on a position reaches a critical threshold higher than the initial stop, an emergency exit is triggered. This is a backstop for situations where the normal stop was bypassed — for example, by extreme market movements.

---

## Exit scenarios

The system recognises multiple path types for closing positions:

**Planned path**
The position is closed via the pre-committed exit policy: the trailing stop or profit target has been reached, or the time limit has expired.

**Safety path**
An external safety rule triggers exit: the maximum loss has been reached, or the system detects that market conditions have changed significantly relative to the entry.

**Recovery path**
A technical issue has left the position without associated protection. The system detects this at startup or during periodic checks and restores protection immediately.

---

## Orphan detection

At startup, the system checks whether there are positions on the exchange without associated protection in the database. Such "orphan" positions are immediately protected: the bot places a protective stop without waiting for a new signal cycle.

This scenario can occur after a crash or connectivity failure. The system is designed to handle this robustly.

---

## Dust recovery

A position can become technically uncloseable if its size falls just below the exchange's minimum order size — a situation that arises from partial fills or rounding differences. In that case, the system can make a minimal top-up to make the position closeable.

This is exclusively a technical recovery path. It is not position averaging or buying into a losing position as a defensive strategy.

---

## Why this design?

**Protection is pre-committed**: exit policy is locked in at the time of entry. This eliminates situations where a losing position is held because "the market will come back."

**Layered protection**: multiple independent mechanisms (stop, trailing, panic exit, time limit) ensure there is always an exit, even if one mechanism fails.

**Exchange-side stops**: the primary protection lives on the exchange, not only in the bot. If the bot becomes unreachable, protection is still active.

---

*Next: [06 — Risk & Safety](./06_RISK_SAFETY.md)*

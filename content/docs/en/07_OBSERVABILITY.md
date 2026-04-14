# KapitaalBot — Observability & Diagnostics

**[← 06 — Risk & Safety](./06_RISK_SAFETY.md) · [08 — Operations →](./08_OPERATIONS.md)**

---

## What this document covers

How KapitaalBot makes its own behaviour transparent. Observability is not a byproduct but a core function: the system is designed to be auditable, even for an external party that does not have access to the source code.

---

## What observability means in KapitaalBot

Observability here means: the ability to reconstruct *why* the system made a specific decision — or chose not to — at any point in time.

This includes:
- making rejection reasons visible (why-no-trade)
- storing all decision inputs at every evaluation
- measuring outcomes against expectations
- exporting aggregated information to an external website

What observability does *not* include: publishing implementation details, exact parameter values, or reproduction information.

---

## The trading funnel

The system tracks where signals drop off in the decision chain. This is called the "funnel":

```
Signals generated per trading pair (universe)
  ↓ Readiness check: is this pair ready to evaluate?
    → No: reason logged (e.g. stale data, unsafe mode)
  ↓ Strategy pipeline: which strategy, what edge?
    → No edge: reason logged
  ↓ Risk gate: is there capital capacity and safety permission?
    → No: reason logged
  ↓ EXECUTION
```

Every blockage at every layer is classified with a machine-readable code. The trading funnel makes it possible to analyse where most candidates drop off and whether that pattern changes over time.

---

## Decision vectors

Every serious candidate — including non-executed ones — is stored as a full decision vector (CDV). This contains:

- the market properties at the moment of decision
- the detected regime
- the strategy activation with scores and rejections
- the edge estimate and fill probability
- the mandate decision and reason

This enables two types of analysis:

**Direct audit**: for a specific trade or non-trade, everything is traceable to the data the decision was based on.

**Statistical quality analysis**: by comparing decision vectors with actual outcomes, it can be measured whether edge estimates are accurate.

---

## Forward observations

To measure signal quality — even for signals that were not executed — the system logs forward-looking observations:

Every time the pipeline sees a strong signal, it records what the price subsequently did over multiple time horizons. This produces the "markout curve": a statistical picture of whether signal timing has had an edge.

This data is stored in a separate research database and forms the basis for quality reporting.

---

## Edgeboard

The edgeboard is a real-time overview of the strongest candidates per trading pair. It shows which pairs have the most likelihood of reaching execution, based on current market conditions.

The edgeboard is not a signal feed — it is a diagnostic tool that provides insight into the current state of the market from the system's perspective.

---

## Slippage measurement

After every fill, the system measures slippage: the difference between the intended and actual execution price.

Systematic slippage (consistently worse than expected) is a signal that the cost modelling needs adjustment. The system uses slippage data to refine edge calculations.

---

## Observability tiers for external users

KapitaalBot exports snapshots to the observability website. There are three access levels:

| Tier | Available to | What is visible |
|------|-------------|----------------|
| **Tier 1** | Public | Aggregated status, regimes, strategy distribution, trade counts |
| **Tier 2** | On request | Deeper diagnostics: execution quality, latency histograms, funnel analysis |
| **Tier 3** | Internal | Full lifecycle telemetry, forensic data, account-specific information |

The separation is deliberate: public observability provides technical transparency without releasing reproduction information or account-sensitive data.

---

## Logging structure

The system uses structured logging with four levels:

- **ERROR**: critical failures requiring action
- **WARN**: unexpected situations to be monitored
- **INFO**: important lifecycle events (order placed, fill received, position closed)
- **DEBUG**: high-volume diagnostics for detailed analysis

Logs are machine-readable. Every log message consistently contains the relevant context (trading pair, run ID, strategy, reason).

---

*Next: [08 — Operations](./08_OPERATIONS.md)*

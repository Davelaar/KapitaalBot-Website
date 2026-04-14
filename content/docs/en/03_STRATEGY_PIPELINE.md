# KapitaalBot — Strategy Pipeline

**[← 02 — Data Ingest](./02_DATA_INGEST.md) · [04 — Execution →](./04_EXECUTION_ORDERS.md)**

---

## What this document covers

How KapitaalBot goes from market data to a trading decision. The pipeline is the "thinking layer" of the system. This document describes the steps and the reasoning behind them — no exact formulas or threshold values.

---

## Pipeline overview

The strategy pipeline is a sequence of decision filters applied to every trading pair at each evaluation cycle:

```
Consolidated state row per trading pair
  ↓
Calculate market properties
  (spread, volatility, drift, liquidity)
  ↓
Classify market regime
  (what type of market is this right now?)
  ↓
Activate strategy
  (which strategy fits this regime?)
  ↓
Select entry route
  (maker or taker? what type of execution?)
  ↓
Attach exit policy
  (what protection belongs to this strategy?)
  ↓
Evaluate mandate
  (bring it together: execute, observe, or block)
```

Every step is traceable: the reason for each decision — including rejections — is stored.

---

## Step 1: Market properties

Before a strategy decision is possible, the relevant properties of the trading pair are calculated:

- **Spread and spread stability**: how wide is the spread, and is it stable or variable?
- **Volatility**: how large are recent price movements?
- **Drift and directional consistency**: is the price moving consistently in one direction across multiple time horizons?
- **Trade density**: how active is this trading pair right now?
- **Acceleration**: is price movement increasing or decreasing?

These properties are the input for all subsequent steps. They are not stored as absolute numbers but as signals that drive strategy selection.

---

## Step 2: Market regime

The system classifies each trading pair into one of five market regimes:

| Regime | Brief description |
|--------|------------------|
| **Trend** | Clear directional price movement with high trading activity |
| **Range** | Stable spread, low price movement, consolidation |
| **High volatility** | Strong price movements without the extreme character of chaos |
| **Low liquidity** | Thin orderbooks, low trading activity |
| **Chaos** | Extreme spreads or extreme price movements; further divided into directional and noise |

The regime determines which strategy families are eligible and what weight they receive in the selection. A strategy that works well in a trending market can be counterproductive in a range market.

---

## Step 3: Strategy activation

KapitaalBot has eleven specific strategy variants, grouped into six families:

| Family | Description |
|--------|-------------|
| **Breakout** | Moving with an accelerating price movement that breaks through a level |
| **Momentum** | Following a sustained directional move, or anticipating its fade |
| **MeanReversion** | Anticipating return to an equilibrium level after a temporary overshoot |
| **Maker** | Passively providing liquidity via limit orders at the best price |
| **Volatility** | Capturing accelerated moves in high-volatility regimes |
| **Liquidity** | Specific to low-liquidity conditions with characteristic trade density |

For each trading pair, all eleven variants are evaluated. Each variant that does not qualify is rejected with a machine-readable reason. Exactly one variant is selected — always with justification.

**Why explicit rejections matter**: the system logs not only *what* was selected but also *why* other options were rejected. This makes it possible to analyse why the system did not trade in specific market conditions.

---

## Step 4: Entry route selection

After a strategy is selected, the pipeline determines how the entry is executed:

- **Maker routes**: limit order at or just ahead of the best price. Lower transaction costs, risk of non-execution if the market moves.
- **Taker routes**: market order that crosses immediately with existing supply. Higher cost, higher execution certainty.
- **Hybrid routes**: start as maker, fall back to taker if the order is not filled within a time limit.

Route selection is strategy-dependent: a breakout strategy requires fast execution and typically chooses taker. A maker strategy is by definition a limit order.

For every route, the estimated fill probability is also calculated. An excessively low fill probability blocks the entry, even if all other criteria are met.

---

## Step 5: Exit policy

Every executable mandate contains pre-committed exit policy. There are ten exit policy variants, each tailored to the associated strategy and entry route:

The core of every exit policy consists of:
- an **initial stop** (protects against immediate adverse movement)
- optional **trailing stop** (locks in profit on favourable movement)
- optional **profit target** (for strategies with a clear price target)
- a **time limit** (automatically exits a position that has been open too long)

Exit policy is not chosen after a position is open — it is part of the execution mandate. This prevents position management decisions from being influenced by emotion or the current situation.

---

## Step 6: Mandate evaluation

The mandate brings all previous steps together into a single decision:

- **Execute**: all criteria met, coherent policy chain, positive edge — order is placed
- **Observe**: one or more criteria not met (e.g. fill probability too low, spread too close to stop, emergency condition in exit policy) — candidate is stored but not executed
- **Block**: fundamental contradiction in the policy chain — candidate is blocked

The mandate makes it visible why a specific trading pair at a specific moment was not executed. This is the core of why-no-trade observability.

---

## Candidate decision vector (CDV)

Every serious candidate — including non-executed ones — is stored as a **Candidate Decision Vector**. This contains all inputs (market properties, regime, strategy scores) and outputs (edge estimate, mandate decision, reason).

The CDV enables two things:
1. **Audit**: reconstruction of any decision after the fact
2. **Quality analysis**: comparison of the expected edge with what actually happened

---

*Next: [04 — Execution & Orders](./04_EXECUTION_ORDERS.md)*

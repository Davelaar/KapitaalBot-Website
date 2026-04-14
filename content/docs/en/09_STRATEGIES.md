# KapitaalBot — Strategy Families

**[← 08 — Operations](./08_OPERATIONS.md) · [Index →](./DOC_INDEX.md)**

---

## What this document covers

The six strategy families KapitaalBot uses. This document describes *what* each family tries to achieve and *in which market conditions* it applies. No exact thresholds, no implementation details.

---

## How strategy selection works

KapitaalBot has eleven specific strategy variants, grouped into six families. At each evaluation cycle, all eleven variants are assessed for every trading pair. Each variant that does not qualify is rejected with a machine-readable reason. Exactly one variant is selected — or the result is "no opportunity" if no variant qualifies.

Selection is based on three factors:
1. The detected market regime
2. Current market properties (drift, spread, liquidity, volatility)
3. Regime weights that indicate how suitable a strategy is for the current regime

---

## Family 1: Breakout

**Core idea**: move with a price movement that clearly breaks through a level and accelerates.

**Two variants**:

*Immediate breakout*: activate directly on strong acceleration. This is the fastest variant — intended for situations where delay means most of the move is already over.

*Confirmed breakout*: activate only when the movement is consistent across multiple time horizons. More certainty, lower chance of a false signal, but later entry.

**Favourable regimes**: Trend, High volatility (with caution), Chaos-directional

**Less suitable for**: Low liquidity (too great a risk of poor execution), Range (movements revert)

---

## Family 2: Momentum

**Core idea**: engage with an existing sustained directional move — either riding it while it continues, or anticipating its fade.

**Two variants**:

*Momentum ride*: follow a movement that persists. Requires directional consistency across multiple horizons. Works best when the movement is accelerating or stable.

*Momentum fade*: anticipate the weakening of an existing movement. Activate when there are signs that the trend is fading but not yet reversed.

**Favourable regimes**: Trend (Ride), Trend/High-vol (Fade when stronger fade signals are present)

**Less suitable for**: Range (no sustained movement), Chaos-noise (too unpredictable)

---

## Family 3: MeanReversion

**Core idea**: anticipate a return to an equilibrium level after a temporary overshoot.

**Two variants**:

*Snapback*: activate on a short, sharp overshoot in markets that typically revert. The trade direction is opposite to the overshoot.

*Grind*: activate in stable range conditions where the return is more gradual. Requires higher spread stability.

**Favourable regimes**: Range (primary), High volatility (Snapback on shallow overshoot)

**Less suitable for**: Trend (counter-trend), Chaos-directional (risk of the move continuing)

---

## Family 4: Maker

**Core idea**: provide liquidity to the market via passive limit orders, and capture the spread as margin.

**Two variants**:

*Maker step ahead*: places a limit order at a specific position in the queue, ahead of anticipated order flow. Requires authenticated L3 orderbook data for queue visibility.

*Passive maker queue*: places a standard passive limit order at the best price. Less selective than step-ahead, broader applicability.

**Favourable regimes**: Range, Low volatility, Low liquidity (Passive variant)

**Less suitable for**: Strong trends (the book moves away from the limit order), Chaos (too unpredictable for maker execution)

**Special characteristics**: Maker strategies generate a maker exit at take-profit, which also has a lower fee for the exit. However, they are more sensitive to adverse selection.

---

## Family 5: Volatility

**Core idea**: capture directionally-biased accelerated movements in high-volatility regimes.

**One variant**: *Volatility surge*: activate in high-volatility or chaos regimes where the movement clearly accelerates and has a direction. This is an aggressive strategy active exclusively in the two most extreme regimes.

**Favourable regimes**: High volatility, Chaos-directional

**Less suitable for**: All other regimes

---

## Family 6: Liquidity

**Core idea**: operate in specific low-liquidity conditions where trade density and the trade profile show a recognisable pattern.

**One variant**: *Liquidity vacuum*: activate exclusively in the low-liquidity regime where trade density falls within a specific range. Combines limited activity with characteristic price dynamics.

**Favourable regimes**: Low liquidity only

**Less suitable for**: All other regimes (the activation condition excludes them)

---

## No opportunity

None of the eleven variants qualifies. The system takes no position and explicitly logs why each variant was rejected.

This is a valid outcome — not an error condition. The system waits for better conditions for the next trading pair or the next evaluation moment.

---

## Relationship between families and execution

The strategy family determines not only *which position* is taken, but also *how* it is executed:

- Breakout and Momentum families: typically taker execution (speed is priority)
- Maker families: always maker execution (limit orders)
- MeanReversion: mix depending on urgency
- Volatility: taker execution (acceleration requires fast entry)
- Liquidity: depends on market situation

And also *how the position is protected*: each family has associated exit policy types that match the expected price dynamics.

---

*Back to: [Index](./DOC_INDEX.md)*

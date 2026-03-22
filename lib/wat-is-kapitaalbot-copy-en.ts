/** Page: What KapitaalBot is (and isn’t) — native EN, SEO. */
export const watIsKapitaalbotEn: Record<string, string> = {
  "watkap.metaTitle":
    "What KapitaalBot is (and isn’t) | State-first trading, not a signal service",
  "watkap.metaDesc":
    "KapitaalBot is an autonomous trading runtime with state-first architecture, safety guardrails, and observability — not a get-rich-quick tool or a real-time signal feed. Read the hard boundaries.",
  "watkap.metaKeywords":
    "KapitaalBot, autonomous trading, state-first, execution discipline, observability, not a signal service, Kraken, risk management, algorithmic trading",

  "watkap.h1": "KapitaalBot: the hard truth about autonomous trading architecture",

  "watkap.intro":
    "Based on KapitaalBot’s technical documentation and architecture, here is a clear view of what the system is at its core — and what it absolutely is not. Below is the SEO-focused essence: what KapitaalBot explicitly is and is not.",

  "watkap.wel.title": "What KapitaalBot explicitly IS",
  "watkap.wel.b1":
    "**An autonomous trading runtime:** a robust engine that runs 24/7 on a tight ingest-to-execution pipeline.",
  "watkap.wel.b2":
    "**State-first architecture:** the bot acts only on validated state (`run_symbol_state`). Every decision rests on a complete, current market picture — not scattered fragments of data.",
  "watkap.wel.b3":
    "**Capital preservation as a priority:** the stack is built around safety guardrails. Risk management is embedded in code — from hard blocks to automatic exit-only modes when conditions are abnormal.",
  "watkap.wel.b4":
    "**Observable & transparent:** through an observability pipeline (Tier 1 & Tier 2 dashboards), metrics from the database are turned into meaningful snapshots. You see, in aggregate, what the bot sees — within tier limits.",
  "watkap.wel.b5":
    "**Disciplined execution:** orders within strict bounds. No emotion, no deviation from strategy — execution of programmed logic within risk and safety constraints.",

  "watkap.niet.title": "What KapitaalBot explicitly is NOT",
  "watkap.niet.b1":
    "**Not a “get rich quick” tool:** not a black box that guarantees profit. It is a technical system for people who understand that trading is statistics and risk control.",
  "watkap.niet.b2":
    "**Not a real-time signal service:** the architecture uses read-model snapshots. It is not meant to push fast buy/sell alerts for manual follow-up.",
  "watkap.niet.b3":
    "**Not an open order feed for third parties:** a closed execution ecosystem; no public API to piggyback on individual trades in real time.",
  "watkap.niet.b4":
    "**Not an uncontrolled system:** with safety guardrails, the bot will rather stop or limit trading (e.g. extreme volatility or data lag) than take irresponsible risk. Safety over volume.",

  "watkap.waarom.title": "Why this architecture matters",
  "watkap.waarom.p1":
    "Strength comes from separation of concerns: the ingest engine gathers raw data (including L2/L3 feeds), the route engine decides course from state, the execution engine acts within safety margins. That hierarchy reduces failures that less mature stacks turn into capital loss.",

  "watkap.closing": "Choose discipline. Choose architecture. Choose KapitaalBot.",

  "watkap.breadcrumb": "What it is (and isn’t)",
};

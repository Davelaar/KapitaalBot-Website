import type { WatArticleBlock } from "./types";

export const watIsKapitaalbotArticleEn: WatArticleBlock[] = [
  { k: "h1", text: "What is KapitaalBot?" },
  {
    k: "p",
    text:
      "KapitaalBot is not a plain-vanilla momentum, breakout, or scalping bot. It is a timing-aware, multistrategy, multiregime execution engine that judges, for each market, horizon, and route, what is responsible, explainable, and economically tradable at that moment.",
    lead: true,
  },
  {
    k: "p",
    text:
      "The core is not one indicator, one playbook, or one favourite coin. The core is a live selection process that lines up multiple candidate routes, tests them for data freshness, tradability, regime, safety, and execution context, and only admits routes that are genuinely executable under current conditions.",
    lead: true,
  },
  { k: "h2", text: "Canonical definition" },
  {
    k: "p",
    text: "KapitaalBot is a route-selection and execution engine with the following properties:",
  },
  {
    k: "pairRow",
    left: {
      h: "Timing-aware selection",
      p:
        "KapitaalBot does not only ask whether a market is interesting, but when a route is viable within a concrete horizon. Time is not an afterthought; it is a first-class part of selection.",
    },
    right: {
      h: "Multistrategy",
      p:
        "The system is not built around a single strategy. Different route families and entry logic can coexist, provided each honours its own economic and operational constraints.",
    },
  },
  {
    k: "pairRow",
    left: {
      h: "Multiregime",
      p:
        "Not every market should be read the same way. KapitaalBot accounts for regime differences and is meant to adapt route choice instead of forcing every symbol through one generic filter stack.",
    },
    right: {
      h: "Execution-first truth",
      p:
        "Operational truth does not live in a research snapshot or a static dashboard, but in live execution state, the current market-data layer, valid universe/epoch context, and the actual execution blockers.",
    },
  },
  { k: "h3", text: "Explainability by design" },
  {
    k: "p",
    text:
      "KapitaalBot must be able to say not only why a trade was taken, but especially why a trade was not taken. That includes:",
  },
  {
    k: "ul",
    items: [
      "why-no-trade",
      "first blocker",
      "blocker chain",
      "route wins",
      "reject reasons",
      "dominant execution constraint",
    ],
  },
  { k: "h3", text: "Safety and position context as constraints" },
  {
    k: "p",
    text:
      "KapitaalBot is not designed to trade at any cost. Positioning, exposure, data quality, market freshness, and execution safety come before opportunism. Not trading beats trading on bad or inconsistent truth.",
  },
  { k: "h2", text: "What KapitaalBot is in practice" },
  {
    k: "p",
    text: "KapitaalBot is a system that tries to determine:",
  },
  {
    k: "ul",
    items: [
      "which symbols are actually tradable right now",
      "which horizons currently show meaningful movement",
      "which route makes sense in that context",
      "which blocker stops a candidate",
      "whether execution is still economically and operationally justified",
      "and how all of that can be explained for operators and forensics",
    ],
  },
  {
    k: "p",
    text:
      "So KapitaalBot is not a “coin picker”, but a live decision layer between market data and execution.",
  },
  { k: "h2", text: "What KapitaalBot explicitly is not" },
  {
    k: "notBlock",
    h: "Not a single-strategy indicator bot",
    p:
      "KapitaalBot should not rely on one generic edge formula or one fixed setup rolled out unchanged across every market.",
  },
  {
    k: "notBlock",
    h: "Not a symbol-first or feed-first dashboard model",
    p:
      "A dashboard is observability, not the source of truth. Truth should come from the live runtime, execution state, and valid market-data context.",
  },
  {
    k: "notBlock",
    h: "Not a research snapshot as trading SSOT",
    p:
      "Research, backtests, and edgeboard-style layers can help calibration and analysis, but not as the dominant live selector truth.",
  },
  {
    k: "notBlock",
    h: "Not a black-box signal machine",
    p:
      "A candidate without a clear account of why it wins or loses does not fit KapitaalBot’s design intent.",
  },
  {
    k: "notBlock",
    h: "Not investment advice or a signal service",
    p:
      "KapitaalBot is an internal trading system and observability/execution framework, not a public advisory product.",
  },
  { k: "h2", text: "Where KapitaalBot is heading" },
  {
    k: "p",
    text: "KapitaalBot is evolving toward a foundation in which:",
  },
  {
    k: "ul",
    items: [
      "live hot state drives selection",
      "horizons are measured explicitly",
      "tradability is first-class",
      "route-specific economics is applied only after the right context",
      "explainability is standard, not optional",
      "and cold start / fast start stay responsible without structurally blinding the rest of the market",
    ],
  },
  {
    k: "p",
    text:
      "In other words: KapitaalBot is moving from a collection of loose decision layers toward a coherent, production-grade selector and execution base.",
  },
  {
    k: "h2",
    text: "How this page fits the canon",
  },
  {
    k: "p",
    text:
      "This page states the core definition. For operational observability, use Dashboard. For stack and latency, use SPEC. For contractual detail, use Docs. For cause-and-effect questions, use FAQ.",
  },
];

/**
 * U.S. English — written for American traders, engineers, and ops readers.
 * Standalone copy (not translated from Dutch). Spelling: American (e.g. behavior, optimize).
 */
export const seoEn: Record<string, string> = {
  "nav.kennis": "Insights",
  "seo.home.metaTitle":
    "KapitaalBot | Autonomous Kraken spot engine · L3 order book · WebSocket observability",
  "seo.home.metaDesc":
    "Fully autonomous crypto trading engine on Kraken spot: multi-regime detection, hybrid maker bias, Kraken WebSocket v2 execution, L3 microstructure metrics, and read-model observability. Built for serious traders and engineers — not get-rich-quick hype.",
  "seo.home.keywords":
    "Kraken trading bot, L3 order book, WebSocket API, autonomous crypto bot, regime detection, observability dashboard, spot trading, hybrid maker, execution engine, United States, low latency, risk management",
  "seo.hub.metaTitle": "Insights | Kraken bot · L3 · regimes · observability | KapitaalBot",
  "seo.hub.metaDesc":
    "Technical deep dives on a fully autonomous Kraken spot trading engine: L3 order book, WebSocket API, regime detection, live execution transparency, safe API integration, and low-latency Rust execution.",
  "seo.hub.h1": "Knowledge base: Kraken spot engine, observability & execution",
  "seo.hub.intro":
    "These pages are for traders and engineers who want substance: Kraken L3, WebSocket-first execution, multi-regime behavior, and observability you can audit. KapitaalBot is a long-running, state-first runtime — not a black-box script.",
  "seo.hub.p1":
    "Use the links below as entry points; they tie into the dashboard (read-model snapshots) and architecture docs where it helps.",

  "seo.hub.card.kraken-l3-orderbook-bot.title": "Kraken L3 order book & trading bot",
  "seo.hub.card.kraken-l3-orderbook-bot.desc":
    "Why authenticated L3 and microstructure metrics matter beyond L2-only or REST polling.",
  "seo.hub.card.kraken-websocket-api-spot.title": "Kraken WebSocket API (spot) vs slow REST",
  "seo.hub.card.kraken-websocket-api-spot.desc":
    "Persistent WS v2, execution via user channel — latency and deterministic state matter.",
  "seo.hub.card.kraken-hybrid-maker-fees.title": "Hybrid maker & fee savings on Kraken",
  "seo.hub.card.kraken-hybrid-maker-fees.desc":
    "Maker vs taker: why a hybrid maker approach can structurally cut fees.",
  "seo.hub.card.crypto-regime-detectie.title": "Crypto regime detection & choppy markets",
  "seo.hub.card.crypto-regime-detectie.desc":
    "How multi-regime routing limits damage when conditions do not fit your strategy.",
  "seo.hub.card.live-execution-transparency.title": "Live execution transparency & proof of strategy",
  "seo.hub.card.live-execution-transparency.desc":
    "Read-model snapshots — no live signal feed — for operator-grade control.",
  "seo.hub.card.veilige-kraken-api-bot.title": "Safe Kraken API integration for bots",
  "seo.hub.card.veilige-kraken-api-bot.desc":
    "Deterministic execution, state machines, no ad-hoc REST trading paths.",
  "seo.hub.card.low-latency-crypto-execution-nl.title": "Low-latency crypto execution (US / global)",
  "seo.hub.card.low-latency-crypto-execution-nl.desc":
    "Rust, systemd, tight process boundaries — operational latency by design.",

  "seo.page.kraken-l3-orderbook-bot.metaTitle": "Kraken L3 order book trading bot & microstructure | KapitaalBot",
  "seo.page.kraken-l3-orderbook-bot.metaDesc":
    "Kraken Spot L3 authenticated feed: order-level microstructure beyond top-of-book. How KapitaalBot uses L3 metrics alongside L2/ticker in a multi-regime engine.",
  "seo.page.kraken-l3-orderbook-bot.h1": "Kraken L3 order book & autonomous spot trading bot",
  "seo.page.kraken-l3-orderbook-bot.lead":
    "Search terms like “Kraken L3 orderbook trading bot” describe a rare stack: spot, authenticated L3 feeds, and an engine that actually uses microstructure in routing and risk.",
  "seo.page.kraken-l3-orderbook-bot.p1":
    "Many retail bots only read the ticker or L2 top-of-book. KapitaalBot combines ticker, trades, L2 and L3 in a state-first model: `run_symbol_state` is built first; strategy and execution read from that state — not from loose, un-auditable caches.",
  "seo.page.kraken-l3-orderbook-bot.p2":
    "L3 is expensive in rate budget and requires strict symbol budgeting; that is why L3 availability is a first-class metric on the observability dashboard. Suitability filters apply: poor microstructure often means do not trade.",
  "seo.page.kraken-l3-orderbook-bot.p3":
    "This is not investment advice; it describes technical architecture. No strategy parameters, no signals — transparency on execution and risk discipline only.",
  "seo.page.kraken-l3-orderbook-bot.p4":
    "Related: WebSocket-first execution, regime detection, and live observability — see the other articles and the Data dashboard for read-model snapshots.",

  "seo.page.kraken-websocket-api-spot.metaTitle": "Kraken API WebSocket trading bot (spot) | KapitaalBot",
  "seo.page.kraken-websocket-api-spot.metaDesc":
    "Kraken WebSocket v2 for market data and private user data; trading requests via WS (after auth token). Why REST is not the primary execution path — latency, determinism, session scope.",
  "seo.page.kraken-websocket-api-spot.h1": "Kraken WebSocket API (spot) as the core of the trading bot",
  "seo.page.kraken-websocket-api-spot.lead":
    "The search intent “Kraken API websocket trading bot” matches an engine that multiplexes persistent connections, routes `req_id`s, and treats reconnects and token rotation seriously.",
  "seo.page.kraken-websocket-api-spot.p1":
    "REST is slow for high-frequency state sync; the bot uses WebSockets for market data (public) and private streams for balances, executions, and order lifecycle. Truth for fills is user-data, not a single REST response.",
  "seo.page.kraken-websocket-api-spot.p2":
    "A fully autonomous bot is not a loose cron job: connections are long-lived, with backpressure and bounded queues — unlike a script that REST-polls every minute.",
  "seo.page.kraken-websocket-api-spot.p3":
    "KapitaalBot.nl does not show a live order feed; observability is read-model snapshots (Tier 1/2) for transparency without leaking strategy.",
  "seo.page.kraken-websocket-api-spot.p4": "",

  "seo.page.kraken-hybrid-maker-fees.metaTitle": "Kraken maker bot & hybrid maker fees | KapitaalBot",
  "seo.page.kraken-hybrid-maker-fees.metaDesc":
    "Hybrid maker: why Kraken maker/taker fee structure matters for a spot engine. Not free money — structural cost control vs pure taker automation.",
  "seo.page.kraken-hybrid-maker-fees.h1": "Kraken hybrid maker & market maker fee savings",
  "seo.page.kraken-hybrid-maker-fees.lead":
    "Queries like “market maker bot Kraken” point to fee efficiency: makers often pay lower fees than takers. A hybrid maker approach prefers maker-style placement where risk and microstructure allow.",
  "seo.page.kraken-hybrid-maker-fees.p1":
    "Taker-heavy bots pay more and often lose on frequent market orders. KapitaalBot is focused on controlled execution and risk gates — not on max volume. Fee savings are a side effect of avoiding dumb taker flows.",
  "seo.page.kraken-hybrid-maker-fees.p2":
    "There is no guarantee of maker fills: queue dynamics decide. Observability is why you can see which safety modes fire and what execution outcomes appear in the read model.",
  "seo.page.kraken-hybrid-maker-fees.p3": "",
  "seo.page.kraken-hybrid-maker-fees.p4": "",

  "seo.page.crypto-regime-detectie.metaTitle": "Crypto bot regime detection & multi-regime | KapitaalBot",
  "seo.page.crypto-regime-detectie.metaDesc":
    "Regime detection for autonomous crypto bots: why ranging and volatile regimes must be treated differently. Multi-regime routing and guardrails instead of one strategy everywhere.",
  "seo.page.crypto-regime-detectie.h1": "Crypto bot regime detection & multi-regime routing",
  "seo.page.crypto-regime-detectie.lead":
    "People search “crypto bot regime detection” when one strategy bleeds outside its market. KapitaalBot classifies markets into regimes and maps strategy families to conditions — not a single global parameter set.",
  "seo.page.crypto-regime-detectie.p1":
    "Regime information appears in observability snapshots (dominant regimes, switches, strategies). The goal is not prediction; it is conditional coverage: reduce risk when microstructure or data quality is poor.",
  "seo.page.crypto-regime-detectie.p2":
    "Avoiding losses in volatile markets is not a promise — it is a design goal: safety modes (exit-only, hard blocks) and exposure caps are first-class.",
  "seo.page.crypto-regime-detectie.p3": "",
  "seo.page.crypto-regime-detectie.p4": "",

  "seo.page.live-execution-transparency.metaTitle": "Live trading bot monitoring & execution transparency | KapitaalBot",
  "seo.page.live-execution-transparency.metaDesc":
    "Real-time trading bot monitoring dashboard (read-model): snapshots of orders/fills/safety, latency aggregates where available. Proof of strategy via data — not a black box.",
  "seo.page.live-execution-transparency.h1": "Live execution transparency & observability dashboard",
  "seo.page.live-execution-transparency.lead":
    "“Real-time trading bot monitoring dashboard” often implies tick-by-tick signals; here Tier 1 is intentionally delayed, aggregated read-model snapshots — transparency for operators without reverse-engineering strategy.",
  "seo.page.live-execution-transparency.p1":
    "Proof of strategy means you can follow runtime behavior, regimes, safety, and execution outcomes together — closer to operational truth than a static equity curve alone.",
  "seo.page.live-execution-transparency.p2":
    "Tier 2 adds more execution and latency insight for authorized sessions; request via the access page.",
  "seo.page.live-execution-transparency.p3": "",
  "seo.page.live-execution-transparency.p4": "",

  "seo.page.veilige-kraken-api-bot.metaTitle": "Safe Kraken API bot & deterministic execution | KapitaalBot",
  "seo.page.veilige-kraken-api-bot.metaDesc":
    "Safe Kraken API wiring: deterministic execution, state-machine lifecycles, epochs, and no forbidden REST paths for trading. Operational security by design.",
  "seo.page.veilige-kraken-api-bot.h1": "Safe Kraken API wiring for an autonomous bot",
  "seo.page.veilige-kraken-api-bot.lead":
    "Why does my crypto bot fail? Often because there is no hard truth between what you think happened and what the exchange executed. KapitaalBot ties user-data executions to internal state with validation and logging — not a random REST guess.",
  "seo.page.veilige-kraken-api-bot.p1":
    "Safety also means: no ad-hoc hotfixes in prod, no secrets in logs, and no unbounded API surface. This site does not publish keys or live strategy parameters.",
  "seo.page.veilige-kraken-api-bot.p2":
    "Deterministic execution means you can mirror runtime to git commit, schema, and snapshots — not mystery RAM state.",
  "seo.page.veilige-kraken-api-bot.p3": "",
  "seo.page.veilige-kraken-api-bot.p4": "",

  "seo.page.low-latency-crypto-execution-nl.metaTitle": "Low-latency crypto execution engine (US) | KapitaalBot",
  "seo.page.low-latency-crypto-execution-nl.metaDesc":
    "Low-latency crypto execution with Rust and server discipline: systemd, clear process boundaries, ingest/execution split. Not an HFT promise — serious engineering.",
  "seo.page.low-latency-crypto-execution-nl.h1": "Low-latency crypto execution — Rust & infrastructure",
  "seo.page.low-latency-crypto-execution-nl.lead":
    "Queries like “low latency crypto execution engine” fit a deployment optimized for stability and measurability: Rust, no unnecessary allocations in hot paths, and operational monitoring.",
  "seo.page.low-latency-crypto-execution-nl.p1":
    "Spot is not co-located HFT on the matching engine; latency here means fast, reliable WebSocket processing and predictable execution queues — not microsecond arbitrage.",
  "seo.page.low-latency-crypto-execution-nl.p2":
    "HFT search intent sometimes attracts the right technical audience; KapitaalBot is positioned as an autonomous spot engine with risk gates — not a latency-arb product.",
  "seo.page.low-latency-crypto-execution-nl.p3": "",
  "seo.page.low-latency-crypto-execution-nl.p4": "",

  "faq.section.seo.title": "What traders & engineers ask",
  "faq.seo.q1": "Why does my crypto bot fail when backtests looked great?",
  "faq.seo.a1":
    "Backtests often miss microstructure, fee models, and regime shifts. A live engine must also handle data freshness, outages, and safety modes. Observability is how you catch operational drift before it eats capital.",
  "faq.seo.q2": "How do I minimize slippage on Kraken with a bot?",
  "faq.seo.a2":
    "Slippage is driven by spread, queue position, and order aggression. Hybrid maker bias and better timing (regime + state) beat clicking faster. KapitaalBot does not publish entry signals; execution aggregates are in read-model snapshots.",
  "faq.seo.q3": "Is this a Kraken WebSocket trading bot?",
  "faq.seo.a3":
    "Yes in the sense that market data and private user data use WebSockets and execution requests go over WS. REST is not the primary trading path; auth tokens are session-scoped as Kraken requires.",
  "faq.seo.q4": "What does multi-regime mean for my risk?",
  "faq.seo.a4":
    "It means the system does not force one strategy on every market. Regime switches and guardrails exist to limit exposure when conditions do not match the chosen strategy families.",
  "faq.seo.q5": "Why is observability such a theme for you?",
  "faq.seo.a5":
    "Because transparent crypto trading bots are rare: most tools are black boxes. This site shows read-model snapshots and documentation, not live alpha — a deliberate choice for control and auditability.",

  "home.seoStrip.title": "Deep dives: Kraken spot engine & observability",
  "home.seoStrip.intro":
    "Articles for engineers and serious traders: L3 order book, WebSocket execution, regime detection, hybrid maker fees, safe API wiring, and low-latency infrastructure.",
  "home.seoStrip.cta": "Knowledge base →",
  "home.seoStrip.anchor.l3": "Kraken L3",
  "home.seoStrip.anchor.ws": "WebSocket",
  "home.seoStrip.anchor.maker": "Hybrid maker",
  "home.seoStrip.anchor.regime": "Regime",
};

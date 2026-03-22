import type { KennisSlug } from "@/lib/kennis-slugs";

/**
 * SEO-focused copy (NL/EN/DE/FR). Merged into t() — keys prefixed with seo.*, nav.kennis, faq.section.seo.*, faq.seo.*, home.seoStrip.*
 */
const seoNl: Record<string, string> = {
    "nav.kennis": "Kennis",
    "seo.home.metaTitle":
      "KapitaalBot | Autonome Kraken spot engine · L3 orderbook · WebSocket observability",
    "seo.home.metaDesc":
      "Autonome crypto trading engine op Kraken spot: multi-regime detectie, hybrid maker-gericht gedrag, Kraken WebSocket v2 execution, L3-microstructure metrics en read-model observability. Voor serieuze traders en developers — geen snel-rijk claims.",
    "seo.home.keywords":
      "Kraken trading bot, L3 orderbook, WebSocket API, autonome crypto bot, regime detection, observability dashboard, spot trading, hybrid maker, execution engine, Nederland, low latency, risk management",
    "seo.hub.metaTitle": "Kennisbank | Kraken bot · L3 · regime · observability | KapitaalBot",
    "seo.hub.metaDesc":
      "Technische artikelen over een volledig autonome Kraken spot trading engine: L3 orderbook, WebSocket API, regime detection, live execution transparency, veilige API-koppeling en low-latency Rust-execution.",
    "seo.hub.h1": "Kennisbank: Kraken spot engine, observability & execution",
    "seo.hub.intro":
      "Deze pagina’s zijn geschreven voor traders en developers die zoeken naar diepgang: Kraken L3, WebSocket-first execution, multi-regime gedrag en transparante observability. KapitaalBot is een langlopende, state-first runtime — geen black-box script.",
    "seo.hub.p1":
      "Gebruik de onderstaande links als startpunt; ze verbinden met het dashboard (read-model snapshots) en de algemene architectuur-documentatie waar passend.",

    "seo.hub.card.kraken-l3-orderbook-bot.title": "Kraken L3 orderbook & trading bot",
    "seo.hub.card.kraken-l3-orderbook-bot.desc":
      "Waarom authenticated L3 en microstructure-metrics centraal staan in plaats van alleen L2 of REST-polling.",
    "seo.hub.card.kraken-websocket-api-spot.title": "Kraken WebSocket API (spot) i.p.v. trage REST",
    "seo.hub.card.kraken-websocket-api-spot.desc":
      "Persistent WS v2, execution via user channel — latency en deterministische state matteren.",
    "seo.hub.card.kraken-hybrid-maker-fees.title": "Hybrid maker & fee-besparing op Kraken",
    "seo.hub.card.kraken-hybrid-maker-fees.desc":
      "Maker vs taker: waarom een hybrid maker-benadering structureel op fees kan besparen.",
    "seo.hub.card.crypto-regime-detectie.title": "Crypto regime detection & zijwaartse markten",
    "seo.hub.card.crypto-regime-detectie.desc":
      "Hoe multi-regime routing schade in de verkeerde marktconditie beperkt.",
    "seo.hub.card.live-execution-transparency.title": "Live execution transparency & proof of strategy",
    "seo.hub.card.live-execution-transparency.desc":
      "Read-model snapshots, geen realtime signal-feed — controleerbaarheid voor operators.",
    "seo.hub.card.veilige-kraken-api-bot.title": "Veilige Kraken API-koppeling voor bots",
    "seo.hub.card.veilige-kraken-api-bot.desc":
      "Deterministic execution, state machines, geen ad-hoc REST-trading paden.",
    "seo.hub.card.low-latency-crypto-execution-nl.title": "Low-latency crypto execution (Nederland)",
    "seo.hub.card.low-latency-crypto-execution-nl.desc":
      "Rust, systemd, strakke process boundaries — operational latency als ontwerpkeuze.",

    "seo.page.kraken-l3-orderbook-bot.metaTitle": "Kraken L3 orderbook trading bot & microstructure | KapitaalBot",
    "seo.page.kraken-l3-orderbook-bot.metaDesc":
      "Kraken Spot L3 authenticated feed: order-level microstructure i.p.v. alleen top-of-book. Hoe KapitaalBot L3-metrics gebruikt naast L2/ticker in een multi-regime engine.",
    "seo.page.kraken-l3-orderbook-bot.h1": "Kraken L3 orderbook & autonome spot trading bot",
    "seo.page.kraken-l3-orderbook-bot.lead":
      "Zoektermen als “Kraken L3 orderbook trading bot” verwijzen naar een zeldzame combinatie: spot, geauthenticeerde L3-feeds, en een engine die microstructure daadwerkelijk in routing en risk meeneemt.",
    "seo.page.kraken-l3-orderbook-bot.p1":
      "Veel retail-bots lezen alleen ticker of L2-top-of-book. KapitaalBot combineert ticker, trades, L2 en L3 in een state-first model: `run_symbol_state` wordt eerst opgebouwd; strategie en execution lezen uit die state — niet uit losse, niet-herleidbare caches.",
    "seo.page.kraken-l3-orderbook-bot.p2":
      "L3 is kostbaar in rate budget en vereist strikte symbol budgeting; daarom is L3-beschikbaarheid een first-class metric op het observability-dashboard. Daarnaast worden suitability-filters toegepast: slechte microstructure betekent niet “meer traden”, maar vaker “niet traden”.",
    "seo.page.kraken-l3-orderbook-bot.p3":
      "Dit is geen aanbod of uitnodiging om te beleggen; het beschrijft technische architectuur. Geen strategieparameters, geen signalen — wél transparantie over execution- en risk-disipline.",
    "seo.page.kraken-l3-orderbook-bot.p4":
      "Gerelateerd: WebSocket-first execution, regime detection en live observability — zie de andere kennisartikelen en het Data-dashboard voor read-model snapshots.",

    "seo.page.kraken-websocket-api-spot.metaTitle": "Kraken API WebSocket trading bot (spot) | KapitaalBot",
    "seo.page.kraken-websocket-api-spot.metaDesc":
      "Kraken WebSocket v2 voor market data en private user data; trading requests via WS (na auth-token). Waarom REST geen hoofdpad is voor execution — latency, determinisme en sessie-scope.",
    "seo.page.kraken-websocket-api-spot.h1": "Kraken WebSocket API (spot) als kern van de trading bot",
    "seo.page.kraken-websocket-api-spot.lead":
      "Zoekintentie “Kraken API websocket trading bot” past bij een engine die persistente verbindingen multiplext, `req_id` routed, en reconnect + token-rotatie serieus neemt.",
    "seo.page.kraken-websocket-api-spot.p1":
      "REST is traag en ongeschikt voor hoge frequentie van state-sync; de bot gebruikt WebSockets voor marketdata (public) en private streams voor balances, executions en order lifecycle. Daarmee is de waarheid van fills en status vooral user-data, niet alleen een “REST response”.",
    "seo.page.kraken-websocket-api-spot.p2":
      "Een volledig autonome bot draait niet in losse cronjobs: verbindingen zijn langlopend, met backpressure en bounded queues. Dat is een fundamenteel verschil met “script dat elke minuut REST pollt”.",
    "seo.page.kraken-websocket-api-spot.p3":
      "KapitaalBot.nl toont geen live orderfeed; observability is read-model snapshots (Tier 1/2) voor transparantie zonder strategie-lek.",
    "seo.page.kraken-websocket-api-spot.p4": "",

    "seo.page.kraken-hybrid-maker-fees.metaTitle": "Kraken maker bot & hybrid maker fees | KapitaalBot",
    "seo.page.kraken-hybrid-maker-fees.metaDesc":
      "Hybrid maker: waarom maker-taker fee-structuur op Kraken relevant is voor een spot engine. Geen “gratis geld” — wel structurele kostenbeheersing versus pure taker-automation.",
    "seo.page.kraken-hybrid-maker-fees.h1": "Kraken hybrid maker & market maker fee-besparing",
    "seo.page.kraken-hybrid-maker-fees.lead":
      "Zoektermen als “market maker bot Kraken instellen” wijzen op fee-efficiency: makers betalen vaak lagere fees dan takers. Een hybrid maker-benadering probeert daar waar mogelijk maker-achtige plaatsing te prefereren, binnen risk en microstructure.",
    "seo.page.kraken-hybrid-maker-fees.p1":
      "Taker-heavy bots betalen structureel meer en verliezen bij frequente marktorders. KapitaalBot is primair gericht op gecontroleerde execution en risk gates — niet op “maximaal volume”. Fee-besparing is een bijproduct van het vermijden van domme taker-stromen.",
    "seo.page.kraken-hybrid-maker-fees.p2":
      "Geen garantie op maker fills: marktregime en queue dynamics bepalen uitkomsten. Daarom is observability cruciaal: je ziet welke safety-modes actief zijn, en welke execution-uitkomsten in het read-model verschijnen.",
    "seo.page.kraken-hybrid-maker-fees.p3": "",
    "seo.page.kraken-hybrid-maker-fees.p4": "",

    "seo.page.crypto-regime-detectie.metaTitle": "Crypto bot regime detection & multi-regime | KapitaalBot",
    "seo.page.crypto-regime-detectie.metaDesc":
      "Regime detection voor autonome crypto bots: waarom zijwaartse markten en volatiliteit anders behandeld moeten worden. Multi-regime routing en guardrails in plaats van één strategie overal.",
    "seo.page.crypto-regime-detectie.h1": "Crypto bot regime detection & multi-regime routing",
    "seo.page.crypto-regime-detectie.lead":
      "“Crypto bot regime detection” is een zoekterm voor traders die merken dat één strategie buiten de juiste marktcondities lekt. KapitaalBot classificeert markten in regimes en koppelt strategie-families aan condities — niet aan één globale parameter-set.",
    "seo.page.crypto-regime-detectie.p1":
      "Regime-informatie verschijnt in observability snapshots (dominante regimes, switches, strategieën). Het doel is niet voorspellen; het doel is conditionele dekking: risico beperken wanneer microstructure of datakwaliteit tegenzit.",
    "seo.page.crypto-regime-detectie.p2":
      "Voorkom verliezen in volatiele markten is geen belofte — wel een ontwerpdoel: safety modes (exit-only, hard blocks) en exposure caps zijn eerste klasse.",
    "seo.page.crypto-regime-detectie.p3": "",
    "seo.page.crypto-regime-detectie.p4": "",

    "seo.page.live-execution-transparency.metaTitle": "Live trading bot monitoring & execution transparency | KapitaalBot",
    "seo.page.live-execution-transparency.metaDesc":
      "Real-time trading bot monitoring dashboard (read-model): snapshots van orders/fills/safety, latency-aggregates waar beschikbaar. Proof of strategy via data — geen black box.",
    "seo.page.live-execution-transparency.h1": "Live execution transparency & observability dashboard",
    "seo.page.live-execution-transparency.lead":
      "“Real-time trading bot monitoring dashboard” klinkt als tick-by-tick signalen; hier is het bewust anders: Tier 1 toont vertraagde, geaggregeerde read-model snapshots — transparantie voor operators zonder strategie-reverse-engineering.",
    "seo.page.live-execution-transparency.p1":
      "Proof of strategy betekent: je kunt runtime-gedrag, regimes, safety en execution-uitkomsten volgen in samenhang. Dat is dichter bij “operational truth” dan een statische equity-curve.",
    "seo.page.live-execution-transparency.p2":
      "Tier 2 breidt uit met meer execution- en latency-inzichten voor geautoriseerde sessies; aanvragen via de toegangspagina.",
    "seo.page.live-execution-transparency.p3": "",
    "seo.page.live-execution-transparency.p4": "",

    "seo.page.veilige-kraken-api-bot.metaTitle": "Veilige Kraken API bot & deterministic execution | KapitaalBot",
    "seo.page.veilige-kraken-api-bot.metaDesc":
      "Veilige API-koppeling Kraken bot: deterministische execution, state-machine lifecycle, epochs en geen verboden REST-paden voor trading. Operational security als ontwerp.",
    "seo.page.veilige-kraken-api-bot.h1": "Veilige Kraken API-koppeling voor een autonome bot",
    "seo.page.veilige-kraken-api-bot.lead":
      "Waarom faalt mijn crypto bot? Vaak: geen harde waarheid tussen “wat ik denk” en “wat de exchange heeft uitgevoerd”. KapitaalBot koppelt user-data executions aan interne state, met validatie en logging — niet aan een losse REST-gok.",
    "seo.page.veilige-kraken-api-bot.p1":
      "Een veilige setup is ook: geen ad-hoc hotfixes in productie, geen secrets in logs, en geen onbeperkte API-surface. De publieke site bevat geen keys en geen live strategieparameters.",
    "seo.page.veilige-kraken-api-bot.p2":
      "Deterministic execution betekent: je kunt runtime aan git commit, schema en snapshots spiegelen — niet aan “mystery state in RAM”.",
    "seo.page.veilige-kraken-api-bot.p3": "",
    "seo.page.veilige-kraken-api-bot.p4": "",

    "seo.page.low-latency-crypto-execution-nl.metaTitle": "Low latency crypto execution engine Nederland | KapitaalBot",
    "seo.page.low-latency-crypto-execution-nl.metaDesc":
      "Low-latency crypto execution met Rust en server-side discipline: systemd, heldere process boundaries, ingest/execution split. Geen HFT-belofte — wel serieuze engineering.",
    "seo.page.low-latency-crypto-execution-nl.h1": "Low-latency crypto execution (Nederland) — Rust & infrastructuur",
    "seo.page.low-latency-crypto-execution-nl.lead":
      "Zoektermen als “low latency crypto execution engine Nederland” passen bij een deployment die lokaal is geoptimaliseerd voor stabiliteit en meetbaarheid: Rust, geen overbodige allocaties in hot paths, en operationele monitoring.",
    "seo.page.low-latency-crypto-execution-nl.p1":
      "Spot is geen co-located HFT op een exchange matching engine; “latency” hier betekent: snelle, betrouwbare verwerking van WebSocket feeds, en voorspelbare execution-queues — niet microseconden-arbitrage.",
    "seo.page.low-latency-crypto-execution-nl.p2":
      "“High frequency trading” (HFT) zoekintentie trekt soms de juiste technische audience; KapitaalBot positioneert zich als autonome spot-engine met risk gates — niet als latency-arb product.",
    "seo.page.low-latency-crypto-execution-nl.p3": "",
    "seo.page.low-latency-crypto-execution-nl.p4": "",

    "faq.section.seo.title": "Zoekvragen van traders & developers",
    "faq.seo.q1": "Waarom faalt mijn crypto bot terwijl backtests goed waren?",
    "faq.seo.a1":
      "Backtests missen vaak microstructure, fee-modellen, en regime shifts. Een live engine moet ook data freshness, exchange outages, en safety modes begrijpen. Observability is daarom geen luxe: het is hoe je operational drift ziet voordat het kapitaal eet.",
    "faq.seo.q2": "Hoe minimaliseer ik slippage op Kraken met een bot?",
    "faq.seo.a2":
      "Slippage is een functie van spread, queue positie, en agressie van orders. Een hybrid maker-benadering en betere timing (regime + state) helpen meer dan “sneller klikken”. KapitaalBot publiceert geen entry-signalen; execution-aggregates staan in read-model snapshots.",
    "faq.seo.q3": "Is dit een Kraken WebSocket trading bot?",
    "faq.seo.a3":
      "Ja in de zin dat market data en private user data via WebSockets lopen en execution requests via WS worden gedaan. REST is geen hoofdpad voor trading; auth tokens zijn sessie-gebonden zoals Kraken voorschrijft.",
    "faq.seo.q4": "Wat betekent multi-regime voor mijn risico?",
    "faq.seo.a4":
      "Het betekent dat het systeem niet één strategie op alle markten afdwingt. Regime switches en guardrails zijn bedoeld om exposure te beperken wanneer condities niet passen bij de gekozen strategie-families.",
    "faq.seo.q5": "Waarom is transparantie / observability een SEO-thema voor jullie?",
    "faq.seo.a5":
      "Omdat “transparante crypto trading bots” zeldzaam zijn: de meeste tools zijn black boxes. Deze site toont read-model snapshots en documentatie, niet live alpha — dat is een bewuste keuze voor controleerbaarheid en auditability.",

    "home.seoStrip.title": "Diepgaande kennis: Kraken spot engine & observability",
    "home.seoStrip.intro":
      "Artikelen voor developers en serieuze traders: L3 orderbook, WebSocket execution, regime detection, hybrid maker fees, veilige API-koppeling en low-latency infrastructuur.",
    "home.seoStrip.cta": "Kennisbank →",
    "home.seoStrip.anchor.l3": "Kraken L3",
    "home.seoStrip.anchor.ws": "WebSocket",
    "home.seoStrip.anchor.maker": "Hybrid maker",
    "home.seoStrip.anchor.regime": "Regime",
};

const seoEn: Record<string, string> = {
    "nav.kennis": "Insights",
    "seo.home.metaTitle":
      "KapitaalBot | Autonomous Kraken spot engine · L3 orderbook · WebSocket observability",
    "seo.home.metaDesc":
      "Autonomous crypto trading engine on Kraken spot: multi-regime detection, hybrid maker bias, Kraken WebSocket v2 execution, L3 microstructure metrics, and read-model observability. Built for serious traders and developers — not get-rich-quick marketing.",
    "seo.home.keywords":
      "Kraken trading bot, L3 order book, WebSocket API, autonomous crypto bot, regime detection, observability dashboard, spot trading, hybrid maker, execution engine, Netherlands, low latency, risk management",
    "seo.hub.metaTitle": "Insights | Kraken bot · L3 · regimes · observability | KapitaalBot",
    "seo.hub.metaDesc":
      "Technical articles on a fully autonomous Kraken spot trading engine: L3 order book, WebSocket API, regime detection, live execution transparency, safe API wiring, and low-latency Rust execution.",
    "seo.hub.h1": "Knowledge base: Kraken spot engine, observability & execution",
    "seo.hub.intro":
      "These pages target traders and developers who want depth: Kraken L3, WebSocket-first execution, multi-regime behaviour, and transparent observability. KapitaalBot is a long-running, state-first runtime — not a black-box script.",
    "seo.hub.p1":
      "Use the links below as entry points; they connect to the dashboard (read-model snapshots) and architecture docs where relevant.",

    "seo.hub.card.kraken-l3-orderbook-bot.title": "Kraken L3 order book & trading bot",
    "seo.hub.card.kraken-l3-orderbook-bot.desc":
      "Why authenticated L3 and microstructure metrics matter beyond L2-only or REST polling.",
    "seo.hub.card.kraken-websocket-api-spot.title": "Kraken WebSocket API (spot) vs slow REST",
    "seo.hub.card.kraken-websocket-api-spot.desc":
      "Persistent WS v2, execution via user channel — latency and deterministic state matter.",
    "seo.hub.card.kraken-hybrid-maker-fees.title": "Hybrid maker & fee savings on Kraken",
    "seo.hub.card.kraken-hybrid-maker-fees.desc":
      "Maker vs taker: why a hybrid maker approach can structurally reduce fees.",
    "seo.hub.card.crypto-regime-detectie.title": "Crypto regime detection & ranging markets",
    "seo.hub.card.crypto-regime-detectie.desc":
      "How multi-regime routing limits damage when conditions do not fit your strategy.",
    "seo.hub.card.live-execution-transparency.title": "Live execution transparency & proof of strategy",
    "seo.hub.card.live-execution-transparency.desc":
      "Read-model snapshots — no live signal feed — for operator-grade control.",
    "seo.hub.card.veilige-kraken-api-bot.title": "Safe Kraken API wiring for bots",
    "seo.hub.card.veilige-kraken-api-bot.desc":
      "Deterministic execution, state machines, no ad-hoc REST trading paths.",
    "seo.hub.card.low-latency-crypto-execution-nl.title": "Low-latency crypto execution (Netherlands)",
    "seo.hub.card.low-latency-crypto-execution-nl.desc":
      "Rust, systemd, tight process boundaries — operational latency by design.",

    "seo.page.kraken-l3-orderbook-bot.metaTitle": "Kraken L3 order book trading bot & microstructure | KapitaalBot",
    "seo.page.kraken-l3-orderbook-bot.metaDesc":
      "Kraken Spot L3 authenticated feed: order-level microstructure beyond top-of-book. How KapitaalBot uses L3 metrics alongside L2/ticker in a multi-regime engine.",
    "seo.page.kraken-l3-orderbook-bot.h1": "Kraken L3 order book & autonomous spot trading bot",
    "seo.page.kraken-l3-orderbook-bot.lead":
      "Queries like “Kraken L3 orderbook trading bot” describe a rare stack: spot, authenticated L3 feeds, and an engine that actually uses microstructure in routing and risk.",
    "seo.page.kraken-l3-orderbook-bot.p1":
      "Many retail bots only read ticker or L2 top-of-book. KapitaalBot combines ticker, trades, L2 and L3 in a state-first model: `run_symbol_state` is built first; strategy and execution read from that state — not from loose, un-auditable caches.",
    "seo.page.kraken-l3-orderbook-bot.p2":
      "L3 is expensive in rate budget and requires strict symbol budgeting; that is why L3 availability is a first-class metric on the observability dashboard. Suitability filters apply: poor microstructure often means “do not trade”.",
    "seo.page.kraken-l3-orderbook-bot.p3":
      "This is not investment advice; it describes technical architecture. No strategy parameters, no signals — transparency on execution and risk discipline only.",
    "seo.page.kraken-l3-orderbook-bot.p4":
      "Related: WebSocket-first execution, regime detection, and live observability — see other articles and the Data dashboard for read-model snapshots.",

    "seo.page.kraken-websocket-api-spot.metaTitle": "Kraken API WebSocket trading bot (spot) | KapitaalBot",
    "seo.page.kraken-websocket-api-spot.metaDesc":
      "Kraken WebSocket v2 for market data and private user data; trading requests via WS (after auth token). Why REST is not the primary execution path — latency, determinism, session scope.",
    "seo.page.kraken-websocket-api-spot.h1": "Kraken WebSocket API (spot) as the core of the trading bot",
    "seo.page.kraken-websocket-api-spot.lead":
      "The search intent “Kraken API websocket trading bot” matches an engine that multiplexes persistent connections, routes `req_id`s, and treats reconnects and token rotation seriously.",
    "seo.page.kraken-websocket-api-spot.p1":
      "REST is slow for high-frequency state sync; the bot uses WebSockets for market data (public) and private streams for balances, executions, and order lifecycle. Truth for fills is user-data, not a single REST response.",
    "seo.page.kraken-websocket-api-spot.p2":
      "A fully autonomous bot is not a loose cron: connections are long-lived, with backpressure and bounded queues — unlike “a script that REST-polls every minute”.",
    "seo.page.kraken-websocket-api-spot.p3":
      "KapitaalBot.nl does not show a live order feed; observability is read-model snapshots (Tier 1/2) for transparency without leaking strategy.",
    "seo.page.kraken-websocket-api-spot.p4": "",

    "seo.page.kraken-hybrid-maker-fees.metaTitle": "Kraken maker bot & hybrid maker fees | KapitaalBot",
    "seo.page.kraken-hybrid-maker-fees.metaDesc":
      "Hybrid maker: why Kraken maker/taker fee structure matters for a spot engine. Not “free money” — structural cost control vs pure taker automation.",
    "seo.page.kraken-hybrid-maker-fees.h1": "Kraken hybrid maker & market maker fee savings",
    "seo.page.kraken-hybrid-maker-fees.lead":
      "Queries like “market maker bot Kraken” point to fee efficiency: makers often pay lower fees than takers. A hybrid maker approach prefers maker-style placement where risk and microstructure allow.",
    "seo.page.kraken-hybrid-maker-fees.p1":
      "Taker-heavy bots pay more and often lose on frequent market orders. KapitaalBot is focused on controlled execution and risk gates — not on “max volume”. Fee savings are a side effect of avoiding dumb taker flows.",
    "seo.page.kraken-hybrid-maker-fees.p2":
      "There is no guarantee of maker fills: queue dynamics decide. Observability is why you can see which safety modes fire and what execution outcomes appear in the read model.",
    "seo.page.kraken-hybrid-maker-fees.p3": "",
    "seo.page.kraken-hybrid-maker-fees.p4": "",

    "seo.page.crypto-regime-detectie.metaTitle": "Crypto bot regime detection & multi-regime | KapitaalBot",
    "seo.page.crypto-regime-detectie.metaDesc":
      "Regime detection for autonomous crypto bots: why ranging and volatile regimes must be treated differently. Multi-regime routing and guardrails instead of one strategy everywhere.",
    "seo.page.crypto-regime-detectie.h1": "Crypto bot regime detection & multi-regime routing",
    "seo.page.crypto-regime-detectie.lead":
      "“Crypto bot regime detection” is what traders search when they see one strategy bleeding outside its market. KapitaalBot classifies markets into regimes and maps strategy families to conditions — not a single global parameter set.",
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
      "Proof of strategy means you can follow runtime behaviour, regimes, safety, and execution outcomes together — closer to operational truth than a static equity curve alone.",
    "seo.page.live-execution-transparency.p2":
      "Tier 2 adds more execution and latency insight for authorised sessions; request via the access page.",
    "seo.page.live-execution-transparency.p3": "",
    "seo.page.live-execution-transparency.p4": "",

    "seo.page.veilige-kraken-api-bot.metaTitle": "Safe Kraken API bot & deterministic execution | KapitaalBot",
    "seo.page.veilige-kraken-api-bot.metaDesc":
      "Safe Kraken API wiring: deterministic execution, state-machine lifecycles, epochs, and no forbidden REST paths for trading. Operational security by design.",
    "seo.page.veilige-kraken-api-bot.h1": "Safe Kraken API wiring for an autonomous bot",
    "seo.page.veilige-kraken-api-bot.lead":
      "Why does my crypto bot fail? Often because there is no hard truth between “what I think” and “what the exchange executed”. KapitaalBot ties user-data executions to internal state with validation and logging — not a random REST guess.",
    "seo.page.veilige-kraken-api-bot.p1":
      "Safety also means: no ad-hoc hotfixes in prod, no secrets in logs, and no unbounded API surface. This site does not publish keys or live strategy parameters.",
    "seo.page.veilige-kraken-api-bot.p2":
      "Deterministic execution means you can mirror runtime to git commit, schema, and snapshots — not mystery RAM state.",
    "seo.page.veilige-kraken-api-bot.p3": "",
    "seo.page.veilige-kraken-api-bot.p4": "",

    "seo.page.low-latency-crypto-execution-nl.metaTitle": "Low-latency crypto execution engine (Netherlands) | KapitaalBot",
    "seo.page.low-latency-crypto-execution-nl.metaDesc":
      "Low-latency crypto execution with Rust and server discipline: systemd, clear process boundaries, ingest/execution split. Not an HFT promise — serious engineering.",
    "seo.page.low-latency-crypto-execution-nl.h1": "Low-latency crypto execution (Netherlands) — Rust & infrastructure",
    "seo.page.low-latency-crypto-execution-nl.lead":
      "Queries like “low latency crypto execution engine Netherlands” fit a deployment optimised for stability and measurability: Rust, no unnecessary allocations in hot paths, and operational monitoring.",
    "seo.page.low-latency-crypto-execution-nl.p1":
      "Spot is not co-located HFT on the matching engine; “latency” here means fast, reliable WebSocket processing and predictable execution queues — not microsecond arbitrage.",
    "seo.page.low-latency-crypto-execution-nl.p2":
      "“HFT” search intent sometimes attracts the right technical audience; KapitaalBot is positioned as an autonomous spot engine with risk gates — not a latency-arb product.",
    "seo.page.low-latency-crypto-execution-nl.p3": "",
    "seo.page.low-latency-crypto-execution-nl.p4": "",

    "faq.section.seo.title": "Trader & developer search questions",
    "faq.seo.q1": "Why does my crypto bot fail while backtests looked great?",
    "faq.seo.a1":
      "Backtests often miss microstructure, fee models, and regime shifts. A live engine must also model data freshness, outages, and safety modes. Observability is how you see operational drift before it eats capital.",
    "faq.seo.q2": "How do I minimise slippage on Kraken with a bot?",
    "faq.seo.a2":
      "Slippage is driven by spread, queue position, and order aggression. Hybrid maker bias and better timing (regime + state) beat “clicking faster”. KapitaalBot does not publish entry signals; execution aggregates are in read-model snapshots.",
    "faq.seo.q3": "Is this a Kraken WebSocket trading bot?",
    "faq.seo.a3":
      "Yes in the sense that market data and private user data use WebSockets and execution requests go over WS. REST is not the primary trading path; auth tokens are session-scoped as Kraken requires.",
    "faq.seo.q4": "What does multi-regime mean for my risk?",
    "faq.seo.a4":
      "It means the system does not force one strategy on every market. Regime switches and guardrails exist to limit exposure when conditions do not match the chosen strategy families.",
    "faq.seo.q5": "Why is observability an SEO theme for you?",
    "faq.seo.a5":
      "Because “transparent crypto trading bots” are rare: most tools are black boxes. This site shows read-model snapshots and documentation, not live alpha — a deliberate choice for controllability and auditability.",

    "home.seoStrip.title": "Deep dives: Kraken spot engine & observability",
    "home.seoStrip.intro":
      "Articles for developers and serious traders: L3 order book, WebSocket execution, regime detection, hybrid maker fees, safe API wiring, and low-latency infrastructure.",
    "home.seoStrip.cta": "Knowledge base →",
    "home.seoStrip.anchor.l3": "Kraken L3",
    "home.seoStrip.anchor.ws": "WebSocket",
    "home.seoStrip.anchor.maker": "Hybrid maker",
    "home.seoStrip.anchor.regime": "Regime",
};

export const seoStrings: Record<"nl" | "en" | "de" | "fr", Record<string, string>> = {
  nl: seoNl,
  en: seoEn,
  de: { ...seoEn },
  fr: { ...seoEn },
};

export function seoPageKeys(slug: KennisSlug): {
  metaTitle: string;
  metaDesc: string;
  h1: string;
  lead: string;
  p: string[];
} {
  const base = `seo.page.${slug}`;
  return {
    metaTitle: `${base}.metaTitle`,
    metaDesc: `${base}.metaDesc`,
    h1: `${base}.h1`,
    lead: `${base}.lead`,
    p: [`${base}.p1`, `${base}.p2`, `${base}.p3`, `${base}.p4`],
  };
}

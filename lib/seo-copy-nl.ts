/**
 * Native Dutch (NL) — geschreven voor Nederlandse traders en developers.
 * Geen vertaling uit het Engels; zelfstandige formulering, technische termen waar gangbaar in NL fintech.
 */
export const seoNl: Record<string, string> = {
  "nav.kennis": "Kennis",
  "seo.home.metaTitle":
    "KapitaalBot | Autonome Kraken spot-engine · L3-orderboek · WebSocket-observability",
  "seo.home.metaDesc":
    "Volledig autonome crypto-engine op Kraken spot: multi-regime, hybrid maker-gedrag, Kraken WebSocket v2, L3-microstructuur en read-model observability. Voor professionals — géén beloftes van snel rijk worden.",
  "seo.home.keywords":
    "Kraken trading bot, L3 orderboek, WebSocket API, autonome crypto bot, regime-detectie, observability dashboard, spot trading, hybrid maker, execution engine, Nederland, lage latentie, risicomanagement",
  "seo.hub.metaTitle": "Kennisbank | Kraken bot · L3 · regime · observability | KapitaalBot",
  "seo.hub.metaDesc":
    "Diepgaande stukken over een autonome Kraken spot-engine: L3-orderboek, WebSocket-API, regime-detectie, transparante execution, veilige API-koppeling en Rust met lage latentie.",
  "seo.hub.h1": "Kennisbank: Kraken spot, observability en execution",
  "seo.hub.intro":
    "Voor traders en ontwikkelaars die meer willen dan een slogan: echte L3-feeds, WebSocket-first, multi-regime-gedrag en observeerbare runtime. KapitaalBot draait langdurig en state-first — geen zwarte-doos-script.",
  "seo.hub.p1":
    "Start hieronder; de links verwijzen naar het datadashboard (read-model snapshots) en waar nodig naar de architectuurdocumentatie.",

  "seo.hub.card.kraken-l3-orderbook-bot.title": "Kraken L3-orderboek & tradingbot",
  "seo.hub.card.kraken-l3-orderbook-bot.desc":
    "Waarom geauthenticeerde L3 en microstructuur méér zijn dan alleen L2 of REST om de paar seconden.",
  "seo.hub.card.kraken-websocket-api-spot.title": "Kraken WebSocket (spot) i.p.v. trage REST",
  "seo.hub.card.kraken-websocket-api-spot.desc":
    "Vaste WS v2-verbindingen, execution via user-kanaal — latentie en deterministische state tellen mee.",
  "seo.hub.card.kraken-hybrid-maker-fees.title": "Hybrid maker & fees op Kraken",
  "seo.hub.card.kraken-hybrid-maker-fees.desc":
    "Maker versus taker: waarom een hybrid maker-aanpak structureel op fees kan besparen.",
  "seo.hub.card.crypto-regime-detectie.title": "Regime-detectie & zijwaartse markten",
  "seo.hub.card.crypto-regime-detectie.desc":
    "Hoe multi-regime-routing schade beperkt als de markt niet bij je strategie past.",
  "seo.hub.card.live-execution-transparency.title": "Transparante execution & proof of strategy",
  "seo.hub.card.live-execution-transparency.desc":
    "Read-model snapshots, géén live signaalfeed — grip voor operators.",
  "seo.hub.card.veilige-kraken-api-bot.title": "Veilige Kraken-API voor bots",
  "seo.hub.card.veilige-kraken-api-bot.desc":
    "Deterministische execution, state machines, géén REST-hotfixes voor orders.",
  "seo.hub.card.low-latency-crypto-execution-nl.title": "Lage latentie crypto-execution (Nederland)",
  "seo.hub.card.low-latency-crypto-execution-nl.desc":
    "Rust, systemd, scherpe procesgrenzen — latentie als ontwerpkeuze, niet als trucje.",

  "seo.page.kraken-l3-orderbook-bot.metaTitle": "Kraken L3 orderboek tradingbot & microstructuur | KapitaalBot",
  "seo.page.kraken-l3-orderbook-bot.metaDesc":
    "Kraken Spot L3 (authenticated): microstructuur op orderniveau, niet alleen top-of-book. Hoe KapitaalBot L3 naast L2/ticker inzet in een multi-regime-engine.",
  "seo.page.kraken-l3-orderbook-bot.h1": "Kraken L3-orderboek en autonome spot-tradingbot",
  "seo.page.kraken-l3-orderbook-bot.lead":
    "Wie zoekt op ‘Kraken L3 orderbook trading bot’, zoekt zeldzame diepgang: spot, echte L3-feeds, en een engine die microstructuur wél meeneemt in routing en risico.",
  "seo.page.kraken-l3-orderbook-bot.p1":
    "Veel retailbots lezen alleen ticker of het topje van L2. KapitaalBot combineert ticker, trades, L2 en L3 in één state-first keten: eerst wordt `run_symbol_state` opgebouwd; strategie en execution lezen uitsluitend die state — niet uit losse, niet-auditbare caches.",
  "seo.page.kraken-l3-orderbook-bot.p2":
    "L3 kost rate budget en vraagt strikt symbol budgeting; daarom is L3-beschikbaarheid een hoofdmetric op het observability-dashboard. Suitability-filters: slechte microstructuur betekent meestal níet harder handelen, maar níet handelen.",
  "seo.page.kraken-l3-orderbook-bot.p3":
    "Geen beleggingsadvies; dit beschrijft techniek. Geen strategieparameters of signalen — wél inzicht in execution- en risicodiscipline.",
  "seo.page.kraken-l3-orderbook-bot.p4":
    "Zie ook: WebSocket-first execution, regime-detectie en live observability — andere kennisartikelen en het Data-dashboard voor read-model snapshots.",

  "seo.page.kraken-websocket-api-spot.metaTitle": "Kraken API WebSocket tradingbot (spot) | KapitaalBot",
  "seo.page.kraken-websocket-api-spot.metaDesc":
    "Kraken WebSocket v2 voor markt- en privédata; trading via WS na auth-token. Waarom REST geen hoofdroute is voor execution — latentie, determinisme en sessiescope.",
  "seo.page.kraken-websocket-api-spot.h1": "Kraken WebSocket API (spot) als ruggengraat van de bot",
  "seo.page.kraken-websocket-api-spot.lead":
    "De zoekintentie ‘Kraken API websocket trading bot’ past bij een engine die verbindingen lang laat leven, `req_id` netjes routeert, en reconnect plus tokenrotatie serieus neemt.",
  "seo.page.kraken-websocket-api-spot.p1":
    "REST is traag voor strakke state-sync; de bot gebruikt WebSockets voor marktdata (publiek) en private streams voor saldi, executions en orderlevenscyclus. De waarheid over fills zit in user-data, niet in één losse REST-response.",
  "seo.page.kraken-websocket-api-spot.p2":
    "Een echt autonome bot is geen cronscript: verbindingen zijn duurzaam, met backpressure en begrensde queues — fundamenteel anders dan ‘elke minuut REST pollen’.",
  "seo.page.kraken-websocket-api-spot.p3":
    "KapitaalBot.nl toont géén live orderfeed; observability = read-model snapshots (Tier 1/2), transparant zonder strategie te lekken.",
  "seo.page.kraken-websocket-api-spot.p4": "",

  "seo.page.kraken-hybrid-maker-fees.metaTitle": "Kraken makerbot & hybrid maker-fees | KapitaalBot",
  "seo.page.kraken-hybrid-maker-fees.metaDesc":
    "Hybrid maker: waarom de maker/taker-structuur op Kraken voor spot telt. Geen gratis lunch — wél structureel minder taker-kosten dan domweg alles als market nemen.",
  "seo.page.kraken-hybrid-maker-fees.h1": "Kraken hybrid maker en fee-besparing",
  "seo.page.kraken-hybrid-maker-fees.lead":
    "Zoektermen als ‘market maker bot Kraken’ gaan over fee-efficiëntie: makers betalen vaak minder dan takers. Hybrid maker zoekt waar het kan maker-achtige plaatsing, binnen risico en microstructuur.",
  "seo.page.kraken-hybrid-maker-fees.p1":
    "Taker-zware bots betalen meer en verliezen vaak op frequente market orders. KapitaalBot is gericht op gecontroleerde execution en risk gates — niet op ‘maximaal volume’. Fee-voordeel volgt als je domme taker-stromen vermijdt.",
  "seo.page.kraken-hybrid-maker-fees.p2":
    "Geen garantie op maker fills: queue en regime bepalen de uitkomst. Observability laat zien welke safety-modes branden en welke execution-resultaten in het read-model landen.",
  "seo.page.kraken-hybrid-maker-fees.p3": "",
  "seo.page.kraken-hybrid-maker-fees.p4": "",

  "seo.page.crypto-regime-detectie.metaTitle": "Crypto bot regime-detectie & multi-regime | KapitaalBot",
  "seo.page.crypto-regime-detectie.metaDesc":
    "Regime-detectie voor autonome bots: zijwaarts, trend, hoge vol — niet hetzelfde behandelen. Multi-regime-routing en guardrails in plaats van één strategie overal.",
  "seo.page.crypto-regime-detectie.h1": "Crypto bot regime-detectie en multi-regime-routing",
  "seo.page.crypto-regime-detectie.lead":
    "Mensen zoeken ‘crypto bot regime detection’ als één strategie buiten de juiste markt lekt. KapitaalBot classificeert markten in regimes en koppelt strategiefamilies aan voorwaarden — niet aan één globale parameterset.",
  "seo.page.crypto-regime-detectie.p1":
    "Regime-informatie staat in observability snapshots (dominante regimes, switches, strategieën). Het doel is geen voorspellen; het doel is voorwaardelijk beschermen: risico omlaag als microstructuur of datakwaliteit tegenzit.",
  "seo.page.crypto-regime-detectie.p2":
    "Verliezen in volatiele markten voorkomen is geen belofte — wél ontwerp: exit-only, hard blocks en exposure caps horen bij de eerste verdedigingslinie.",
  "seo.page.crypto-regime-detectie.p3": "",
  "seo.page.crypto-regime-detectie.p4": "",

  "seo.page.live-execution-transparency.metaTitle": "Live tradingbot monitoring & execution-transparantie | KapitaalBot",
  "seo.page.live-execution-transparency.metaDesc":
    "Monitoringdashboard op read-modelbasis: snapshots van orders, fills, safety, latency-aggregaties waar beschikbaar. Proof of strategy met data — geen black box.",
  "seo.page.live-execution-transparency.h1": "Live execution-transparantie en observability-dashboard",
  "seo.page.live-execution-transparency.lead":
    "‘Real-time trading bot monitoring dashboard’ klinkt als tick-voor-tick signalen; Tier 1 is bewust vertraagd en geaggregeerd — transparantie voor operators zonder strategie reverse-engineeren.",
  "seo.page.live-execution-transparency.p1":
    "Proof of strategy: runtime-gedrag, regimes, safety en execution-uitkomsten in één beeld. Dat ligt dichter bij operationele waarheid dan alleen een equitylijn.",
  "seo.page.live-execution-transparency.p2":
    "Tier 2 geeft meer execution- en latency-diepte voor geautoriseerde sessies; aanvragen via de toegangspagina.",
  "seo.page.live-execution-transparency.p3": "",
  "seo.page.live-execution-transparency.p4": "",

  "seo.page.veilige-kraken-api-bot.metaTitle": "Veilige Kraken-API-bot & deterministische execution | KapitaalBot",
  "seo.page.veilige-kraken-api-bot.metaDesc":
    "Veilige API-koppeling: deterministische execution, state-machine lifecycle, epochs, géén verboden REST-paden voor trading. Security hoort bij het ontwerp.",
  "seo.page.veilige-kraken-api-bot.h1": "Veilige Kraken-API voor een autonome bot",
  "seo.page.veilige-kraken-api-bot.lead":
    "Waarom faalt mijn crypto bot? Vaak ontbreekt harde waarheid tussen ‘wat ik denk’ en ‘wat de exchange echt heeft uitgevoerd’. KapitaalBot koppelt user-data executions aan interne state, met validatie en logging — geen REST-gokwerk.",
  "seo.page.veilige-kraken-api-bot.p1":
    "Veilig is ook: geen ad-hoc hotfixes in productie, geen secrets in logs, geen onbeperkte API-oppervlakte. Deze site publiceert geen keys en geen live strategieparameters.",
  "seo.page.veilige-kraken-api-bot.p2":
    "Deterministische execution: je kunt runtime spiegelen aan git-commit, schema en snapshots — niet aan geheimzinnige RAM-state.",
  "seo.page.veilige-kraken-api-bot.p3": "",
  "seo.page.veilige-kraken-api-bot.p4": "",

  "seo.page.low-latency-crypto-execution-nl.metaTitle": "Lage latentie crypto execution-engine Nederland | KapitaalBot",
  "seo.page.low-latency-crypto-execution-nl.metaDesc":
    "Lage latentie met Rust en strakke serverpraktijk: systemd, duidelijke procesgrenzen, split tussen ingest en execution. Geen HFT-belofte — wél serieuze techniek.",
  "seo.page.low-latency-crypto-execution-nl.h1": "Lage latentie crypto-execution (Nederland) — Rust en infrastructuur",
  "seo.page.low-latency-crypto-execution-nl.lead":
    "Wie zoekt op ‘low latency crypto execution engine Nederland’, wil meestal stabiliteit en meetbaarheid: Rust, geen overbodige allocaties in hot paths, en monitoring die klopt.",
  "seo.page.low-latency-crypto-execution-nl.p1":
    "Spot is geen co-located HFT op de matching engine; hier betekent ‘latentie’: snelle, betrouwbare WebSocket-verwerking en voorspelbare execution-queues — geen microseconden-arbitrage.",
  "seo.page.low-latency-crypto-execution-nl.p2":
    "Zoekintentie ‘HFT’ trekt soms wél de juiste technische mensen; KapitaalBot is een autonome spot-engine met risk gates — geen latency-arb-product.",
  "seo.page.low-latency-crypto-execution-nl.p3": "",
  "seo.page.low-latency-crypto-execution-nl.p4": "",

  "faq.section.seo.title": "Vragen van traders en developers",
  "faq.seo.q1": "Waarom faalt mijn crypto bot terwijl de backtests goed waren?",
  "faq.seo.a1":
    "Backtests missen vaak microstructuur, fee-modellen en regimeshifts. Live telt ook dataversheid, exchange-storingen en safety-modes. Observability is geen luxe: zo zie je operationele drift voordat die je kapitaal oppeuzelt.",
  "faq.seo.q2": "Hoe beperk ik slippage op Kraken met een bot?",
  "faq.seo.a2":
    "Slippage hangt samen met spread, queue-positie en hoe agressief je ordert. Hybrid maker en betere timing (regime + state) helpen meer dan ‘nog sneller klikken’. KapitaalBot publiceert geen entry-signalen; aggregaties staan in read-model snapshots.",
  "faq.seo.q3": "Is dit een Kraken WebSocket trading bot?",
  "faq.seo.a3":
    "In die zin wel: marktdata en private user-data lopen via WebSockets, execution-requests ook. REST is geen hoofdpad voor trading; auth-tokens zijn sessiegebonden zoals Kraken voorschrijft.",
  "faq.seo.q4": "Wat betekent multi-regime voor mijn risico?",
  "faq.seo.a4":
    "Het systeem dwingt niet één strategie op elke markt af. Regimewissels en guardrails beperken exposure als de condities niet bij je strategiefamilies passen.",
  "faq.seo.q5": "Waarom is observability bij jullie zo’n thema?",
  "faq.seo.a5":
    "Omdat echte transparantie bij crypto-bots zeldzaam is: de meeste tools zijn black boxes. Deze site toont read-model snapshots en documentatie, geen live alpha — bewust voor controle en audit.",
  "home.seoStrip.title": "Verder lezen: Kraken spot-engine en observability",
  "home.seoStrip.intro":
    "Stukken voor ontwikkelaars en serieuze traders: L3-orderboek, WebSocket-execution, regime-detectie, hybrid maker, veilige API en infrastructuur met lage latentie.",
  "home.seoStrip.cta": "Naar de kennisbank →",
  "home.seoStrip.anchor.l3": "Kraken L3",
  "home.seoStrip.anchor.ws": "WebSocket",
  "home.seoStrip.anchor.maker": "Hybrid maker",
  "home.seoStrip.anchor.regime": "Regime",
};

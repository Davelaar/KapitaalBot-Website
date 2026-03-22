/**
 * Native German (DE) marketing/SEO copy for KapitaalBot — geschrieben für ein deutschsprachiges Publikum
 * (Trader, Entwickler, Ops). Keine Übersetzung aus dem Englischen; eigenständige Formulierung.
 */
export const seoDe: Record<string, string> = {
  "nav.kennis": "Wissen",
  "seo.home.metaTitle":
    "KapitaalBot | Autonome Kraken-Spot-Engine · L3-Orderbuch · WebSocket-Observability",
  "seo.home.metaDesc":
    "Vollautomatisierte Crypto-Trading-Engine auf Kraken Spot: Multi-Regime-Erkennung, Hybrid-Maker-Fokus, Kraken WebSocket v2, L3-Mikrostruktur und Read-Model-Observability. Für Profis — kein Schnell-reich-Marketing.",
  "seo.home.keywords":
    "Kraken Trading Bot, L3 Orderbuch, WebSocket API, autonomer Crypto Bot, Regime-Erkennung, Observability Dashboard, Spot Trading, Hybrid Maker, Execution Engine, Deutschland, Low Latency, Risikomanagement",
  "seo.hub.metaTitle": "Wissensbasis | Kraken Bot · L3 · Regime · Observability | KapitaalBot",
  "seo.hub.metaDesc":
    "Technische Artikel zu einer vollautonomen Kraken-Spot-Engine: L3-Orderbuch, WebSocket-API, Regime-Erkennung, Live-Execution-Transparenz, sichere API-Anbindung und Low-Latency in Rust.",
  "seo.hub.h1": "Wissensbasis: Kraken Spot, Observability & Execution",
  "seo.hub.intro":
    "Diese Texte richten sich an Trader und Entwickler, die Substanz suchen: Kraken L3, WebSocket-first, Multi-Regime-Verhalten und nachvollziehbare Observability. KapitaalBot ist eine lang laufende, state-first Runtime — kein Blackbox-Skript.",
  "seo.hub.p1":
    "Die Links unten sind Einstiege; sie führen zum Dashboard (Read-Model-Snapshots) und bei Bedarf zur Architekturdokumentation.",

  "seo.hub.card.kraken-l3-orderbook-bot.title": "Kraken L3-Orderbuch & Trading-Bot",
  "seo.hub.card.kraken-l3-orderbook-bot.desc":
    "Warum authentifiziertes L3 und Mikrostruktur-Metriken mehr sind als reines L2 oder REST-Polling.",
  "seo.hub.card.kraken-websocket-api-spot.title": "Kraken WebSocket API (Spot) statt langsamer REST",
  "seo.hub.card.kraken-websocket-api-spot.desc":
    "Persistente WS v2, Execution über User-Channel — Latenz und deterministischer State zählen.",
  "seo.hub.card.kraken-hybrid-maker-fees.title": "Hybrid Maker & Gebühren auf Kraken",
  "seo.hub.card.kraken-hybrid-maker-fees.desc":
    "Maker vs. Taker: Warum ein Hybrid-Maker-Ansatz Gebühren strukturell drücken kann.",
  "seo.hub.card.crypto-regime-detectie.title": "Crypto-Regime & Seitwärtsmärkte",
  "seo.hub.card.crypto-regime-detectie.desc":
    "Wie Multi-Regime-Routing Verluste abfedert, wenn die Marktlage nicht passt.",
  "seo.hub.card.live-execution-transparency.title": "Live-Execution-Transparenz & Strategy Proof",
  "seo.hub.card.live-execution-transparency.desc":
    "Read-Model-Snapshots, kein Live-Signalfeed — Steuerbarkeit für Betrieb.",
  "seo.hub.card.veilige-kraken-api-bot.title": "Sichere Kraken-API für Bots",
  "seo.hub.card.veilige-kraken-api-bot.desc":
    "Deterministische Execution, Zustandsautomaten, keine Ad-hoc-REST-Trading-Pfade.",
  "seo.hub.card.low-latency-crypto-execution-nl.title": "Low-Latency Crypto-Execution (DACH)",
  "seo.hub.card.low-latency-crypto-execution-nl.desc":
    "Rust, systemd, klare Prozessgrenzen — operative Latenz als Designziel.",

  "seo.page.kraken-l3-orderbook-bot.metaTitle": "Kraken L3 Order Book Trading Bot & Mikrostruktur | KapitaalBot",
  "seo.page.kraken-l3-orderbook-bot.metaDesc":
    "Kraken Spot L3 (authentifiziert): Microstructure auf Order-Ebene statt nur Top-of-Book. Wie KapitaalBot L3 neben L2/Ticker in einer Multi-Regime-Engine nutzt.",
  "seo.page.kraken-l3-orderbook-bot.h1": "Kraken L3-Orderbuch & autonomer Spot-Trading-Bot",
  "seo.page.kraken-l3-orderbook-bot.lead":
    "Wer nach „Kraken L3 orderbook trading bot“ sucht, meint seltene Tiefe: Spot, echte L3-Feeds, und eine Engine, die Mikrostruktur in Routing und Risiko einpreist.",
  "seo.page.kraken-l3-orderbook-bot.p1":
    "Viele Retail-Bots lesen nur Ticker oder L2-Top-of-Book. KapitaalBot bündelt Ticker, Trades, L2 und L3 in einem State-first-Modell: Zuerst entsteht `run_symbol_state`; Strategie und Execution lesen nur daraus — nicht aus verstreuten Caches ohne Auditierbarkeit.",
  "seo.page.kraken-l3-orderbook-bot.p2":
    "L3 kostet Rate-Budget und braucht striktes Symbol-Budgeting; deshalb ist L3-Verfügbarkeit eine Kernmetrik im Observability-Dashboard. Suitability-Filter greifen: schlechte Mikrostruktur heißt oft: nicht handeln.",
  "seo.page.kraken-l3-orderbook-bot.p3":
    "Keine Anlageberatung; hier geht es um Architektur. Keine Strategieparameter, keine Signale — aber Klarheit über Execution- und Risikodisziplin.",
  "seo.page.kraken-l3-orderbook-bot.p4":
    "Mehr dazu: WebSocket-first, Regime-Erkennung, Live-Observability — siehe die anderen Artikel und das Daten-Dashboard für Read-Model-Snapshots.",

  "seo.page.kraken-websocket-api-spot.metaTitle": "Kraken API WebSocket Trading Bot (Spot) | KapitaalBot",
  "seo.page.kraken-websocket-api-spot.metaDesc":
    "Kraken WebSocket v2 für Markt- und Private-User-Daten; Trading-Requests über WS nach Auth-Token. Warum REST kein Hauptpfad für Execution ist.",
  "seo.page.kraken-websocket-api-spot.h1": "Kraken WebSocket API (Spot) als Rückgrat des Bots",
  "seo.page.kraken-websocket-api-spot.lead":
    "Die Suchintention „Kraken API websocket trading bot“ passt zu einer Engine mit persistenten Verbindungen, `req_id`-Routing und sauberem Reconnect samt Token-Rotation.",
  "seo.page.kraken-websocket-api-spot.p1":
    "REST taugt nicht für hohe State-Sync-Frequenz; der Bot nutzt WebSockets für Marktdaten (öffentlich) und private Streams für Salden, Executions und Order-Lebenszyklen. Wahrheit bei Fills kommt aus User-Daten, nicht aus einer einzelnen REST-Antwort.",
  "seo.page.kraken-websocket-api-spot.p2":
    "Ein vollautonomer Bot ist kein Cron-Skript: Verbindungen leben lang, mit Backpressure und begrenzten Queues — ein anderes Tier als „jede Minute REST pollen“.",
  "seo.page.kraken-websocket-api-spot.p3":
    "KapitaalBot.nl zeigt keine Live-Orderfeed; Observability läuft über Read-Model-Snapshots (Tier 1/2) — transparent ohne Strategieleck.",
  "seo.page.kraken-websocket-api-spot.p4": "",

  "seo.page.kraken-hybrid-maker-fees.metaTitle": "Kraken Maker-Bot & Hybrid-Maker-Gebühren | KapitaalBot",
  "seo.page.kraken-hybrid-maker-fees.metaDesc":
    "Hybrid Maker: Warum die Maker/Taker-Gebührenstruktur auf Kraken für eine Spot-Engine zählt. Kein „Gratisgeld“ — sondern Kostenkontrolle statt reiner Taker-Automation.",
  "seo.page.kraken-hybrid-maker-fees.h1": "Kraken Hybrid Maker & Gebührenvorteil",
  "seo.page.kraken-hybrid-maker-fees.lead":
    "Suchanfragen wie „market maker bot Kraken“ zielen auf Effizienz: Maker zahlen oft weniger als Taker. Hybrid Maker versucht dort maker-nahe Platzierung, wo Risiko und Mikrostruktur es erlauben.",
  "seo.page.kraken-hybrid-maker-fees.p1":
    "Taker-lastige Bots zahlen mehr und verlieren oft bei häufigen Market-Orders. KapitaalBot priorisiert kontrollierte Execution und Risk Gates — nicht „maximales Volumen“. Gebührenersparnis ist Nebenwirkung, wenn man dumme Taker-Flüsse vermeidet.",
  "seo.page.kraken-hybrid-maker-fees.p2":
    "Maker-Fills sind nicht garantiert: Queue und Regime entscheiden. Observability zeigt, welche Safety-Modi aktiv sind und welche Execution-Ergebnisse im Read-Model landen.",
  "seo.page.kraken-hybrid-maker-fees.p3": "",
  "seo.page.kraken-hybrid-maker-fees.p4": "",

  "seo.page.crypto-regime-detectie.metaTitle": "Crypto-Bot Regime-Erkennung & Multi-Regime | KapitaalBot",
  "seo.page.crypto-regime-detectie.metaDesc":
    "Regime-Erkennung für autonome Crypto-Bots: Seitwärts vs. Trend vs. hohe Volatilität — unterschiedlich behandeln. Multi-Regime-Routing statt einer Strategie für alles.",
  "seo.page.crypto-regime-detectie.h1": "Crypto-Bot Regime-Erkennung & Multi-Regime-Routing",
  "seo.page.crypto-regime-detectie.lead":
    "Wer „crypto bot regime detection“ sucht, hat oft ein Problem: eine Strategie, die außerhalb ihrer Marktphase blutet. KapitaalBot ordnet Märkte Regimen zu und koppelt Strategiefamilien an Bedingungen — nicht an einen globalen Parametersatz.",
  "seo.page.crypto-regime-detectie.p1":
    "Regime-Infos stehen in Observability-Snapshots (dominante Regime, Wechsel, Strategien). Ziel ist kein Orakel, sondern bedingte Absicherung: Risiko runter, wenn Mikrostruktur oder Datenqualität schlecht sind.",
  "seo.page.crypto-regime-detectie.p2":
    "Verluste in volatilen Märkten zu vermeiden ist kein Versprechen — aber Designziel: Safety-Modi (exit-only, hard blocks) und Exposure-Caps sind erstklassig.",
  "seo.page.crypto-regime-detectie.p3": "",
  "seo.page.crypto-regime-detectie.p4": "",

  "seo.page.live-execution-transparency.metaTitle": "Live Trading-Bot Monitoring & Execution-Transparenz | KapitaalBot",
  "seo.page.live-execution-transparency.metaDesc":
    "Monitoring-Dashboard auf Read-Model-Basis: Snapshots zu Orders, Fills, Safety, Latenz-Aggregaten wo verfügbar. Strategy Proof über Daten — keine Blackbox.",
  "seo.page.live-execution-transparency.h1": "Live-Execution-Transparenz & Observability-Dashboard",
  "seo.page.live-execution-transparency.lead":
    "„Real-time trading bot monitoring“ klingt nach Tick-für-Tick-Signalen — Tier 1 ist bewusst verzögert und aggregiert: Transparenz für Betrieb ohne Strategie-Reverse-Engineering.",
  "seo.page.live-execution-transparency.p1":
    "Strategy Proof heißt: Laufzeitverhalten, Regime, Safety und Execution-Ergebnisse zusammen betrachten — näher an operativer Wahrheit als nur eine Equity-Kurve.",
  "seo.page.live-execution-transparency.p2":
    "Tier 2 liefert mehr Execution- und Latenz-Tiefe für autorisierte Sessions — Anfrage über die Zugangsseite.",
  "seo.page.live-execution-transparency.p3": "",
  "seo.page.live-execution-transparency.p4": "",

  "seo.page.veilige-kraken-api-bot.metaTitle": "Sicherer Kraken-API-Bot & deterministische Execution | KapitaalBot",
  "seo.page.veilige-kraken-api-bot.metaDesc":
    "Sichere API-Anbindung: deterministische Execution, State-Machine-Lebenszyklen, Epochen, keine verbotenen REST-Pfade fürs Trading. Security by Design.",
  "seo.page.veilige-kraken-api-bot.h1": "Sichere Kraken-API-Anbindung für einen autonomen Bot",
  "seo.page.veilige-kraken-api-bot.lead":
    "Warum scheitert mein Crypto-Bot? Oft fehlt harte Wahrheit zwischen „was ich glaube“ und „was die Börse ausgeführt hat“. KapitaalBot verbindet User-Data-Executions mit internem State, inklusive Validierung und Logging — kein REST-Raten.",
  "seo.page.veilige-kraken-api-bot.p1":
    "Sicherheit heißt auch: keine Ad-hoc-Hotfixes in Prod, keine Secrets in Logs, keine unbegrenzte API-Oberfläche. Diese Site veröffentlicht keine Keys und keine Live-Strategieparameter.",
  "seo.page.veilige-kraken-api-bot.p2":
    "Deterministische Execution: Laufzeit lässt sich auf Git-Commit, Schema und Snapshots spiegeln — kein Geheimnis-RAM-State.",
  "seo.page.veilige-kraken-api-bot.p3": "",
  "seo.page.veilige-kraken-api-bot.p4": "",

  "seo.page.low-latency-crypto-execution-nl.metaTitle": "Low-Latency Crypto-Execution (DACH) | KapitaalBot",
  "seo.page.low-latency-crypto-execution-nl.metaDesc":
    "Low-Latency mit Rust und Server-Disziplin: systemd, klare Grenzen, Ingest/Execution-Split. Kein HFT-Versprechen — sondern solide Engineering-Kultur.",
  "seo.page.low-latency-crypto-execution-nl.h1": "Low-Latency Crypto-Execution (DACH) — Rust & Infrastruktur",
  "seo.page.low-latency-crypto-execution-nl.lead":
    "Wer nach „low latency crypto execution“ sucht, will oft Stabilität und Messbarkeit: Rust, keine unnötigen Allokationen in Hot Paths, und sauberes Monitoring.",
  "seo.page.low-latency-crypto-execution-nl.p1":
    "Spot ist kein Co-Location-HFT an der Matching Engine; „Latenz“ heißt hier: zuverlässige WebSocket-Verarbeitung und vorhersehbare Execution-Queues — keine Mikrosekunden-Arbitrage.",
  "seo.page.low-latency-crypto-execution-nl.p2":
    "„HFT“-Suchintention zieht manchmal die richtige technische Zielgruppe; KapitaalBot ist eine autonome Spot-Engine mit Risk Gates — kein Latency-Arb-Produkt.",
  "seo.page.low-latency-crypto-execution-nl.p3": "",
  "seo.page.low-latency-crypto-execution-nl.p4": "",

  "faq.section.seo.title": "Typische Fragen von Tradern & Entwicklern",
  "faq.seo.q1": "Warum scheitert mein Crypto-Bot, obwohl Backtests gut aussahen?",
  "faq.seo.a1":
    "Backtests vergessen oft Mikrostruktur, Gebührenmodelle und Regime-Wechsel. Live braucht es Frische der Daten, Ausfall-Verhalten und Safety-Modi. Observability ist kein Luxus — sie zeigt Drift, bevor Kapital draufgeht.",
  "faq.seo.q2": "Wie reduziere ich Slippage auf Kraken mit einem Bot?",
  "faq.seo.a2":
    "Slippage hängt von Spread, Queue-Position und Order-Aggression ab. Hybrid-Maker und besseres Timing (Regime + State) schlagen „schneller klicken“. KapitaalBot veröffentlicht keine Entry-Signale; Aggregationen stehen in Read-Model-Snapshots.",
  "faq.seo.q3": "Ist das ein Kraken-WebSocket-Trading-Bot?",
  "faq.seo.a3":
    "In dem Sinn: Marktdaten und private User-Daten laufen über WebSockets, Trading-Requests über WS. REST ist kein Hauptpfad; Auth-Tokens sind sitzungsgebunden wie von Kraken vorgesehen.",
  "faq.seo.q4": "Was bedeutet Multi-Regime für mein Risiko?",
  "faq.seo.a4":
    "Das System erzwingt nicht eine Strategie auf jedem Markt. Regime-Wechsel und Guardrails begrenzen Exposure, wenn Bedingungen nicht zu den Strategiefamilien passen.",
  "faq.seo.q5": "Warum ist Observability bei euch ein Kernthema?",
  "faq.seo.a5":
    "Weil „transparente Crypto-Trading-Bots“ selten sind: die meisten Tools sind Blackboxes. Diese Site zeigt Read-Model-Snapshots und Doku, keine Live-Alpha — bewusst für Kontrollierbarkeit und Auditierbarkeit.",

  "home.seoStrip.title": "Technische Tiefe: Kraken Spot & Observability",
  "home.seoStrip.intro":
    "Artikel für Entwickler und anspruchsvolle Trader: L3-Orderbuch, WebSocket-Execution, Regime-Erkennung, Hybrid-Maker, sichere API, Low-Latency-Infrastruktur.",
  "home.seoStrip.cta": "Zur Wissensbasis →",
  "home.seoStrip.anchor.l3": "Kraken L3",
  "home.seoStrip.anchor.ws": "WebSocket",
  "home.seoStrip.anchor.maker": "Hybrid Maker",
  "home.seoStrip.anchor.regime": "Regime",
};

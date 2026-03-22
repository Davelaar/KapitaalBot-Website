/**
 * Textes SEO FR — rédigés pour un public francophone (traders, développeurs, ops).
 * Rédaction native, pas une traduction mot à mot depuis l’anglais.
 */
export const seoFr: Record<string, string> = {
  "nav.kennis": "Ressources",
  "seo.home.metaTitle":
    "KapitaalBot | Moteur spot Kraken autonome · carnet L3 · observabilité WebSocket",
  "seo.home.metaDesc":
    "Moteur de trading crypto autonome sur Kraken spot : détection multi-régime, logique hybrid maker, exécution WebSocket v2, métriques L3 et observabilité read-model. Pour traders et développeurs exigeants — pas de promesses de gains rapides.",
  "seo.home.keywords":
    "bot trading Kraken, carnet d'ordres L3, API WebSocket, bot crypto autonome, détection de régime, tableau de bord observabilité, trading spot, hybrid maker, moteur d'exécution, France, faible latence, gestion du risque",
  "seo.hub.metaTitle": "Base de connaissances | Bot Kraken · L3 · régime · observabilité | KapitaalBot",
  "seo.hub.metaDesc":
    "Articles techniques sur un moteur spot Kraken entièrement autonome : carnet L3, API WebSocket, détection de régime, transparence d’exécution, API sécurisée et faible latence en Rust.",
  "seo.hub.h1": "Base de connaissances : moteur spot Kraken, observabilité et exécution",
  "seo.hub.intro":
    "Ces pages s’adressent aux traders et développeurs qui veulent du fond : L3 Kraken, exécution WebSocket d’abord, comportement multi-régime et observabilité vérifiable. KapitaalBot est une runtime longue durée, state-first — pas un script boîte noire.",
  "seo.hub.p1":
    "Les liens ci-dessous servent de point d’entrée ; ils renvoient vers le tableau de bord (snapshots read-model) et vers la documentation d’architecture lorsque c’est pertinent.",

  "seo.hub.card.kraken-l3-orderbook-bot.title": "Carnet d’ordres L3 Kraken et bot de trading",
  "seo.hub.card.kraken-l3-orderbook-bot.desc":
    "Pourquoi un L3 authentifié et la microstructure comptent au-delà du seul L2 ou du polling REST.",
  "seo.hub.card.kraken-websocket-api-spot.title": "API WebSocket Kraken (spot) plutôt que REST lent",
  "seo.hub.card.kraken-websocket-api-spot.desc":
    "WS v2 persistant, exécution via canal utilisateur — latence et état déterministe.",
  "seo.hub.card.kraken-hybrid-maker-fees.title": "Hybrid maker et frais sur Kraken",
  "seo.hub.card.kraken-hybrid-maker-fees.desc":
    "Maker vs taker : pourquoi une approche hybrid maker peut réduire les frais durablement.",
  "seo.hub.card.crypto-regime-detectie.title": "Régimes crypto et marchés latéraux",
  "seo.hub.card.crypto-regime-detectie.desc":
    "Comment le routage multi-régime limite les dégâts quand le contexte ne convient pas.",
  "seo.hub.card.live-execution-transparency.title": "Transparence d’exécution et preuve de stratégie",
  "seo.hub.card.live-execution-transparency.desc":
    "Snapshots read-model, pas de flux de signaux temps réel — pilotage pour l’exploitation.",
  "seo.hub.card.veilige-kraken-api-bot.title": "API Kraken sécurisée pour bots",
  "seo.hub.card.veilige-kraken-api-bot.desc":
    "Exécution déterministe, machines à états, pas de chemins REST ad hoc pour trader.",
  "seo.hub.card.low-latency-crypto-execution-nl.title": "Exécution crypto faible latence (France / UE)",
  "seo.hub.card.low-latency-crypto-execution-nl.desc":
    "Rust, systemd, frontières de processus nettes — la latence comme choix d’ingénierie.",

  "seo.page.kraken-l3-orderbook-bot.metaTitle": "Bot trading carnet L3 Kraken & microstructure | KapitaalBot",
  "seo.page.kraken-l3-orderbook-bot.metaDesc":
    "Flux L3 authentifié Kraken spot : microstructure au niveau ordre, pas seulement le top du carnet. Comment KapitaalBot utilise L3 avec L2/ticker dans un moteur multi-régime.",
  "seo.page.kraken-l3-orderbook-bot.h1": "Carnet L3 Kraken et bot spot autonome",
  "seo.page.kraken-l3-orderbook-bot.lead":
    "La requête « Kraken L3 orderbook trading bot » désigne une pile rare : spot, flux L3 authentifiés, et un moteur qui intègre la microstructure dans le routage et le risque.",
  "seo.page.kraken-l3-orderbook-bot.p1":
    "Beaucoup de bots de détail ne lisent que le ticker ou le haut du L2. KapitaalBot combine ticker, trades, L2 et L3 en state-first : on construit d’abord `run_symbol_state` ; stratégie et exécution ne lisent que cet état — pas des caches opaques.",
  "seo.page.kraken-l3-orderbook-bot.p2":
    "Le L3 coûte cher en budget de requêtes et impose un budget symboles strict ; d’où la disponibilité L3 comme métrique majeure du tableau d’observabilité. Des filtres d’éligibilité s’appliquent : une microstructure médiocre veut souvent dire ne pas trader.",
  "seo.page.kraken-l3-orderbook-bot.p3":
    "Pas de conseil en investissement ; il s’agit d’architecture. Pas de paramètres de stratégie, pas de signaux — mais de la clarté sur la discipline d’exécution et de risque.",
  "seo.page.kraken-l3-orderbook-bot.p4":
    "À lire aussi : exécution WebSocket d’abord, détection de régime, observabilité live — voir les autres articles et le tableau Données pour les snapshots read-model.",

  "seo.page.kraken-websocket-api-spot.metaTitle": "Bot trading API WebSocket Kraken (spot) | KapitaalBot",
  "seo.page.kraken-websocket-api-spot.metaDesc":
    "WebSocket v2 Kraken pour données marché et données privées ; requêtes de trading via WS après jeton. Pourquoi REST n’est pas la voie principale d’exécution.",
  "seo.page.kraken-websocket-api-spot.h1": "API WebSocket Kraken (spot) au cœur du bot",
  "seo.page.kraken-websocket-api-spot.lead":
    "L’intention « Kraken API websocket trading bot » correspond à un moteur qui multiplexe des connexions persistantes, route les `req_id` et traite sérieusement reconnexion et rotation de jetons.",
  "seo.page.kraken-websocket-api-spot.p1":
    "Le REST est trop lent pour une synchro d’état élevée ; le bot utilise le WebSocket pour le marché (public) et les flux privés pour soldes, exécutions et cycle de vie des ordres. La vérité des fills vient des données utilisateur, pas d’une réponse REST isolée.",
  "seo.page.kraken-websocket-api-spot.p2":
    "Un bot vraiment autonome n’est pas un cron bricolé : connexions longues, backpressure, files bornées — autre monde que « un script qui poll du REST chaque minute ».",
  "seo.page.kraken-websocket-api-spot.p3":
    "KapitaalBot.nl ne montre pas de flux d’ordres live ; l’observabilité repose sur des snapshots read-model (Tier 1/2) — transparence sans fuite de stratégie.",
  "seo.page.kraken-websocket-api-spot.p4": "",

  "seo.page.kraken-hybrid-maker-fees.metaTitle": "Bot maker Kraken & frais hybrid maker | KapitaalBot",
  "seo.page.kraken-hybrid-maker-fees.metaDesc":
    "Hybrid maker : pourquoi la structure maker/taker de Kraken compte pour un moteur spot. Pas d’argent « gratuit » — plutôt maîtrise des coûts face à l’automation 100 % taker.",
  "seo.page.kraken-hybrid-maker-fees.h1": "Hybrid maker Kraken et réduction des frais",
  "seo.page.kraken-hybrid-maker-fees.lead":
    "Les requêtes type « market maker bot Kraken » visent l’efficacité : les makers paient souvent moins que les takers. L’approche hybrid maker préfère un placement de type maker lorsque le risque et la microstructure le permettent.",
  "seo.page.kraken-hybrid-maker-fees.p1":
    "Les bots très taker paient plus et perdent souvent sur des ordres au marché fréquents. KapitaalBot vise une exécution contrôlée et des garde-fous de risque — pas le volume maximal. Économiser des frais est un effet secondaire quand on évite les flux taker stupides.",
  "seo.page.kraken-hybrid-maker-fees.p2":
    "Aucune garantie de fills maker : la file et le régime décident. L’observabilité montre quels modes de sécurité s’activent et quels résultats d’exécution apparaissent dans le read-model.",
  "seo.page.kraken-hybrid-maker-fees.p3": "",
  "seo.page.kraken-hybrid-maker-fees.p4": "",

  "seo.page.crypto-regime-detectie.metaTitle": "Détection de régime bot crypto & multi-régime | KapitaalBot",
  "seo.page.crypto-regime-detectie.metaDesc":
    "Détection de régime pour bots autonomes : pourquoi marchés latéraux et forte volatilité ne se traitent pas pareil. Routage multi-régime et garde-fous, pas une seule stratégie partout.",
  "seo.page.crypto-regime-detectie.h1": "Détection de régime bot crypto et routage multi-régime",
  "seo.page.crypto-regime-detectie.lead":
    "On cherche « crypto bot regime detection » quand une stratégie saigne hors de son marché. KapitaalBot classe les marchés en régimes et associe des familles de stratégies à des conditions — pas un jeu de paramètres global unique.",
  "seo.page.crypto-regime-detectie.p1":
    "Les infos de régime figurent dans les snapshots observabilité (régimes dominants, bascules, stratégies). Le but n’est pas de prédire — mais de couvrir à conditions : réduire le risque quand la microstructure ou la qualité des données se dégrade.",
  "seo.page.crypto-regime-detectie.p2":
    "Éviter les pertes sur marchés volatils n’est pas une promesse — c’est un objectif de conception : modes de sécurité (exit-only, blocages) et plafonds d’exposition au premier plan.",
  "seo.page.crypto-regime-detectie.p3": "",
  "seo.page.crypto-regime-detectie.p4": "",

  "seo.page.live-execution-transparency.metaTitle": "Monitoring bot trading & transparence d’exécution | KapitaalBot",
  "seo.page.live-execution-transparency.metaDesc":
    "Tableau de bord type monitoring (read-model) : snapshots ordres, fills, sécurité, agrégats de latence si dispo. Preuve de stratégie par les données — pas de boîte noire.",
  "seo.page.live-execution-transparency.h1": "Transparence d’exécution et tableau d’observabilité",
  "seo.page.live-execution-transparency.lead":
    "« Real-time trading bot monitoring dashboard » évoque le signal tick à tick — ici Tier 1 est volontairement retardé et agrégé : transparence opérationnelle sans reverse-engineering de stratégie.",
  "seo.page.live-execution-transparency.p1":
    "Preuve de stratégie : suivre ensemble comportement runtime, régimes, sécurité et résultats d’exécution — plus proche de la vérité opérationnelle qu’une courbe de capital seule.",
  "seo.page.live-execution-transparency.p2":
    "Tier 2 ajoute plus de détail exécution/latence pour les sessions autorisées — demande via la page d’accès.",
  "seo.page.live-execution-transparency.p3": "",
  "seo.page.live-execution-transparency.p4": "",

  "seo.page.veilige-kraken-api-bot.metaTitle": "Bot API Kraken sécurisé & exécution déterministe | KapitaalBot",
  "seo.page.veilige-kraken-api-bot.metaDesc":
    "Raccordement API sûr : exécution déterministe, cycles de vie en machine à états, époques, pas de chemins REST interdits pour trader. Sécurité opérationnelle native.",
  "seo.page.veilige-kraken-api-bot.h1": "Raccordement API Kraken sécurisé pour un bot autonome",
  "seo.page.veilige-kraken-api-bot.lead":
    "Pourquoi mon bot crypto échoue ? Souvent parce qu’il n’y a pas de vérité dure entre « ce que je crois » et « ce que l’exchange a exécuté ». KapitaalBot relie les exécutions user-data à l’état interne, avec validation et journaux — pas un tir REST au hasard.",
  "seo.page.veilige-kraken-api-bot.p1":
    "La sécurité, c’est aussi : pas de correctifs ad hoc en prod, pas de secrets dans les logs, pas de surface API infinie. Ce site ne publie pas de clés ni de paramètres de stratégie en direct.",
  "seo.page.veilige-kraken-api-bot.p2":
    "Exécution déterministe : on peut aligner la runtime sur commit Git, schéma et snapshots — pas un état RAM mystérieux.",
  "seo.page.veilige-kraken-api-bot.p3": "",
  "seo.page.veilige-kraken-api-bot.p4": "",

  "seo.page.low-latency-crypto-execution-nl.metaTitle": "Low-latency crypto execution (France / UE) | KapitaalBot",
  "seo.page.low-latency-crypto-execution-nl.metaDesc":
    "Faible latence avec Rust et rigueur serveur : systemd, limites claires, séparation ingest/exécution. Pas de promesse HFT — de l’ingénierie sérieuse.",
  "seo.page.low-latency-crypto-execution-nl.h1": "Exécution crypto faible latence (France / UE) — Rust et infra",
  "seo.page.low-latency-crypto-execution-nl.lead":
    "Les requêtes « low latency crypto execution » visent souvent stabilité et mesurabilité : Rust, pas d’allocations inutiles dans les chemins chauds, monitoring opérationnel.",
  "seo.page.low-latency-crypto-execution-nl.p1":
    "Le spot n’est pas du HFT co-localisé sur le moteur de matching ; ici « latence » veut dire traitement WebSocket fiable et files d’exécution prévisibles — pas arbitrage à la microseconde.",
  "seo.page.low-latency-crypto-execution-nl.p2":
    "L’intention « HFT » attire parfois le bon public technique ; KapitaalBot est un moteur spot autonome avec garde-fous de risque — pas un produit d’arbitrage de latence.",
  "seo.page.low-latency-crypto-execution-nl.p3": "",
  "seo.page.low-latency-crypto-execution-nl.p4": "",

  "faq.section.seo.title": "Questions fréquentes (traders & développeurs)",
  "faq.seo.q1": "Pourquoi mon bot crypto échoue alors que les backtests étaient bons ?",
  "faq.seo.a1":
    "Les backtests oublient souvent microstructure, frais et changements de régime. En live il faut aussi la fraîcheur des données, les pannes et les modes de sécurité. L’observabilité n’est pas un luxe : elle révèle la dérive avant qu’elle ne mange le capital.",
  "faq.seo.q2": "Comment limiter le slippage sur Kraken avec un bot ?",
  "faq.seo.a2":
    "Le slippage dépend du spread, de la position dans la file et de l’agressivité des ordres. Un biais hybrid maker et un meilleur timing (régime + état) battent « cliquer plus vite ». KapitaalBot ne publie pas de signaux d’entrée ; les agrégats sont dans les snapshots read-model.",
  "faq.seo.q3": "Est-ce un bot trading WebSocket Kraken ?",
  "faq.seo.a3":
    "Oui en ce sens : données marché et données privées passent par WebSocket, et les requêtes d’exécution aussi. Le REST n’est pas la voie principale ; les jetons d’auth sont liés à la session comme Kraken l’exige.",
  "faq.seo.q4": "Qu’implique le multi-régime pour mon risque ?",
  "faq.seo.a4":
    "Le système n’impose pas une seule stratégie sur tous les marchés. Bascules de régime et garde-fous limitent l’exposition quand les conditions ne correspondent pas aux familles de stratégies choisies.",
  "faq.seo.q5": "Pourquoi l’observabilité est-elle un thème central pour vous ?",
  "faq.seo.a5":
    "Parce que les « bots de trading crypto transparents » sont rares : la plupart sont des boîtes noires. Ce site montre des snapshots read-model et de la documentation, pas de live alpha — un choix assumé pour la maîtrise et l’audit.",

  "home.seoStrip.title": "Approfondir : moteur spot Kraken & observabilité",
  "home.seoStrip.intro":
    "Articles pour développeurs et traders exigeants : carnet L3, exécution WebSocket, détection de régime, hybrid maker, API sécurisée, infrastructure faible latence.",
  "home.seoStrip.cta": "Vers la base de connaissances →",
  "home.seoStrip.anchor.l3": "Kraken L3",
  "home.seoStrip.anchor.ws": "WebSocket",
  "home.seoStrip.anchor.maker": "Hybrid maker",
  "home.seoStrip.anchor.regime": "Régime",
};

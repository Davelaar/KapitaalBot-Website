import type { WatArticleBlock } from "./types";

export const watIsKapitaalbotArticleNl: WatArticleBlock[] = [
  { k: "h1", text: "Wat is KapitaalBot?" },
  {
    k: "p",
    text:
      "KapitaalBot is geen simpele momentum-, breakout- of scalpingbot. Het is een timing-aware, multistrategy, multiregime execution engine die per markt, per horizon en per route beoordeelt wat op dát moment verantwoord, verklaarbaar en economisch verhandelbaar is.",
    lead: true,
  },
  {
    k: "p",
    text:
      "De kern is niet één indicator, één setup of één favoriete coin. De kern is een live selectieproces dat meerdere kandidaatroutes naast elkaar zet, deze toetst op datafrisheid, tradability, regime, safety en execution-context, en vervolgens alleen die routes doorlaat die onder de actuele marktomstandigheden werkelijk uitvoerbaar zijn.",
    lead: true,
  },
  { k: "h2", text: "Canonieke definitie" },
  {
    k: "p",
    text:
      "KapitaalBot is een route-selection en execution engine met de volgende eigenschappen:",
  },
  {
    k: "pairRow",
    left: {
      h: "Timing-aware selectie",
      p:
        "KapitaalBot beoordeelt niet alleen óf een markt interessant is, maar ook wanneer een route kansrijk is binnen een concrete horizon. De tijdsdimensie is dus geen bijzaak, maar een eerste-orde-onderdeel van de selectie.",
    },
    right: {
      h: "Multistrategy",
      p:
        "Het systeem is niet gebouwd rond één strategie. Verschillende routefamilies en entry-logica kunnen naast elkaar bestaan, zolang ze ieder hun eigen economische en operationele voorwaarden respecteren.",
    },
  },
  {
    k: "pairRow",
    left: {
      h: "Multiregime",
      p:
        "Niet elke markt mag op dezelfde manier gelezen worden. KapitaalBot houdt rekening met regimeverschillen en hoort routekeuzes daarop aan te passen, in plaats van alle symbolen door één generieke filterlaag te duwen.",
    },
    right: {
      h: "Execution-first waarheid",
      p:
        "De operationele waarheid ligt niet in een researchsnapshot of een statisch dashboard, maar in de live execution-state, de actuele marktdatalaag, de geldige universe/epoch-context en de daadwerkelijke execution blockers.",
    },
  },
  { k: "h3", text: "Explainability by design" },
  {
    k: "p",
    text:
      "KapitaalBot moet niet alleen kunnen zeggen waarom een trade wél is gekozen, maar juist ook waarom een trade níet is gekozen. Denk aan:",
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
  { k: "h3", text: "Safety en position-context als randvoorwaarde" },
  {
    k: "p",
    text:
      "KapitaalBot is niet ontworpen om koste wat kost te handelen. Positionering, exposure, datakwaliteit, marktfrisheid en execution safety gaan vóór opportunisme. Niet traden is beter dan traden op slechte of inconsistente waarheid.",
  },
  { k: "h2", text: "Wat KapitaalBot in de praktijk is" },
  {
    k: "p",
    text: "KapitaalBot is een systeem dat probeert te bepalen:",
  },
  {
    k: "ul",
    items: [
      "welke symbolen op dit moment werkelijk tradable zijn",
      "welke horizons op dit moment betekenisvolle beweging tonen",
      "welke route binnen die context logisch is",
      "welke blocker een kandidaat tegenhoudt",
      "of execution economisch en operationeel nog verantwoord is",
      "en hoe dat alles uitlegbaar gemaakt kan worden voor operator en forensics",
    ],
  },
  {
    k: "p",
    text:
      "Daarmee is KapitaalBot dus geen “coin picker”, maar een live beslislaag tussen marktdata en execution.",
  },
  { k: "h2", text: "Wat KapitaalBot nadrukkelijk niet is" },
  {
    k: "notBlock",
    h: "Geen single-strategy indicatorbot",
    p:
      "KapitaalBot hoort niet te vertrouwen op één generieke edgeformule of één vaste setup die op alle markten wordt losgelaten.",
  },
  {
    k: "notBlock",
    h: "Geen symbol-first of feed-first dashboardmodel",
    p:
      "Een dashboard is observability, niet de hoofdwaarheid. De waarheid hoort uit de live runtime, execution-state en geldige marktdatacontext te komen.",
  },
  {
    k: "notBlock",
    h: "Geen researchsnapshot als trading-SSOT",
    p:
      "Research, backtests en edgeboard-achtige lagen kunnen nuttig zijn voor calibratie en analyse, maar niet als dominante live selector-truth.",
  },
  {
    k: "notBlock",
    h: "Geen black-box signaalmachine",
    p:
      "Een kandidaat zonder duidelijke reden waarom hij wint of verliest, past niet bij het ontwerpdoel van KapitaalBot.",
  },
  {
    k: "notBlock",
    h: "Geen beleggingsadvies of signaaldienst",
    p:
      "KapitaalBot is een intern handelssysteem en observability-/executionkader, geen publiek adviesproduct.",
  },
  { k: "h2", text: "Waar KapitaalBot nu naartoe beweegt" },
  {
    k: "p",
    text: "KapitaalBot ontwikkelt zich richting een foundation waarin:",
  },
  {
    k: "ul",
    items: [
      "live hot state leidend is voor selectie",
      "horizons expliciet gemeten worden",
      "tradability first-class wordt gemaakt",
      "route-specifieke economie pas ná de juiste context wordt toegepast",
      "explainability niet optioneel is maar standaard",
      "en cold start / fast start verantwoord blijft zonder de rest van de markt structureel blind te maken",
    ],
  },
  {
    k: "p",
    text:
      "Met andere woorden: KapitaalBot beweegt van een verzameling losse beslislagen naar een samenhangende, production-grade selector- en executionfundering.",
  },
  {
    k: "h2",
    text: "Hoe deze pagina past in de canon",
  },
  {
    k: "p",
    text:
      "Deze pagina geeft de kern-definitie. Voor operationele observability gebruik je Dashboard. Voor stack/latency gebruik je SPEC. Voor contractuele details gebruik je Docs. Voor oorzaak/gevolg-vragen gebruik je FAQ.",
  },
];

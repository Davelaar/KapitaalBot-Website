import type { FundMeBlock } from "./types";

export const fundMeArticleNl: FundMeBlock[] = [
  { k: "h1", text: "KapitaalBot — Autonomous Trading Infrastructure Experiment" },
  {
    k: "p",
    text:
      "KapitaalBot is een transparant experiment in autonomous trading infrastructure, algorithmic trading en softwarematig risicobeheer.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Het project onderzoekt hoe een AI-ondersteunde trading-engine real-time marktdata kan verwerken, trade-routes kan selecteren en execution kan afdwingen onder strikte risicoregels.",
    lead: true,
  },
  {
    k: "p",
    text:
      "In plaats van één strategie probeert KapitaalBot een fundamentelere vraag te beantwoorden:",
    lead: true,
  },
  {
    k: "pStrong",
    text:
      "Hoe bouw je een trading-systeem dat alleen trades uitvoert wanneer ze technisch, economisch en operationeel verantwoord zijn?",
  },
  {
    k: "p",
    text:
      "Het systeem draait live en verwerkt continu marktdata. Alle beslissingen worden gelogd en de ontwikkeling van het systeem wordt publiek gedeeld.",
  },
  { k: "divider" },
  { k: "h2", text: "Wat KapitaalBot onderzoekt" },
  {
    k: "p",
    text: "KapitaalBot functioneert als een route-selectie en execution engine.",
  },
  { k: "p", text: "Het systeem analyseert onder andere:" },
  {
    k: "ul",
    items: [
      "real-time market data",
      "tradability en liquiditeit",
      "spreads en marktfrictie",
      "verschillende tijdshorizons",
      "execution-constraints",
      "softwarematig risicobeheer",
    ],
  },
  {
    k: "p",
    text: "Elke potentiële trade moet meerdere filters passeren, waaronder:",
  },
  {
    k: "ul",
    items: [
      "data-frisheid",
      "marktliquiditeit",
      "regime-context",
      "execution-veiligheid",
      "position- en exposure-limieten",
    ],
  },
  {
    k: "p",
    text: "Alleen wanneer een route door al deze lagen komt, wordt execution toegestaan.",
  },
  {
    k: "p",
    text: "In veel gevallen betekent dit dat het systeem bewust niets doet.",
  },
  { k: "divider" },
  { k: "h2", text: "Waarom ondersteuning helpt" },
  {
    k: "p",
    text: "KapitaalBot wordt zelfstandig ontwikkeld en getest.",
  },
  { k: "p", text: "Ondersteuning maakt het mogelijk om:" },
  { k: "h3", text: "Infrastructuur te blijven draaien" },
  {
    k: "ul",
    items: [
      "24/7 servers",
      "real-time WebSocket data-ingest",
      "databases en logging",
      "monitoring en observability",
      "beveiliging en back-ups",
    ],
  },
  { k: "h3", text: "Realistische tests uit te voeren" },
  {
    k: "p",
    text:
      "Trading op kleine schaal wordt relatief zwaar beïnvloed door transactiekosten en marktfrictie.",
  },
  {
    k: "p",
    text: "Meer testkapitaal maakt het mogelijk om:",
  },
  {
    k: "ul",
    items: [
      "execution realistischer te testen",
      "fee-impact te verminderen",
      "schaalgedrag van het systeem te analyseren",
    ],
  },
  {
    k: "p",
    text:
      "Dit is geen marketingclaim maar een praktisch gevolg van marktmicrostructuur.",
  },
  { k: "divider" },
  { k: "h2", text: "Kraken referral (transparant vermeld)" },
  {
    k: "pWithLink",
    before: "Gebruikers kunnen zich aanmelden bij Kraken via mijn referral-link: ",
    linkText: "invite.kraken.com (referral)",
    after: "",
  },
  {
    k: "p",
    text:
      "Wanneer iemand via deze link een account opent en handelt, kan ik een referralvergoeding ontvangen.",
  },
  {
    k: "p",
    text:
      "Deze vergoeding wordt toegevoegd aan het testkapitaal van mijn eigen KapitaalBot-omgeving en ondersteunt daarmee de verdere ontwikkeling van het project.",
  },
  {
    k: "p",
    text: "Dit staat volledig los van donaties.",
  },
  { k: "divider" },
  { k: "h2", text: "Belangrijke disclaimer" },
  { k: "p", text: "KapitaalBot is geen:" },
  {
    k: "ul",
    items: [
      "vermogensbeheer",
      "beleggingsadvies",
      "financieel product",
      "winstdelingsmodel",
    ],
  },
  {
    k: "p",
    text:
      "Iedereen die zelf handelt doet dat via een eigen exchange-account en op eigen risico.",
  },
  {
    k: "p",
    text: "Resultaten uit het verleden bieden geen garantie voor de toekomst.",
  },
  { k: "divider" },
  { k: "h2", text: "Projectfeiten (in het kort)" },
  {
    k: "dl",
    rows: [
      { term: "Project", desc: "KapitaalBot" },
      { term: "Type", desc: "Autonomous trading infrastructure experiment" },
      { term: "Focus", desc: "algorithmic trading, risk management, execution control" },
      { term: "Data", desc: "real-time market data processing" },
      { term: "Architectuur", desc: "route-selectie en execution engine" },
      { term: "Status", desc: "live testomgeving en doorlopende ontwikkeling" },
    ],
  },
];

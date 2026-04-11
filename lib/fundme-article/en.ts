import type { FundMeBlock } from "./types";

export const fundMeArticleEn: FundMeBlock[] = [
  { k: "h1", text: "KapitaalBot — Autonomous Trading Infrastructure Experiment" },
  {
    k: "p",
    text:
      "KapitaalBot is a transparent experiment in autonomous trading infrastructure, algorithmic trading, and software-driven risk management.",
    lead: true,
  },
  {
    k: "p",
    text:
      "The project explores how an AI-assisted trading engine can process real-time market data, select trade routes, and enforce execution under strict risk rules.",
    lead: true,
  },
  {
    k: "p",
    text: "Rather than betting on a single strategy, KapitaalBot tackles a more fundamental question:",
    lead: true,
  },
  {
    k: "pStrong",
    text:
      "How do you build a trading system that only executes trades when they are technically, economically, and operationally justified?",
  },
  {
    k: "p",
    text:
      "The system runs live and continuously processes market data. Decisions are logged, and development is shared publicly.",
  },
  { k: "divider" },
  { k: "h2", text: "What KapitaalBot explores" },
  {
    k: "p",
    text: "KapitaalBot acts as a route-selection and execution engine.",
  },
  { k: "p", text: "Among other things, the system analyses:" },
  {
    k: "ul",
    items: [
      "real-time market data",
      "tradability and liquidity",
      "spreads and market friction",
      "multiple time horizons",
      "execution constraints",
      "software-driven risk management",
    ],
  },
  {
    k: "p",
    text: "Every potential trade must pass several filters, including:",
  },
  {
    k: "ul",
    items: [
      "data freshness",
      "market liquidity",
      "regime context",
      "execution safety",
      "position and exposure limits",
    ],
  },
  {
    k: "p",
    text: "Execution is allowed only when a route clears all of these layers.",
  },
  {
    k: "p",
    text: "Often that means the system deliberately does nothing.",
  },
  { k: "divider" },
  { k: "h2", text: "Why support matters" },
  {
    k: "p",
    text: "KapitaalBot is built and tested independently.",
  },
  { k: "p", text: "Support makes it possible to:" },
  { k: "h3", text: "Keep infrastructure running" },
  {
    k: "ul",
    items: [
      "24/7 servers",
      "real-time WebSocket data ingest",
      "databases and logging",
      "monitoring and observability",
      "security and backups",
    ],
  },
  { k: "h3", text: "Run realistic tests" },
  {
    k: "p",
    text:
      "Trading at small size is disproportionately affected by transaction costs and market friction.",
  },
  {
    k: "p",
    text: "More test capital makes it possible to:",
  },
  {
    k: "ul",
    items: [
      "test execution more realistically",
      "reduce the relative fee impact",
      "analyse how the system behaves as scale changes",
    ],
  },
  {
    k: "p",
    text: "That is not a marketing claim — it follows from market microstructure.",
  },
  { k: "divider" },
  { k: "h2", text: "Kraken referral (stated transparently)" },
  {
    k: "pWithLink",
    before: "You can sign up with Kraken using my referral link: ",
    linkText: "invite.kraken.com (referral)",
    after: "",
  },
  {
    k: "p",
    text:
      "If someone opens an account via this link and trades, I may receive a referral fee.",
  },
  {
    k: "p",
    text:
      "That fee is added to the test capital in my own KapitaalBot environment and helps fund further development.",
  },
  {
    k: "p",
    text: "This is entirely separate from donations.",
  },
  { k: "divider" },
  { k: "h2", text: "Important disclaimer" },
  { k: "p", text: "KapitaalBot is not:" },
  {
    k: "ul",
    items: [
      "asset management",
      "investment advice",
      "a financial product",
      "a profit-sharing scheme",
    ],
  },
  {
    k: "p",
    text:
      "Anyone who trades on their own does so through their own exchange account and at their own risk.",
  },
  {
    k: "p",
    text: "Past results do not guarantee future outcomes.",
  },
  { k: "divider" },
  { k: "h2", text: "Project facts (at a glance)" },
  {
    k: "dl",
    rows: [
      { term: "Project", desc: "KapitaalBot" },
      { term: "Type", desc: "Autonomous trading infrastructure experiment" },
      { term: "Focus", desc: "algorithmic trading, risk management, execution control" },
      { term: "Data", desc: "real-time market data processing" },
      { term: "Architecture", desc: "route selection and execution engine" },
      { term: "Status", desc: "live test environment and ongoing development" },
    ],
  },
];

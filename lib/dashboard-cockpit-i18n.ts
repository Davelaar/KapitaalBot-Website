import type { Locale } from "@/lib/i18n";

const cockpit: Record<
  Locale,
  Record<
    | "tagline"
    | "runtime"
    | "exchange"
    | "run"
    | "epoch"
    | "feed"
    | "symbols"
    | "regime"
    | "strategy"
    | "safety"
    | "pnlTitle"
    | "pnlWinners"
    | "pnlLosers"
    | "pnlEmpty"
    | "barsCaption"
    | "gaugeFlow"
    | "gaugeOrders"
    | "gaugeFeeds"
    | "skip"
    | "btnAllow"
    | "btnHalt"
    | "tableTitle"
    | "colAction"
    | "colExecution"
    | "colReason"
    | "colSignal"
    | "colStatus"
    | "badgeAllow"
    | "badgeSkip"
    | "badgeHalt"
    | "cardAllow"
    | "cardHalt"
    | "cardExchange"
    | "cardIntentEntry"
    | "cardIntentGuard"
    | "cardIntentBlocked"
    | "cardConf"
    | "noRows"
    | "delay",
    string
  >
> = {
  nl: {
    tagline: "A Precision Trading System",
    runtime: "Runtime context",
    exchange: "Exchange",
    run: "Run",
    epoch: "Epoch",
    feed: "Feed-vertraging",
    symbols: "Symbolen (epoch)",
    regime: "Dominant regime",
    strategy: "Strategieën actief",
    safety: "Safety (N / E / B)",
    pnlTitle: "PNL",
    pnlWinners: "Winnaars (dag)",
    pnlLosers: "Verliezers (dag)",
    pnlEmpty: "Geen PnL-splits",
    barsCaption: "Equity-trend (vertraagd)",
    gaugeFlow: "Fill-rate",
    gaugeOrders: "Orders 24h",
    gaugeFeeds: "Feed OK",
    skip: "SKIP",
    btnAllow: "ALLOW",
    btnHalt: "HALT",
    tableTitle: "Execution surface",
    colAction: "Actie",
    colExecution: "Symbool",
    colReason: "Route / reden",
    colSignal: "Signaal",
    colStatus: "Vers",
    badgeAllow: "ALLOW",
    badgeSkip: "SKIP",
    badgeHalt: "HALT",
    cardAllow: "ALLOW",
    cardHalt: "HALT",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent: entry / evaluatie",
    cardIntentGuard: "Intent: exit-only / guard",
    cardIntentBlocked: "Intent: geblokkeerd — geen nieuwe risk",
    cardConf: "CONF",
    noRows: "Geen rijen in snapshot.",
    delay: "Snapshot-vertraging",
  },
  en: {
    tagline: "A Precision Trading System",
    runtime: "Runtime context",
    exchange: "Exchange",
    run: "Run",
    epoch: "Epoch",
    feed: "Feed lag",
    symbols: "Symbols (epoch)",
    regime: "Dominant regime",
    strategy: "Active strategies",
    safety: "Safety (N / E / B)",
    pnlTitle: "PNL",
    pnlWinners: "Winners (day)",
    pnlLosers: "Losers (day)",
    pnlEmpty: "No PnL split",
    barsCaption: "Equity trend (delayed)",
    gaugeFlow: "Fill rate",
    gaugeOrders: "Orders 24h",
    gaugeFeeds: "Feed OK",
    skip: "SKIP",
    btnAllow: "ALLOW",
    btnHalt: "HALT",
    tableTitle: "Execution surface",
    colAction: "Action",
    colExecution: "Symbol",
    colReason: "Route / reason",
    colSignal: "Signal",
    colStatus: "Fresh",
    badgeAllow: "ALLOW",
    badgeSkip: "SKIP",
    badgeHalt: "HALT",
    cardAllow: "ALLOW",
    cardHalt: "HALT",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent: entry / evaluation",
    cardIntentGuard: "Intent: exit-only / guard",
    cardIntentBlocked: "Intent: blocked — no new risk",
    cardConf: "CONF",
    noRows: "No rows in snapshot.",
    delay: "Snapshot lag",
  },
  de: {
    tagline: "A Precision Trading System",
    runtime: "Runtime-Kontext",
    exchange: "Exchange",
    run: "Run",
    epoch: "Epoch",
    feed: "Feed-Latenz",
    symbols: "Symbole (Epoch)",
    regime: "Dominantes Regime",
    strategy: "Aktive Strategien",
    safety: "Safety (N / E / B)",
    pnlTitle: "PNL",
    pnlWinners: "Gewinner (Tag)",
    pnlLosers: "Verlierer (Tag)",
    pnlEmpty: "Keine PnL-Aufteilung",
    barsCaption: "Equity-Trend (verzögert)",
    gaugeFlow: "Fill-Rate",
    gaugeOrders: "Orders 24h",
    gaugeFeeds: "Feed OK",
    skip: "SKIP",
    btnAllow: "ALLOW",
    btnHalt: "HALT",
    tableTitle: "Execution-Oberfläche",
    colAction: "Aktion",
    colExecution: "Symbol",
    colReason: "Route / Grund",
    colSignal: "Signal",
    colStatus: "Frische",
    badgeAllow: "ALLOW",
    badgeSkip: "SKIP",
    badgeHalt: "HALT",
    cardAllow: "ALLOW",
    cardHalt: "HALT",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent: Entry / Evaluierung",
    cardIntentGuard: "Intent: nur Exit / Guard",
    cardIntentBlocked: "Intent: blockiert — kein neues Risiko",
    cardConf: "CONF",
    noRows: "Keine Zeilen im Snapshot.",
    delay: "Snapshot-Latenz",
  },
  fr: {
    tagline: "A Precision Trading System",
    runtime: "Contexte runtime",
    exchange: "Exchange",
    run: "Run",
    epoch: "Epoch",
    feed: "Latence flux",
    symbols: "Symboles (epoch)",
    regime: "Régime dominant",
    strategy: "Stratégies actives",
    safety: "Safety (N / E / B)",
    pnlTitle: "PNL",
    pnlWinners: "Gagnants (jour)",
    pnlLosers: "Perdants (jour)",
    pnlEmpty: "Pas de split PnL",
    barsCaption: "Tendance equity (différée)",
    gaugeFlow: "Taux de fill",
    gaugeOrders: "Ordres 24h",
    gaugeFeeds: "Flux OK",
    skip: "SKIP",
    btnAllow: "ALLOW",
    btnHalt: "HALT",
    tableTitle: "Surface d’exécution",
    colAction: "Action",
    colExecution: "Symbole",
    colReason: "Route / raison",
    colSignal: "Signal",
    colStatus: "Fraîcheur",
    badgeAllow: "ALLOW",
    badgeSkip: "SKIP",
    badgeHalt: "HALT",
    cardAllow: "ALLOW",
    cardHalt: "HALT",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent : entrée / évaluation",
    cardIntentGuard: "Intent : exit-only / garde",
    cardIntentBlocked: "Intent : bloqué — pas de nouveau risque",
    cardConf: "CONF",
    noRows: "Aucune ligne dans le snapshot.",
    delay: "Latence snapshot",
  },
};

export function cockpitT(locale: Locale, key: keyof (typeof cockpit)["nl"]): string {
  return cockpit[locale][key] ?? cockpit.en[key] ?? key;
}

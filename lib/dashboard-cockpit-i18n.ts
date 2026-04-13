import type { Locale } from "@/lib/i18n";

type CockpitKey =
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
  | "barsHint"
  | "barsAria"
  | "metricL3"
  | "metricOrders24h"
  | "metricTrades24h"
  | "metricDD"
  | "gaugeFlow"
  | "gaugeFlowEmpty"
  | "gaugeOrders"
  | "gaugeFeeds"
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
  | "delay"
  | "krakenMarkAria"
  | "krakenReferralPrefix"
  | "krakenReferralMid"
  | "krakenReferralLinkText"
  | "krakenReferralLinkAria";

const cockpit: Record<Locale, Record<CockpitKey, string>> = {
  nl: {
    tagline: "Precisiehandelssysteem",
    runtime: "Runtime-context",
    exchange: "Beurs",
    run: "Run",
    epoch: "Epoch",
    feed: "Feed-vertraging",
    symbols: "Symbolen (epoch)",
    regime: "Dominant regime",
    strategy: "Actieve strategieën",
    safety: "Safety (N / E / B)",
    pnlTitle: "Dagresultaat (PnL)",
    pnlWinners: "Winnaars (dag)",
    pnlLosers: "Verliezers (dag)",
    pnlEmpty: "Geen PnL-verdeling in deze export.",
    barsCaption: "Equity-trend (vertraagd)",
    barsHint:
      "Elke staaf is één tijdstip in de vertraagde account-equity-reeks uit de export. Hoogte is min–max genormaliseerd binnen dit venster: geen eurobedrag per staaf, wel de vorm en relatieve beweging van de curve.",
    barsAria: "Miniatuur equity-trend uit vertraagde snapshot; laatste punten, relatieve schaal.",
    metricL3: "L3-dekking",
    metricOrders24h: "Orders (24 u)",
    metricTrades24h: "Trades (24 u)",
    metricDD: "Drawdown",
    gaugeFlow: "Fillratio",
    gaugeFlowEmpty: "Geen",
    gaugeOrders: "Orders (24 u)",
    gaugeFeeds: "Feed frisheid",
    btnAllow: "Toestaan",
    btnHalt: "Stop",
    tableTitle: "Executie-overzicht",
    colAction: "Actie",
    colExecution: "Symbool",
    colReason: "Route / reden",
    colSignal: "Signaal",
    colStatus: "Vers",
    badgeAllow: "OK",
    badgeSkip: "Overslaan",
    badgeHalt: "STOP",
    cardAllow: "Toegestaan",
    cardHalt: "Geblokkeerd",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent: entry / evaluatie",
    cardIntentGuard: "Intent: exit-only / guard",
    cardIntentBlocked: "Intent: geblokkeerd — geen nieuwe risk",
    cardConf: "Confidence",
    noRows: "Geen rijen in snapshot.",
    delay: "Snapshot-vertraging",
    krakenMarkAria: "Kraken — spotbeurs (website opent in een nieuw tabblad)",
    krakenReferralPrefix: "Hey! Word lid met mij op Kraken en ontgrendel 100 EUR met code:",
    krakenReferralMid: "of via",
    krakenReferralLinkText: "deze link",
    krakenReferralLinkAria:
      "Kraken-uitnodiging: meld je aan via deze referral-link om de bonus te activeren (opent in een nieuw tabblad). Code: 2ttwcy3g.",
  },
  en: {
    tagline: "A precision trading system",
    runtime: "Runtime context",
    exchange: "Exchange",
    run: "Run",
    epoch: "Epoch",
    feed: "Feed lag",
    symbols: "Symbols (epoch)",
    regime: "Dominant regime",
    strategy: "Active strategies",
    safety: "Safety (N / E / B)",
    pnlTitle: "PnL (day)",
    pnlWinners: "Winners (day)",
    pnlLosers: "Losers (day)",
    pnlEmpty: "No PnL split in this export.",
    barsCaption: "Equity trend (delayed)",
    barsHint:
      "Each bar is one timestamp from the delayed account equity series in the export. Bar height is min–max normalized inside this window: not euros per bar, but the shape and relative movement of the curve.",
    barsAria: "Mini equity trend from delayed snapshot; last points, relative scale.",
    metricL3: "L3 coverage",
    metricOrders24h: "Orders (24h)",
    metricTrades24h: "Trades (24h)",
    metricDD: "Drawdown",
    gaugeFlow: "Fill rate",
    gaugeFlowEmpty: "None",
    gaugeOrders: "Orders 24h",
    gaugeFeeds: "Feed health",
    btnAllow: "Allow",
    btnHalt: "Halt",
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
    krakenMarkAria: "Kraken — spot exchange (opens in a new tab)",
    krakenReferralPrefix: "Hey! Join me on Kraken and unlock 100 EUR with code:",
    krakenReferralMid: "or via",
    krakenReferralLinkText: "this link",
    krakenReferralLinkAria:
      "Kraken invitation: sign up through this referral link to activate the bonus (opens in a new tab). Code: 2ttwcy3g.",
  },
  de: {
    tagline: "Präzisions-Handelssystem",
    runtime: "Runtime-Kontext",
    exchange: "Börse",
    run: "Run",
    epoch: "Epoch",
    feed: "Feed-Latenz",
    symbols: "Symbole (Epoch)",
    regime: "Dominantes Regime",
    strategy: "Aktive Strategien",
    safety: "Safety (N / E / B)",
    pnlTitle: "PnL (Tag)",
    pnlWinners: "Gewinner (Tag)",
    pnlLosers: "Verlierer (Tag)",
    pnlEmpty: "Keine PnL-Aufteilung in diesem Export.",
    barsCaption: "Equity-Trend (verzögert)",
    barsHint:
      "Jeder Balken ist ein Zeitpunkt der verzögerten Account-Equity-Reihe aus dem Export. Die Höhe ist min–max-normalisiert in diesem Fenster: keine Euro pro Balken, sondern Form und relative Bewegung der Kurve.",
    barsAria: "Mini-Equity-Trend aus verzögertem Snapshot; letzte Punkte, relative Skala.",
    metricL3: "L3-Abdeckung",
    metricOrders24h: "Orders (24h)",
    metricTrades24h: "Trades (24h)",
    metricDD: "Drawdown",
    gaugeFlow: "Fill-Rate",
    gaugeFlowEmpty: "Keine",
    gaugeOrders: "Orders 24h",
    gaugeFeeds: "Feed-Frische",
    btnAllow: "Erlauben",
    btnHalt: "Stopp",
    tableTitle: "Execution-Übersicht",
    colAction: "Aktion",
    colExecution: "Symbol",
    colReason: "Route / Grund",
    colSignal: "Signal",
    colStatus: "Frische",
    badgeAllow: "OK",
    badgeSkip: "Überspringen",
    badgeHalt: "STOP",
    cardAllow: "Erlaubt",
    cardHalt: "Blockiert",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent: Entry / Evaluierung",
    cardIntentGuard: "Intent: nur Exit / Guard",
    cardIntentBlocked: "Intent: blockiert — kein neues Risiko",
    cardConf: "Confidence",
    noRows: "Keine Zeilen im Snapshot.",
    delay: "Snapshot-Latenz",
    krakenMarkAria: "Kraken — Spot-Börse (Website öffnet in neuem Tab)",
    krakenReferralPrefix: "Hey! Werde mit mir bei Kraken Mitglied und sichere dir 100 EUR mit Code:",
    krakenReferralMid: "oder über",
    krakenReferralLinkText: "diesen Link",
    krakenReferralLinkAria:
      "Kraken-Einladung: Registrierung über diesen Empfehlungslink für den Bonus (öffnet in neuem Tab). Code: 2ttwcy3g.",
  },
  fr: {
    tagline: "Système de trading de précision",
    runtime: "Contexte runtime",
    exchange: "Exchange",
    run: "Run",
    epoch: "Epoch",
    feed: "Latence flux",
    symbols: "Symboles (epoch)",
    regime: "Régime dominant",
    strategy: "Stratégies actives",
    safety: "Safety (N / E / B)",
    pnlTitle: "PnL (jour)",
    pnlWinners: "Gagnants (jour)",
    pnlLosers: "Perdants (jour)",
    pnlEmpty: "Pas de ventilation PnL dans cet export.",
    barsCaption: "Tendance equity (différée)",
    barsHint:
      "Chaque barre est un instant de la série equity compte (différée) dans l’export. La hauteur est normalisée min–max dans cette fenêtre : pas d’euros par barre, mais la forme et le mouvement relatif de la courbe.",
    barsAria: "Mini tendance equity depuis snapshot différé ; derniers points, échelle relative.",
    metricL3: "Couverture L3",
    metricOrders24h: "Ordres (24h)",
    metricTrades24h: "Trades (24h)",
    metricDD: "Drawdown",
    gaugeFlow: "Taux de fill",
    gaugeFlowEmpty: "Aucun",
    gaugeOrders: "Ordres 24h",
    gaugeFeeds: "Fraîcheur flux",
    btnAllow: "Autoriser",
    btnHalt: "Arrêt",
    tableTitle: "Surface d’exécution",
    colAction: "Action",
    colExecution: "Symbole",
    colReason: "Route / raison",
    colSignal: "Signal",
    colStatus: "Fraîcheur",
    badgeAllow: "OK",
    badgeSkip: "Passer",
    badgeHalt: "STOP",
    cardAllow: "Autorisé",
    cardHalt: "Bloqué",
    cardExchange: "Kraken Spot",
    cardIntentEntry: "Intent : entrée / évaluation",
    cardIntentGuard: "Intent : exit-only / garde",
    cardIntentBlocked: "Intent : bloqué — pas de nouveau risque",
    cardConf: "Confiance",
    noRows: "Aucune ligne dans le snapshot.",
    delay: "Latence snapshot",
    krakenMarkAria: "Kraken — plateforme spot (site dans un nouvel onglet)",
    krakenReferralPrefix: "Hey! Rejoins-moi sur Kraken et débloque 100 EUR avec le code :",
    krakenReferralMid: "ou via",
    krakenReferralLinkText: "ce lien",
    krakenReferralLinkAria:
      "Invitation Kraken : inscription via ce lien de parrainage pour activer le bonus (nouvel onglet). Code : 2ttwcy3g.",
  },
};

export function cockpitT(locale: Locale, key: CockpitKey): string {
  return cockpit[locale][key] ?? cockpit.en[key] ?? key;
}

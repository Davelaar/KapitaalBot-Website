/** Seite: Was KapitaalBot ist (und nicht ist) — native DE, SEO. */
export const watIsKapitaalbotDe: Record<string, string> = {
  "watkap.metaTitle":
    "Was KapitaalBot ist (und nicht) | State-first Trading, kein Signaldienst",
  "watkap.metaDesc":
    "KapitaalBot ist eine autonome Trading-Runtime mit State-first-Architektur, Safety-Guardrails und Observability — kein Schnell-reich-werden-Tool und kein Echtzeit-Signalfeed. Die harten Grenzen.",
  "watkap.metaKeywords":
    "KapitaalBot, autonomes Trading, State-first, Execution-Disziplin, Observability, kein Signaldienst, Kraken, Risikomanagement, algorithmisches Trading",

  "watkap.h1": "KapitaalBot: die harte Wahrheit über autonome Trading-Architektur",

  "watkap.intro":
    "Auf Basis der technischen Dokumentation und Architektur von KapitaalBot: eine klare Einordnung, was das System im Kern ist — und was es definitiv nicht ist. Unten die SEO-fokussierte Kernaussage: was KapitaalBot ausdrücklich ist und nicht ist.",

  "watkap.wel.title": "Was KapitaalBot ausdrücklich IST",
  "watkap.wel.b1":
    "**Eine autonome Trading-Runtime:** eine robuste Engine, die 24/7 auf einer straffen Ingest-to-Execution-Pipeline läuft.",
  "watkap.wel.b2":
    "**State-first-Architektur:** die Bot-Logik arbeitet nur auf validiertem State (`run_symbol_state`). Jede Entscheidung basiert auf einem vollständigen, aktuellen Marktbild — nicht auf Datenfragmenten.",
  "watkap.wel.b3":
    "**Kapitalerhalt als Priorität:** die Architektur ist mit Safety-Guardrails durchzogen. Risikomanagement steckt im Code — von Hard Blocks bis zu automatischen Exit-only-Modi bei Anomalien.",
  "watkap.wel.b4":
    "**Beobachtbar & transparent:** über eine Observability-Pipeline (Tier-1- und Tier-2-Dashboards) werden Metriken aus der Datenbank in verständliche Snapshots übersetzt. Sie sehen aggregiert, was die Bot-Perspektive ist — innerhalb der Tier-Grenzen.",
  "watkap.wel.b5":
    "**Disziplinierte Execution:** Orders innerhalb enger Rahmen. Keine Emotion, keine Abweichung von der Strategie — Ausführung der programmierten Logik innerhalb von Risiko- und Safety-Constraints.",

  "watkap.niet.title": "Was KapitaalBot ausdrücklich NICHT ist",
  "watkap.niet.b1":
    "**Kein „schnell reich werden“-Tool:** keine magische Blackbox mit Gewinngarantie. Es ist ein technisches System für Menschen, die verstehen, dass Trading Statistik und Risikosteuerung ist.",
  "watkap.niet.b2":
    "**Kein Echtzeit-Signaldienst:** die Architektur arbeitet mit Read-Model-Snapshots. Nicht dafür gedacht, externe Nutzer mit schnellen Kauf-/Verkaufs-Hinweisen für manuelles Nachhandeln zu versorgen.",
  "watkap.niet.b3":
    "**Keine offene Order-Feed-API für Dritte:** ein geschlossenes Execution-Ökosystem; keine öffentliche API, um in Echtzeit auf Einzeltransaktionen mitzufahren.",
  "watkap.niet.b4":
    "**Kein unkontrolliertes System:** dank Safety-Guardrails stoppt oder begrenzt die Engine lieber das Trading (z. B. bei extremer Volatilität oder Datenverzögerung), als unverantwortliche Risiken einzugehen. Sicherheit vor Volumen.",

  "watkap.waarom.title": "Warum diese Architektur den Unterschied macht",
  "watkap.waarom.p1":
    "Die Stärke liegt in der Trennung: die Ingest-Engine sammelt Rohdaten (u. a. L2/L3-Feeds), die Route-Engine bestimmt anhand des States die Richtung, die Execution-Engine führt innerhalb der Sicherheitsmargen aus. Diese Hierarchie verhindert Fehler, die unreifere Stacks in Kapitalverlust verwandeln.",

  "watkap.closing": "Disziplin wählen. Architektur wählen. KapitaalBot wählen.",

  "watkap.breadcrumb": "Was es ist (und nicht)",
};

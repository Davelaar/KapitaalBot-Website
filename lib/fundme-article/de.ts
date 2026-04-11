import type { FundMeBlock } from "./types";

export const fundMeArticleDe: FundMeBlock[] = [
  { k: "h1", text: "KapitaalBot — Autonomous Trading Infrastructure Experiment" },
  {
    k: "p",
    text:
      "KapitaalBot ist ein transparentes Experiment in autonomer Trading-Infrastruktur, algorithmischem Trading und softwaregestütztem Risikomanagement.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Das Projekt untersucht, wie eine KI-unterstützte Trading-Engine Echtzeit-Marktdaten verarbeiten, Handelsrouten auswählen und die Ausführung unter strengen Risikoregeln erzwingen kann.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Statt auf eine einzelne Strategie zu setzen, geht es KapitaalBot um eine grundlegendere Frage:",
    lead: true,
  },
  {
    k: "pStrong",
    text:
      "Wie baut man ein Handelssystem, das Trades nur dann ausführt, wenn sie technisch, ökonomisch und operativ vertretbar sind?",
  },
  {
    k: "p",
    text:
      "Das System läuft live und verarbeitet fortlaufend Marktdaten. Entscheidungen werden protokolliert, die Entwicklung wird öffentlich geteilt.",
  },
  { k: "divider" },
  { k: "h2", text: "Was KapitaalBot erforscht" },
  {
    k: "p",
    text: "KapitaalBot fungiert als Route-Selection- und Execution-Engine.",
  },
  { k: "p", text: "Das System analysiert unter anderem:" },
  {
    k: "ul",
    items: [
      "Echtzeit-Marktdaten",
      "Tradability und Liquidität",
      "Spreads und Marktreibung",
      "verschiedene Zeithorizonte",
      "Execution-Constraints",
      "softwaregestütztes Risikomanagement",
    ],
  },
  {
    k: "p",
    text: "Jeder potenzielle Trade muss mehrere Filter passieren, darunter:",
  },
  {
    k: "ul",
    items: [
      "Datenfrische",
      "Marktliquidität",
      "Regime-Kontext",
      "Execution-Safety",
      "Positions- und Exposure-Limits",
    ],
  },
  {
    k: "p",
    text: "Nur wenn eine Route all diese Schichten passiert, ist Execution erlaubt.",
  },
  {
    k: "p",
    text: "Oft bedeutet das bewusst: nichts tun.",
  },
  { k: "divider" },
  { k: "h2", text: "Warum Unterstützung hilft" },
  {
    k: "p",
    text: "KapitaalBot wird eigenständig entwickelt und getestet.",
  },
  { k: "p", text: "Unterstützung ermöglicht:" },
  { k: "h3", text: "Infrastruktur am Laufen zu halten" },
  {
    k: "ul",
    items: [
      "24/7-Server",
      "Echtzeit-WebSocket-Daten-Ingest",
      "Datenbanken und Logging",
      "Monitoring und Observability",
      "Sicherheit und Backups",
    ],
  },
  { k: "h3", text: "Realistische Tests durchzuführen" },
  {
    k: "p",
    text:
      "Trading in kleinem Volumen wird relativ stark von Transaktionskosten und Marktreibung beeinflusst.",
  },
  {
    k: "p",
    text: "Mehr Testkapital ermöglicht:",
  },
  {
    k: "ul",
    items: [
      "Execution realistischer zu testen",
      "den Fee-Einfluss zu verringern",
      "Skalenverhalten des Systems zu analysieren",
    ],
  },
  {
    k: "p",
    text:
      "Das ist kein Marketingclaim, sondern eine praktische Folge der Marktmikrostruktur.",
  },
  { k: "divider" },
  { k: "h2", text: "Kraken-Referral (transparent ausgewiesen)" },
  {
    k: "pWithLink",
    before: "Nutzer können sich über meinen Referral-Link bei Kraken anmelden: ",
    linkText: "invite.kraken.com (Referral)",
    after: "",
  },
  {
    k: "p",
    text:
      "Wenn jemand über diesen Link ein Konto eröffnet und handelt, kann ich eine Referral-Vergütung erhalten.",
  },
  {
    k: "p",
    text:
      "Diese Vergütung fließt in das Testkapital meiner eigenen KapitaalBot-Umgebung und unterstützt die weitere Projektentwicklung.",
  },
  {
    k: "p",
    text: "Das steht völlig getrennt von Spenden.",
  },
  { k: "divider" },
  { k: "h2", text: "Wichtiger Haftungshinweis" },
  { k: "p", text: "KapitaalBot ist kein:" },
  {
    k: "ul",
    items: [
      "Vermögensverwaltung",
      "Anlageberatung",
      "Finanzprodukt",
      "Gewinnbeteiligungsmodell",
    ],
  },
  {
    k: "p",
    text:
      "Wer selbst handelt, tut das über ein eigenes Exchange-Konto und auf eigenes Risiko.",
  },
  {
    k: "p",
    text: "Vergangene Ergebnisse bieten keine Garantie für die Zukunft.",
  },
  { k: "divider" },
  { k: "h2", text: "Projektfakten (kurz)" },
  {
    k: "dl",
    rows: [
      { term: "Projekt", desc: "KapitaalBot" },
      { term: "Typ", desc: "Autonomous trading infrastructure experiment" },
      { term: "Fokus", desc: "algorithmic trading, risk management, execution control" },
      { term: "Daten", desc: "real-time market data processing" },
      { term: "Architektur", desc: "Route-Selection- und Execution-Engine" },
      { term: "Status", desc: "Live-Testumgebung und laufende Entwicklung" },
    ],
  },
];

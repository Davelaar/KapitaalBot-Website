import type { WatArticleBlock } from "./types";

export const watIsKapitaalbotArticleDe: WatArticleBlock[] = [
  { k: "h1", text: "Was ist KapitaalBot?" },
  {
    k: "p",
    text:
      "KapitaalBot ist kein simpler Momentum-, Breakout- oder Scalping-Bot. Es ist eine timing-bewusste, multistrategische, multiregime Execution-Engine, die pro Markt, Horizont und Route bewertet, was in dem Moment verantwortlich, erklärbar und ökonomisch handelbar ist.",
    lead: true,
  },
  {
    k: "p",
    text:
      "Im Zentrum steht weder ein Indikator noch ein Setup noch eine Lieblings-Coin. Im Zentrum steht ein Live-Auswahlprozess, der mehrere Routenkandidaten nebeneinanderstellt, sie auf Datenfrische, Tradability, Regime, Safety und Execution-Kontext prüft und nur Routen durchlässt, die unter den aktuellen Marktbedingungen wirklich ausführbar sind.",
    lead: true,
  },
  { k: "h2", text: "Kanonische Definition" },
  {
    k: "p",
    text:
      "KapitaalBot ist eine Route-Selection- und Execution-Engine mit folgenden Eigenschaften:",
  },
  {
    k: "pairRow",
    left: {
      h: "Timing-bewusste Auswahl",
      p:
        "KapitaalBot fragt nicht nur, ob ein Markt interessant ist, sondern auch, wann eine Route innerhalb eines konkreten Horizonts aussichtsreich ist. Die Zeitdimension ist kein Beiwerk, sondern Bestandteil erster Ordnung der Auswahl.",
    },
    right: {
      h: "Multistrategie",
      p:
        "Das System ist nicht um eine einzelne Strategie gebaut. Verschiedene Routenfamilien und Entry-Logiken können nebeneinander existieren, sofern jede ihre ökonomischen und operativen Randbedingungen einhält.",
    },
  },
  {
    k: "pairRow",
    left: {
      h: "Multiregime",
      p:
        "Nicht jeder Markt darf gleich gelesen werden. KapitaalBot berücksichtigt Regimeunterschiede und soll Routenwahl daran ausrichten, statt alle Symbole durch einen generischen Filter zu pressen.",
    },
    right: {
      h: "Execution-first-Wahrheit",
      p:
        "Die operative Wahrheit liegt nicht in einem Research-Snapshot oder einem starren Dashboard, sondern im Live-Execution-State, der aktuellen Marktdatenschicht, gültigem Universe-/Epoch-Kontext und den tatsächlichen Execution-Blockern.",
    },
  },
  { k: "h3", text: "Explainability by design" },
  {
    k: "p",
    text:
      "KapitaalBot muss nicht nur sagen können, warum ein Trade genommen wurde, sondern vor allem auch, warum nicht. Dazu zählen:",
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
  { k: "h3", text: "Safety und Positionskontext als Randbedingung" },
  {
    k: "p",
    text:
      "KapitaalBot ist nicht darauf ausgelegt, um jeden Preis zu handeln. Positionierung, Exposure, Datenqualität, Marktfrische und Execution-Safety gehen vor Opportunismus. Nicht handeln ist besser als handeln auf schlechter oder inkonsistenter Wahrheit.",
  },
  { k: "h2", text: "Was KapitaalBot in der Praxis ist" },
  {
    k: "p",
    text: "KapitaalBot ist ein System, das zu klären versucht:",
  },
  {
    k: "ul",
    items: [
      "welche Symbole gerade wirklich tradable sind",
      "welche Horizonte gerade sinnvolle Bewegung zeigen",
      "welche Route in diesem Kontext logisch ist",
      "welcher Blocker einen Kandidaten stoppt",
      "ob Execution ökonomisch und operativ noch vertretbar ist",
      "und wie das alles für Operator und Forensik erklärbar gemacht werden kann",
    ],
  },
  {
    k: "p",
    text:
      "Damit ist KapitaalBot kein „Coin-Picker“, sondern eine Live-Entscheidungsschicht zwischen Marktdaten und Execution.",
  },
  { k: "h2", text: "Was KapitaalBot ausdrücklich nicht ist" },
  {
    k: "notBlock",
    h: "Kein Single-Strategy-Indikator-Bot",
    p:
      "KapitaalBot sollte nicht auf eine generische Edge-Formel oder ein festes Setup vertrauen, das unverändert auf alle Märkte losgelassen wird.",
  },
  {
    k: "notBlock",
    h: "Kein Symbol-first- oder Feed-first-Dashboardmodell",
    p:
      "Ein Dashboard ist Observability, nicht die Hauptwahrheit. Wahrheit soll aus Live-Runtime, Execution-State und gültigem Marktdatenkontext kommen.",
  },
  {
    k: "notBlock",
    h: "Kein Research-Snapshot als Trading-SSOT",
    p:
      "Research, Backtests und Edgeboard-ähnliche Schichten können Kalibrierung und Analyse unterstützen, aber nicht als dominante Live-Selector-Wahrheit.",
  },
  {
    k: "notBlock",
    h: "Keine Black-Box-Signalmaschine",
    p:
      "Ein Kandidat ohne klare Begründung, warum er gewinnt oder verliert, passt nicht zum Designziel von KapitaalBot.",
  },
  {
    k: "notBlock",
    h: "Keine Anlageberatung oder Signaldienst",
    p:
      "KapitaalBot ist ein internes Handelssystem und ein Observability-/Execution-Rahmen, kein öffentliches Beratungsprodukt.",
  },
  { k: "h2", text: "Wohin sich KapitaalBot bewegt" },
  {
    k: "p",
    text: "KapitaalBot entwickelt sich zu einer Basis, in der:",
  },
  {
    k: "ul",
    items: [
      "Live-Hot-State die Auswahl führt",
      "Horizonte explizit gemessen werden",
      "Tradability first-class wird",
      "routenspezifische Ökonomie erst nach dem richtigen Kontext angewendet wird",
      "Explainability Standard ist, nicht optional",
      "und Cold Start / Fast Start verantwortlich bleibt, ohne den Rest des Marktes strukturell blind zu machen",
    ],
  },
  {
    k: "p",
    text:
      "Mit anderen Worten: KapitaalBot bewegt sich von losen Entscheidungsschichten hin zu einer zusammenhängenden, production-grade Selector- und Execution-Grundlage.",
  },
  {
    k: "h2",
    text: "Einordnung in die Kanon-Seiten",
  },
  {
    k: "p",
    text:
      "Diese Seite liefert die Kern-Definition. Für operative Observability nutzt du das Dashboard. Für Stack und Latenz SPEC. Für vertragliche Details Docs. Für Ursache-Wirkung-Fragen FAQ.",
  },
];

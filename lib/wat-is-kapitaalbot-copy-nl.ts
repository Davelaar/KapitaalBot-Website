/** Pagina: Wat is KapitaalBot (wel / niet) — native NL, SEO. */
export const watIsKapitaalbotNl: Record<string, string> = {
  "watkap.metaTitle":
    "Wat is KapitaalBot (wel en niet) | State-first trading, geen signaaldienst",
  "watkap.metaDesc":
    "KapitaalBot is een autonome trading runtime met state-first architectuur, safety-guardrails en observability — geen get-rich-quick tool en geen realtime signaaldienst. Lees de harde grenzen.",
  "watkap.metaKeywords":
    "KapitaalBot, autonome trading, state-first, execution discipline, observability, geen signaaldienst, Kraken, risicobeheer, algotrading waarheid",

  "watkap.h1": "KapitaalBot: de harde waarheid over autonome trading-architectuur",

  "watkap.intro":
    "Op basis van de technische documentatie en de architectuur van KapitaalBot is hier een scherpe analyse van wat het systeem in de kern wél en absoluut níét is. Hieronder de SEO-geoptimaliseerde kern — wat KapitaalBot expliciet wel en niet is.",

  "watkap.wel.title": "Wat KapitaalBot expliciet WEL is",
  "watkap.wel.b1":
    "**Een autonome trading runtime:** een robuuste motor die 24/7 draait op basis van een strakke ingest-to-execution-pijplijn.",
  "watkap.wel.b2":
    "**State-first architectuur:** de bot handelt uitsluitend op basis van een gevalideerde state (de `run_symbol_state`). Elke beslissing steunt op een compleet en actueel marktbeeld — niet op losse flarden data.",
  "watkap.wel.b3":
    "**Kapitaalbehoud als prioriteit:** de architectuur is doordrenkt met safety-guardrails. Risicomanagement zit in de code — van hard blocks tot automatische exit-only modi bij onregelmatigheden.",
  "watkap.wel.b4":
    "**Observeerbaar & transparant:** via een observability-pijplijn (Tier 1 & Tier 2 dashboards) worden metrics uit de database vertaald naar inzichtelijke snapshots. Je ziet geaggregeerd wat de bot ziet — binnen de tier-grenzen.",
  "watkap.wel.b5":
    "**Gedisciplineerde execution:** orders binnen strikte kaders. Geen emotie, geen afwijking van strategie — uitvoering van geprogrammeerde logica binnen risk- en safety-constraints.",

  "watkap.niet.title": "Wat KapitaalBot expliciet NIET is",
  "watkap.niet.b1":
    "**Geen ‘get rich quick’-tool:** geen magische zwarte doos die winst garandeert. Het is een technisch instrument voor wie begrijpt dat trading om statistiek en risicobeheersing draait.",
  "watkap.niet.b2":
    "**Geen realtime signaaldienst:** de stack werkt met read-model snapshots. Niet bedoeld om externe gebruikers te voorzien van snelle koop/verkoop-notificaties om handmatig op te volgen.",
  "watkap.niet.b3":
    "**Geen open orderfeed voor derden:** een gesloten executie-ecosysteem; geen publieke API om in realtime mee te liften op individuele transacties.",
  "watkap.niet.b4":
    "**Geen ongecontroleerd systeem:** dankzij safety-guardrails stopt of beperkt de bot liever handelen (bijv. bij extreme volatiliteit of datavertraging) dan onverantwoorde risico’s te nemen. Veiligheid gaat boven volume.",

  "watkap.waarom.title": "Waarom deze architectuur het verschil maakt",
  "watkap.waarom.p1":
    "De kracht zit in de scheiding van rollen: de ingest-engine verzamelt ruwe data (o.a. L2/L3-feeds), de route-engine bepaalt koers op basis van state, de execution-engine voert uit binnen veiligheidsmarges. Die hiërarchie beperkt fouten die bij minder volwassen stacks tot kapitaalverlies leiden.",

  "watkap.closing": "Kies voor discipline. Kies voor architectuur. Kies voor KapitaalBot.",

  "watkap.breadcrumb": "Wat is het (wel / niet)?",
};

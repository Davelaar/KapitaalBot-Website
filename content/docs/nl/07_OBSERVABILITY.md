# KapitaalBot — Observability & Diagnostiek

**[← 06 — Risk & Safety](./06_RISK_SAFETY.md) · [08 — Operations →](./08_OPERATIONS.md)**

---

## Wat dit document beschrijft

Hoe KapitaalBot zijn eigen gedrag inzichtelijk maakt. Observability is geen bijproduct maar een kernfunctie: het systeem is ontworpen om auditeerbaar te zijn, ook voor een externe partij die de broncode niet heeft.

---

## Wat is observability in KapitaalBot?

Observability betekent hier: het vermogen om achteraf te reconstrueren *waarom* het systeem op enig moment een specifieke beslissing heeft genomen of juist niet heeft genomen.

Dit omvat:
- het zichtbaar maken van afwijzingsredenen (why-no-trade)
- het opslaan van alle beslissingsinputs bij elke evaluatie
- het meten van uitkomsten ten opzichte van verwachtingen
- het exporteren van geaggregeerde informatie naar een externe website

Wat observability *niet* omvat: het publiceren van implementatiedetails, exacte parameterwaarden of reproductie-informatie.

---

## De handelstrechter

Het systeem houdt bij waar signalen afvallen in de beslissingsketen. Dit wordt de "funnel" of handelstrechter genoemd:

```
Signalen gegenereerd per handelspaar (universe)
  ↓ Readiness-check: is dit handelspaar klaar om te evalueren?
    → Nee: reden gelogd (bijv. verouderde data, unsafe modus)
  ↓ Strategy-pipeline: welke strategie, welke edge?
    → Geen edge: reden gelogd
  ↓ Risk-gate: is er kapitaalruimte en veiligheidstoestemming?
    → Nee: reden gelogd
  ↓ UITVOERING
```

Elke blokkade op elke laag wordt geclassificeerd met een machineleesbare code. De handelstrechter maakt het mogelijk om te analyseren waar de meeste kandidaten afvallen en of dat patroon verandert over tijd.

---

## Beslissingsvectoren

Elke serieuze kandidaat — ook niet-uitgevoerde — wordt opgeslagen als een volledige beslissingsvector (CDV). Deze bevat:

- de markt-eigenschappen op het beslissingsmoment
- het gedetecteerde regime
- de strategie-activatie met scores en afwijzingen
- de edge-schatting en fill-kans
- de mandate-beslissing en -reden

Dit maakt twee soorten analyse mogelijk:

**Directe audit**: bij een specifieke trade of niet-trade is volledig traceerbaar op welke data de beslissing was gebaseerd.

**Statistische kwaliteitsanalyse**: door beslissingsvectoren te vergelijken met werkelijke uitkomsten, kan worden gemeten of de edge-schattingen kloppen.

---

## Vooruitkijkende observaties

Om de kwaliteit van signalen te meten — ook als ze niet zijn uitgevoerd — logt het systeem vooruitkijkende observaties:

Elke keer dat de pipeline een sterk signaal ziet, wordt vastgelegd wat de prijs vervolgens heeft gedaan over meerdere tijdshorizonten. Dit levert de "markout curve" op: een statistisch beeld van of de signaal-timing voordeel heeft gehad.

Deze data wordt opgeslagen in een aparte research-database en is de basis voor kwaliteitsrapportages.

---

## Edgeboard

Het edgeboard is een real-time overzicht van de sterkste kandidaten per handelspaar. Het toont welke handelsparen de meeste waarschijnlijkheid hebben om tot uitvoering te komen, op basis van de huidige marktomstandigheden.

Het edgeboard is niet een signaal-feed — het is een diagnostisch hulpmiddel dat inzicht geeft in de huidige staat van de markt vanuit het perspectief van het systeem.

---

## Slippage-meting

Na elke fill meet het systeem de slippage: het verschil tussen de beoogde en de werkelijke uitvoeringsprijs.

Systematische slippage (consistent slechter dan verwacht) is een signaal dat de kostenmodellering moet worden bijgesteld. Het systeem gebruikt slippage-data om de edge-berekeningen te verfijnen.

---

## Observability-tiers voor externe gebruikers

KapitaalBot exporteert snapshots naar de observability-website. Er zijn drie toegangsniveaus:

| Tier | Beschikbaar voor | Wat zichtbaar is |
|------|-----------------|-----------------|
| **Tier 1** | Publiek | Geaggregeerde status, regimes, strategie-verdeling, handelstellers |
| **Tier 2** | Op aanvraag | Diepere diagnostiek: execution-kwaliteit, latency-histogrammen, funnel-analyse |
| **Tier 3** | Intern | Volledige lifecycle-telemetrie, forensische data, accountspecifieke informatie |

De scheiding is bewust: publieke observability biedt technische transparantie zonder reproductie-informatie of accountgevoelige data vrij te geven.

---

## Logging-structuur

Het systeem gebruikt gestructureerde logging met vier niveaus:

- **ERROR**: kritieke fouten die actie vereisen
- **WARN**: onverwachte situaties die gevolgd moeten worden
- **INFO**: belangrijke lifecycle-events (order geplaatst, fill ontvangen, positie gesloten)
- **DEBUG**: hoog-volume diagnostiek voor gedetailleerde analyse

Logs zijn machine-leesbaar. Elk log-bericht bevat consistent de relevante context (handelspaar, run-ID, strategie, reden).

---

*Volgende: [08 — Operations](./08_OPERATIONS.md)*

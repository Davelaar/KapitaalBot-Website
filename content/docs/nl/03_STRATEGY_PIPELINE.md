# KapitaalBot — Strategy Pipeline

**[← 02 — Data-ingest](./02_DATA_INGEST.md) · [04 — Execution →](./04_EXECUTION_ORDERS.md)**

---

## Wat dit document beschrijft

Hoe KapitaalBot van marktdata naar een handelsbeslissing komt. De pipeline is de "denklaag" van het systeem. Dit document beschrijft de stappen en de principes erachter — geen exacte formules of drempelwaarden.

---

## Overzicht van de pipeline

De strategy-pipeline is een reeks beslisfilters die voor elk handelspaar worden doorlopen:

```
Geconsolideerde toestandsrij per handelspaar
  ↓
Markt-eigenschappen berekenen
  (spread, volatiliteit, drift, liquiditeit)
  ↓
Marktregime classificeren
  (welk type markt is dit nu?)
  ↓
Strategie activeren
  (welke strategie past bij dit regime?)
  ↓
Entry-route selecteren
  (maker of taker? welk type uitvoering?)
  ↓
Exit-beleid koppelen
  (welke bescherming hoort bij deze strategie?)
  ↓
Mandate evalueren
  (alles samenbrengen: uitvoeren, observeren of blokkeren)
```

Elke stap is traceerbaar: de reden voor elke beslissing — inclusief afwijzingen — wordt opgeslagen.

---

## Stap 1: Markt-eigenschappen

Voordat een strategiebeslissing mogelijk is, worden de relevante eigenschappen van het handelspaar berekend:

- **Spread en spread-stabiliteit**: hoe breed is de spread, en is die stabiel of variabel?
- **Volatiliteit**: hoe groot zijn recente prijsbewegingen?
- **Drift en richtingsconsistentie**: beweegt de prijs consistent in één richting over meerdere tijdshorizonten?
- **Handelsdichtheid**: hoe actief is het handelspaar op dit moment?
- **Versnelling**: neemt de prijsbeweging toe of af?

Deze eigenschappen zijn de input voor alle vervolgstappen. Ze worden niet opgeslagen als absolute getallen, maar als signalen die de strategie-selectie sturen.

---

## Stap 2: Marktregime

Het systeem classificeert elk handelspaar in één van vijf marktregimes:

| Regime | Korte beschrijving |
|--------|-------------------|
| **Trend** | Duidelijke koersrichting met hoge handelsactiviteit |
| **Range** | Stabiele spread, lage koersbeweging, consolidatie |
| **Hoge volatiliteit** | Sterke koersbewegingen zonder het extreme karakter van chaos |
| **Lage liquiditeit** | Dunne orderboeken, lage handelsactiviteit |
| **Chaos** | Extreme spreads of extreme koersbewegingen; verder onderverdeeld in directioneel en ruis |

Het regime bepaalt welke strategie-families in aanmerking komen en welk gewicht ze krijgen bij de selectie. Een strategie die uitstekend werkt in een trendmarkt kan contraproductief zijn in een rangemarket.

---

## Stap 3: Strategie-activatie

KapitaalBot heeft elf strategievarianten, gegroepeerd in zes families:

| Familie | Beschrijving |
|---------|-------------|
| **Breakout** | Meebewegen met een versnellende koersbeweging die door een niveau breekt |
| **Momentum** | Volgen van een aanhoudende koersrichting, of anticiperen op het uitdoven ervan |
| **MeanReversion** | Anticiperen op terugkeer naar een evenwichtsniveau na een tijdelijke uitschieter |
| **Maker** | Passief liquiditeit verschaffen via limietorders aan de beste koers |
| **Volatility** | Profiteren van versnelde bewegingen in hoog-volatiele regimes |
| **Liquidity** | Specifiek voor laag-liquiditeitsomstandigheden met kenmerkende handelsdichtheid |

Voor elk handelspaar worden alle elf varianten geëvalueerd. Elke variant die niet voldoet, wordt afgewezen met een machineleesbare reden. Precies één variant wordt geselecteerd — altijd inclusief motivatie.

**Belang van expliciete afwijzingen**: het systeem logt niet alleen *wat* is geselecteerd, maar ook *waarom* andere opties zijn afgewezen. Dit maakt het mogelijk om te analyseren waarom het systeem in bepaalde marktomstandigheden niet handelt.

---

## Stap 4: Entry-route selectie

Nadat een strategie is geselecteerd, bepaalt de pipeline hoe de entry wordt uitgevoerd:

- **Maker-routes**: limietorder op of net voor de beste koers. Lagere transactiekosten, risico op niet-uitvoering als de markt beweegt.
- **Taker-routes**: marktorder die direct kruist met bestaand aanbod. Hogere kosten, hogere zekerheid van uitvoering.
- **Hybride routes**: begin als maker, val terug naar taker als de order niet wordt uitgevoerd binnen een tijdslimiet.

De route-keuze is strategie-afhankelijk: een breakout-strategie vereist snelle uitvoering en kiest doorgaans taker. Een maker-strategie is per definitie een limietorder.

Bij elke route wordt ook de fill-kans geschat. Een te lage fill-kans resulteert in blokkering van de entry, ook als alle andere criteria zijn voldaan.

---

## Stap 5: Exit-beleid

Elk uitvoerbaar mandaat bevat van tevoren vastgesteld exit-beleid. Er zijn tien exit-beleidvarianten, elk afgestemd op de bijbehorende strategie en entry-route:

De kern van elk exitbeleid bestaat uit:
- een **initiële stop** (beschermt bij directe tegenbeweging)
- optionele **trailing stop** (vergrendelt winst bij gunstige beweging)
- optioneel **winstdoel** (bij strategieën met duidelijk koersdoel)
- een **tijdslimiet** (automatisch uitstappen als een positie te lang open blijft)

Het exit-beleid wordt niet gekozen nadat een positie open staat, maar is onderdeel van het uitvoeringsmandaat. Dit voorkomt dat beslissingen over uitstappen worden genomen op basis van emotie of actuele situatie.

---

## Stap 6: Mandate-evaluatie

De mandate combineert alle voorgaande stappen in één beslissing:

- **Execute**: alle criteria voldaan, coherente beleidsketen, positieve edge — order wordt geplaatst
- **Observe**: een of meer criteria voldoen niet (bijv. te lage fill-kans, spread te dicht bij stop, noodtoestand in exit-beleid) — kandidaat wordt opgeslagen maar niet uitgevoerd
- **Block**: fundamentele tegenspraak in de beleidsketen — kandidaat wordt geblokkeerd

De mandate maakt zichtbaar waarom een specifiek handelspaar op een specifiek moment niet is uitgevoerd. Dit is de kern van de why-no-trade observability.

---

## Beslissingsvector (CDV)

Elke serieuze kandidaat — ook niet-uitgevoerde — wordt opgeslagen als **Candidate Decision Vector** (beslissingsvector). Deze bevat alle inputs (markt-eigenschappen, regime, strategie-scores) en outputs (edge-schatting, mandate-beslissing, reden).

De CDV maakt twee dingen mogelijk:
1. **Audit**: reconstructie van elke beslissing na het feit
2. **Kwaliteitsanalyse**: vergelijking van de verwachte edge met wat werkelijk is gebeurd

---

*Volgende: [04 — Execution & Orders](./04_EXECUTION_ORDERS.md)*

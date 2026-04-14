# KapitaalBot — Systeemarchitectuur

**[← Index](./DOC_INDEX.md) · [02 — Data-ingest →](./02_DATA_INGEST.md)**

---

## Wat dit document beschrijft

De architectuurprincipes van KapitaalBot: hoe de lagen samenwerken, hoe data stroomt en waarom de architecturale keuzes zijn gemaakt. Dit is geen implementatiegids — het beschrijft het systeem op het niveau dat nodig is om te begrijpen *wat* het doet en *waarom*.

---

## Drie kernprincipes

KapitaalBot is gebouwd op drie principes die alle architecturale keuzes verklaren:

**1. State-first, niet event-first**
Het systeem neemt geen beslissingen op basis van ruwe, binnenkomende marktberichten. Het bouwt eerst een geconsolideerde toestandsrepresentatie per handelspaar op, en evalueert uitsluitend op basis van die toestand. Dit voorkomt dat noise in het datastromen doorkomt in handelsbeslissingen.

**2. DB-first, niet in-memory-first**
De database is de autoriteit voor alle beslissingsrelevante toestand: welke orders bestaan, welke posities zijn open, welke veiligheidsregels gelden. In-memory caches zijn hulpmiddelen voor snelheid, niet voor waarheid.

**3. Observability by design**
Het systeem is ontworpen om zijn eigen gedrag inzichtelijk te maken. Elke beslissing — ook beslissingen om niet te traden — wordt geclassificeerd, geredeneerd en opgeslagen.

---

## Lagen

KapitaalBot bestaat uit vier logische lagen met strikte verantwoordelijkheden:

```
Marktdata (exchange)
        ↓
  [ Ingest-laag ]
  Ontvangt, valideert en persisteert ruwe marktdata.
  Bouwt toestandstabellen per handelspaar.
        ↓
  [ Strategy-pipeline ]
  Detecteert marktregimes. Selecteert strategie-families.
  Berekent verwachte winstmarge (edge) per kandidaat.
  Produceert uitvoeringsmandaten.
        ↓
  [ Execution-laag ]
  Beheert de order-lifecycle. Monitort open posities.
  Handhaaft bescherming via meerdere lagen.
        ↓
  [ Observability ]
  Logt funnel-events, beslisredenen en uitkomsten.
  Exporteert snapshots naar de observability-website.
```

---

## Database-topologie

KapitaalBot gebruikt drie logisch gescheiden database-rollen. Elke rol heeft een eigen verantwoordelijkheid en is nooit gecombineerd met een andere:

| Rol | Primaire inhoud |
|-----|----------------|
| **Ingest** | Ruwe marktdata, orderboek-metrieken, toestandstabellen per handelspaar |
| **Decision** | Orders, uitvoeringen (fills), posities, veiligheidsregels |
| **Research** | Vooruitkijkende observaties, microstructuur-snapshots voor kwaliteitsanalyse |

Deze scheiding is geen ontwerpvoorkeur maar een operationeel vereiste: ingest-load mag de latency van execution-beslissingen niet beïnvloeden, en execution-beslissingen mogen de integriteit van ruwe marktdata niet beïnvloeden.

---

## Procesmodel

Het systeem draait als twee onafhankelijke langlopende processen:

**Ingest-proces**
Verbindt continu met de exchange via WebSocket-verbindingen. Verwerkt marktdata en persisteert die in de ingest-database. Draait onafhankelijk van de execution-beslissingen.

**Execution-proces**
Leest periodiek de door het ingest-proces opgebouwde toestand. Doorloopt de strategy-pipeline. Voert handelsbeslissingen uit via de private WebSocket-verbinding met de exchange. Schrijft beslissingen en uitkomsten naar de decision-database.

De ontkoppeling tussen deze twee processen is bewust: een probleem in de ingest-laag stopt de observatie, maar blokkeert de execution-laag niet onmiddellijk. Omgekeerd: een probleem in de execution-laag tast de dataverzameling niet aan.

---

## Dataflow op hoofdlijnen

```
Exchange (WebSocket publiek)
  → Ingest-proces ontvangt en valideert
  → Ingest-database (ruwe samples + geconsolideerde toestand)
      ↓
Execution-proces leest toestand
  → Strategy-pipeline evalueert
  → Mandate: execute / observe / block
      ↓ (bij execute)
Exchange (WebSocket privaat)
  → Order geplaatst
  → Fill ontvangen
  → Positie bijgewerkt in decision-database
```

---

## Verbinding met de exchange

Alle communicatie met de exchange verloopt via WebSocket API v2. Er zijn drie logische verbindingstypen:

- **Publieke marktdata**: prijzen, orderboeken, trades — voor de ingest-laag
- **Private trading**: orders plaatsen, fills ontvangen, balans monitoren — voor de execution-laag
- **Authenticated L3**: diepere orderboekdata voor maker-strategieën — voor de ingest-laag

REST-calls zijn uitsluitend gereserveerd voor het ophalen van authenticatietokens voor private verbindingen. Alle trading-interactie verloopt via WebSocket.

---

## Waarom deze keuzes?

**WebSocket-first**: Lagere latency dan REST polling. Kraken-specifiek: de private WebSocket-feed (`executions`) is de enige betrouwbare bron voor order-updates.

**Dual-pool database**: Isolatie van ingest-last (hoog volume, continue writes) van execution-beslissingen (latency-kritiek, consistentie-vereist).

**State-first evaluatie**: Vermijdt dubbele verwerking van dezelfde ruwe berichten door meerdere pijplijnen. Maakt het systeem auditeerbaar: de toestand op enig moment is volledig reproduceerbaar vanuit de database.

---

*Volgende: [02 — Data-ingest](./02_DATA_INGEST.md)*

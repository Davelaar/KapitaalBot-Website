# KapitaalBot — Data-ingest & Marktdata

**[← 01 — Architectuur](./01_ARCHITECTURE.md) · [03 — Strategy Pipeline →](./03_STRATEGY_PIPELINE.md)**

---

## Wat dit document beschrijft

Hoe KapitaalBot marktdata ontvangt, valideert en verwerkt tot bruikbare toestandsrepresentaties. De focus ligt op de principes achter de implementatie, niet op de implementatie zelf.

---

## Wat wordt binnengehaald

KapitaalBot ontvangt vier typen marktdata van de exchange:

**Ticker/L1 (top-of-book)**
De beste bied- en vraagprijs, plus de meest recente handelskoers. Dit is de basis voor de prijs-cache die alle beslissingen als snelle referentie gebruiken.

**L2 orderboek**
De geaggregeerde orderdiepte op meerdere prijsniveaus. Geeft inzicht in liquiditeit, spread-stabiliteit en book-imbalance. Vereist continue integriteitscontrole via checksums.

**Individuele trades**
Elke uitgevoerde trade met richting, prijs en volume. Voeden volume-analyse, trade-dichtheids-berekeningen en de VWAP-lijn.

**L3 orderboek (geauthenticeerd)**
Individuele orders per prijsniveau — niet geaggregeerd. Geeft zichtbaarheid op wachtrijdynamiek. Vereist authenticatie en heeft een apart verbindingspunt.

---

## Integriteitsborging: L2-checksums

Het L2-orderboek is bijzonder gevoelig voor fouten: een enkel gemist delta-bericht maakt het hele boek onjuist. KapitaalBot implementeert de door Kraken gespecificeerde CRC32-checksumvalidatie op elke update.

```
Ontvang L2-delta
  → Verwerk delta op lokale boekrepresentatie
  → Bereken checksum over de bovenste niveaus
  → Vergelijk met checksum van de exchange
  → Match: boek is betrouwbaar → update metrieken
  → Geen match: markeer symbool als onbetrouwbaar → hersubscribeer
```

Een mismatched checksum heeft directe gevolgen: het handelspaar wordt tijdelijk als niet-betrouwbaar gemarkeerd totdat een nieuw volledig snapshot is ontvangen en gevalideerd. Nieuwe entries worden in die periode geblokkeerd. Dit is geen soft-warning maar een hard blok.

**Waarom dit cruciaal is**: De beslissingsengine neemt aannames over spread-breedte en liquiditeitsdiepte op basis van het L2-boek. Een corrupt boek leidt direct tot onjuiste edge-berekeningen. De checksum-validatie is de eerste verdedigingslinie hiertegen.

---

## Van ruwe data naar toestandstabellen

Ruwe marktdata wordt niet direct door de decision-engine gebruikt. Het ingest-proces transformeert binnenkomende berichten naar persistente samples:

- **Handelssamplestabel**: elke trade geclassificeerd met richting, prijs, volume en tijdstip
- **L2-snapmetrieken**: periodieke samenvatting van boekbalans en dichtheid
- **L3-wachtrijmetrieken**: samenvatting van de wachtrijpositie van orders op de beste niveaus

Deze samples worden periodiek samengevoegd tot een **geconsolideerde toestandsrij per handelspaar** (`run_symbol_state`). Die toestandsrij is de input voor de strategy-pipeline. De pipeline leest nooit rechtstreeks ruwe tabellen.

**Waarom deze tussenstap?** Directe query's op ruwe data zijn te traag voor de evalutie-frequentie die het systeem vereist. Bovendien maakt de toestandstabel audittrails eenvoudiger: je kunt altijd achterhalen op welke data een beslissing was gebaseerd.

---

## Runs en epochs

KapitaalBot deelt zijn uitvoeringen in via `runs` en `epochs`:

**Run**: een procesinstantie. Elke keer dat het systeem opstart, begint een nieuwe run met een uniek ID. Alle data is gekoppeld aan een run-ID, wat forensics en opschoning vereenvoudigt.

**Epoch**: een tijdvenster binnen een run. Aan het begin van elke epoch wordt het universum van te volgen handelsparen vastgesteld op basis van actuele instrumentdata van de exchange. Handelsparen die niet aan de eisen voldoen (minimum handelsvolume, minimale ordergrootte) worden niet meegenomen.

Deze indeling zorgt ervoor dat het systeem altijd weet op welke data een beslissing gebaseerd was, en dat historische analyses herleidbaar zijn.

---

## WebSocket-verbindingsprincipes

De ingest-laag verbindt via drie typen WebSocket-verbindingen, elk met eigen verantwoordelijkheden:

**Publieke verbinding** — marktdata zoals orderboeken, trades en ticker. Geen authenticatie vereist.

**Geauthenticeerde private verbinding** — private orderboekdata (L3) en live orders/fills. Vereist een sessietoken dat bij elke reconnect opnieuw wordt opgehaald.

**Reconnect-beleid**: bij elke herverbinding wordt het sessietoken vernieuwd. Tokens zijn alleen geldig voor de duur van de actieve verbinding. Bij herverbinding op het publieke orderboek wordt een volledig nieuw snapshot aangevraagd voordat delta-updates worden verwerkt.

---

*Volgende: [03 — Strategy Pipeline](./03_STRATEGY_PIPELINE.md)*

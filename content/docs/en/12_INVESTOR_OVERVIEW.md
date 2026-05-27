# KapitaalBot — Investeerdersoverzicht

**[← Index](./DOC_INDEX.md) · [13 — Investor Risk Report →](./13_INVESTOR_RISK_REPORT.md)**

---

> **Let op**: Dit document is uitsluitend informatief van aard. Het bevat geen beleggingsadvies, geen rendementsgaranties en geen uitnodiging tot investering. Alle claims in dit document zijn technisch verdedigbaar vanuit de broncode en het systeemgedrag.

---

## Samenvatting

KapitaalBot is een autonoom algorithmic trading systeem dat draait op spotmarkten bij Kraken. Het systeem combineert regime-detectie, multi-strategie selectie en gelaagde risicobescherming in een volledig observeerbare runtime.

Het doel van dit document is inzicht bieden in de technische architectuur, de risico-aanpak en de operationele staat van het systeem — zonder marketingtaal en zonder claims die niet uit het systeem zelf zijn te verifiëren.

---

## Wat het systeem is

KapitaalBot is een **research- en trading-engine** met de volgende aantoonbare eigenschappen:

**Volledig autonoom**: het systeem neemt beslissingen zonder menselijke tussenkomst. Een operator kan het systeem starten, stoppen en configureren, maar de handelsbeslissingen worden volledig algoritmisch gemaakt.

**Multi-regime**: het systeem detecteert vijf marktregimes (trend, range, hoge volatiliteit, lage liquiditeit, chaos) en past zijn strategie-selectie aan op het gedetecteerde regime.

**Multi-strategie**: elf strategievarianten, gegroepeerd in zes families, worden per handelspaar en per evaluatiecyclus beoordeeld. De selectie is deterministisch en volledig gedocumenteerd.

**DB-first**: de database is de bron van waarheid voor alle beslissingsrelevante toestand. In-memory caches zijn hulpmiddelen, niet autoriteiten.

**Observeerbaar by design**: elke beslissing — ook beslissingen om niet te traden — is geclassificeerd, geredeneerd en opgeslagen. De observability-website biedt publieke en tiered toegang tot geaggregeerde informatie.

**Exchange-specifiek**: de huidige implementatie is uitsluitend gericht op spotmarkten bij Kraken via WebSocket API v2.

---

## Wat het systeem niet is

**Geen backtest-geoptimaliseerd systeem**: de strategieën zijn ontworpen vanuit marktstructuurprincipes, niet gefit op historische data.

**Geen black box**: het systeem is bewust ontworpen om zijn eigen gedrag uit te leggen. Elke handelsbeslissing heeft een machineleesbare reden.

**Geen rekenmachine voor verwacht rendement**: dit document bevat geen rendementsclaims, geen simulatieresultaten en geen prognoses. Algoritmisch traden op crypto-spotmarkten kent reële risico's op verlies van kapitaal.

**Geen product voor eindklanten**: KapitaalBot is een eigenhandelssysteem, geen beheerd fonds of retail-product.

---

## Architectuuroverzicht

Het systeem bestaat uit vier lagen:

| Laag | Primaire functie |
|------|----------------|
| **Ingest** | Marktdata ontvangen, valideren en persisteren via WebSocket-verbindingen |
| **Strategy pipeline** | Regime-detectie, strategie-activatie, edge-schatting, mandate-productie |
| **Execution** | Order-lifecycle beheren, posities monitoren, bescherming handhaven |
| **Observability** | Beslissingen loggen, uitkomsten meten, snapshots exporteren |

De architectuur is opgebouwd op het principe van sterke scheiding: ingest-last beïnvloedt execution-latency niet, en execution-beslissingen beïnvloeden de integriteit van marktdata niet.

---

## Risicobeheer

Het systeem implementeert risicobeheer op vier niveaus:

**Positieniveau**: elke open positie heeft altijd een actieve beschermende stop op de exchange. Exit-beleid is pre-committed bij entry.

**Symboolniveau**: elk handelspaar heeft een veiligheidsstatus (normaal / alleen-uitstap / geblokkeerd). Onbetrouwbare marktdata of abnormale uitvoering leiden automatisch tot beperkingen.

**Portfolioniveau**: limieten op totale blootstelling en het aantal gelijktijdige open posities.

**Systeemniveau**: circuit breakers bij foutpercentages, verouderde data en globale verlieslimiet. Dead man's switch bij de exchange voor bescherming bij systeemuitval.

---

## Operationele infrastructuur

Het systeem draait als twee systemd-diensten op een dedicated Linux-server:
- **Ingest-dienst**: continue dataverzameling
- **Execution-dienst**: strategie-evaluatie en trading

Alle code is versiegebonden via Git. Elke runtime-uitvoering is herleidbaar naar een specifieke commit-hash. Deployment vereist altijd een Git-pull; directe server-aanpassingen zijn architecturaal verboden.

---

## Observability en transparantie

Een onderscheidend kenmerk van KapitaalBot is de expliciete observability. De publieke website (kapitaalbot.nl) toont geaggregeerde systeeminformatie zonder accountgevoelige data of reproductie-informatie:

- Actuele systeemstatus, regimes en strategie-verdeling
- Why-no-trade analyse: waarom bepaalde handelsparen niet zijn getraded
- Execution-kwaliteitsmetrieken (Tier 2, op aanvraag)
- Historische funnel-analyse

---

## Wat investeerders kopen

Dit is een investering in de **verdere ontwikkeling en schaling** van het systeem, niet in een bewezen renderende strategie. Wat concreet beschikbaar is:

- Werkende, in productie draaiende trading-engine
- Volledige observability-infrastructuur
- Gedocumenteerde architectuur en design-principes
- Actief onderhouden codebase (Rust)

Wat **niet** beschikbaar is als bewijs:
- Geauditeerde financiële resultaten
- Formele backtesting-infrastructuur
- Track record onder marktomstandigheidsvariatie
- Derde-partij validatie

---

*Zie ook: [13 — Investor Risk Report](./13_INVESTOR_RISK_REPORT.md)*

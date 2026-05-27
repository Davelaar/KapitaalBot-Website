# KapitaalBot — Investor Risk Report

**[← 12 — Investeerdersoverzicht](./12_INVESTOR_OVERVIEW.md) · [Index →](./DOC_INDEX.md)**

---

> Dit rapport is bedoeld om potentiële investeerders een eerlijk beeld te geven van de risico's en tekortkomingen van KapitaalBot in zijn huidige staat. Geen enkel punt in dit rapport is verborgen. Technische opmerkingen zijn aantoonbaar vanuit de codebase.

---

## Risico 1: Single-exchange afhankelijkheid

**Probleem**: het systeem draait uitsluitend op Kraken spotmarkten. Er is geen multi-exchange architectuur.

**Impact op investeerbaarheid**: bij een langdurige Kraken-storing, API-wijziging of onbeschikbaarheid is het systeem volledig inactief. Er is geen failover naar een andere venue.

**Technische oplossing**: multi-exchange architectuur vereist significante refactoring van de exchange-adapters, de execution-laag en de balans-reconciliatie. Dit is een groot technisch traject, niet een snelle toevoeging.

---

## Risico 2: Geen geformaliseerde backtesting-infrastructuur

**Probleem**: de codebase bevat geen geïntegreerde backtesting-pipeline. Strategieprestaties zijn niet systematisch gevalideerd op historische data over variërende marktomstandigheden.

**Impact op investeerbaarheid**: het is niet mogelijk om met statistisch vertrouwen te stellen dat de strategieën historisch hebben gewerkt. De enige beschikbare validatie is live-gedrag en forward observations.

**Technische oplossing**: bouwen van een replay-omgeving die historische marktdata door de pipeline kan sturen, gecombineerd met een framework voor strategie-validatie. Dit bestaat als infrastructuurplan maar is nog niet gebouwd.

---

## Risico 3: Operationele afhankelijkheid van één persoon

**Probleem**: het systeem wordt beheerd door één operator. Er is geen gedocumenteerde procedure voor overdracht of continuïteit bij uitval van de operator.

**Impact op investeerbaarheid**: single point of failure op operationeel niveau. Bij ziekte, onbeschikbaarheid of een andere storing is er niemand anders die het systeem kan beheren.

**Technische oplossing**: gedocumenteerd runbook voor operationele overdracht, meerdere beheerders met toegang, en operationele SLA-documentatie.

---

## Risico 4: Complexe migratiegeschiedenis (132 SQL-migraties)

**Probleem**: de database heeft 132 SQL-migratiescripts over drie pools (ingest, decision, research). Er is geen centraal overzicht of verzettingslog van wat elke migratie heeft gewijzigd en waarom.

**Impact op investeerbaarheid**: de complexiteit van de datastructuur maakt onboarding van nieuwe ontwikkelaars moeilijker en vergroot het risico op migratieproblemen bij grote schema-wijzigingen.

**Technische oplossing**: migratie-documentatiestandaard invoeren, schema-overzichtsdocument opstellen, en periodiek opschonen van verouderde migraties naar consolidated schema-snapshots.

---

## Risico 5: Documentatie-volledigheid was tot voor kort beperkt

**Probleem**: de publieke documentatie was tot de recente update onvolledig en bevatte deels te technische details die reconstructie mogelijk maakten. De strategie-documentatie ontbrak volledig.

**Impact op investeerbaarheid**: onvolledige documentatie verzwakt due-diligence-mogelijkheden en vergroot de afhankelijkheid van de operator als kennisbron.

**Technische oplossing**: dit risico is gedeeltelijk gemitigeerd door de documentatieherziening in dit project. Resterende lacunes: geen formele API-documentatie, geen formele SLA-documentatie.

---

## Risico 6: Geen formele disaster recovery-procedure

**Probleem**: er is geen gedocumenteerde DR-procedure voor scenario's zoals volledige serverfailure, database-corruptie of verlies van kritieke credentials.

**Impact op investeerbaarheid**: bij een catastrofaal systeem-incident is de hersteltijd onbekend en niet gegarandeerd.

**Technische oplossing**: opstellen van DR-playbook, regelmatige DB-backups met gedocumenteerde restore-procedure, en offsite opslag van credentials.

---

## Risico 7: Crypto-marktrisico

**Probleem**: het systeem handelt uitsluitend in cryptocurrencies. Cryptomarkten kennen extreme koersvolatiliteit, regelgeving-onzekerheid, exchange-risico's en lagere liquiditeit dan traditionele markten.

**Impact op investeerbaarheid**: de basisactivaklasse brengt inherente risico's mee die niet door het systeem kunnen worden geëlimineerd.

**Technische "oplossing"**: dit is geen technisch risico maar een marktrisico. Het systeem heeft beschermingsmechanismen (stops, circuit breakers, exposure-limieten) maar elimineert het marktrisico niet.

---

## Samenvatting: risico-inschatting per categorie

| Categorie | Ernst | Mitigeerbaarheid |
|-----------|-------|-----------------|
| Single-exchange afhankelijkheid | Hoog | Ja, maar groot traject |
| Geen backtesting | Hoog | Ja, maar significant traject |
| Operationele single PoF | Hoog | Ja, relatief snel |
| Migratiecomplexiteit | Middel | Ja, geleidelijk |
| Documentatievolledigheid | Middel | Ja, deels al gemitigeerd |
| Geen DR-procedure | Hoog | Ja, relatief snel |
| Crypto-marktrisico | Inherent | Nee (marktfactor) |

---

*Terug naar: [12 — Investeerdersoverzicht](./12_INVESTOR_OVERVIEW.md)*

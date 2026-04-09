# Public Canon Map (Website)

Status: CANONICAL
Scope: publieke knowledge layer van KapitaalBot-Website

## Doel

Deze map definieert welke publieke pagina de canonieke bron is per onderwerp.
Zo voorkomen we dubbele of conflicterende semantiek voor bezoekers, zoekmachines en RAG-systemen.

## Canonieke pagina's per onderwerp

| Onderwerp | Canonieke pagina | Rol |
|---|---|---|
| Systeemdefinitie | `/over/wat-is-kapitaalbot` | Primaire definitie van wat KapitaalBot is en niet is |
| Technische specificatie | `/spec` | Stack, runtime-architectuur, latency target/observed/why |
| Live observability (publiek) | `/dashboard` | Route-/decision-centric operationele waarheid |
| Publieke contractdocumentatie | `/docs` + `/docs/OBSERVABILITY_SNAPSHOT_CONTRACT` | Contractuele en architecturale documentbron |
| Publieke kennisartikelen | `/kennis` + `/kennis/[slug]` | Thema-uitwerking met expliciete definities |
| Vraag/antwoord kennislaag | `/faq` | Economisch/juridisch/technisch cause/effect uitleg |
| Wijzigingshistorie publieke laag | `/changelog` | Canon-line wijzigingen en engine commitgeschiedenis |

## Public safety boundary

Publiek wel:
- functionele werking
- architectuur en begrippen
- explainability en geaggregeerde outcomes
- route-/decision-context op beschrijvend niveau

Publiek niet:
- broncode of codefragmenten
- private accountdetails en gevoelige PnL-details
- reproduceerbare tuningwaarden, thresholds of allocator-fine-tuning

## Redactionele regels

1. Gebruik altijd de canonieke termen:
   - timing-aware
   - multistrategy
   - multiregime
   - route-selection engine
   - route-state
   - explainability
   - position-context
2. Vermijd oude framing (symbol/feed-first als hoofdmodel).
3. Vermijd dubbele uitleg:
   - vat samen op secundaire pagina's
   - link naar de canonieke pagina voor volledige definitie
4. Schrijf AI/RAG-vriendelijk:
   - expliciete definities
   - lage ambiguiteit
   - duidelijke heading-structuur
   - vraag/antwoord waar relevant

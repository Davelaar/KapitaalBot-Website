# KapitaalBot — Operationeel Beheer

**[← 07 — Observability](./07_OBSERVABILITY.md) · [09 — Strategieën →](./09_STRATEGIES.md)**

---

## Wat dit document beschrijft

Hoe KapitaalBot draait als productiesysteem: de deployment-aanpak, de service-architectuur en de principes voor operationeel beheer. Dit document beschrijft de structuur — geen configuratiewaarden of SSH-toegangsdetails.

---

## Deployment-principe: Git-only

KapitaalBot hanteert een strikte Git-only codeflow. Dit betekent:

- Alle wijzigingen worden gecommit en gepushed naar de repository
- De productieserver haalt altijd code op via `git pull`
- Directe aanpassingen op de server buiten Git om zijn verboden
- Elke runtime-uitvoering is koppelbaar aan een specifieke commit-hash

**Waarom dit principe?**
Een productiesysteem dat met echt kapitaal handelt, mag nooit in een toestand zijn waarbij onduidelijk is welke code draait. Git-traceerbaarheid is de harde eis voor elk forensisch onderzoek.

---

## Twee kerndiensten

KapitaalBot draait als twee onafhankelijke langlopende diensten, beheerd via systemd:

**Ingest-dienst**
Verantwoordelijk voor continue dataverzameling. Verbindt met publieke en geauthenticeerde WebSocket-feeds. Schrijft naar de ingest-database. Kan herstarten zonder dat de execution-dienst wordt onderbroken.

**Execution-dienst**
Verantwoordelijk voor strategie-evaluatie en trading. Leest toestandsdata van de ingest-database. Schrijft beslissingen en uitkomsten naar de decision-database. Start met een volledige reconciliatie van de exchange-status.

De ontkoppeling tussen deze diensten is een bewuste architectuurkeuze: een probleem in de ene dienst heeft geen directe cascade naar de andere.

---

## Opstartvolgorde en reconciliatie

Bij het opstarten van de execution-dienst:

1. Database-verbindingen worden geverifieerd
2. API-authenticatie wordt getest
3. Alle balansen en open orders worden gesynchroniseerd met de exchange
4. Veiligheidsstatus per handelspaar wordt hersteld
5. Pas daarna begint de eerste evaluatiecyclus

Stap 3 (reconciliatie) is niet overgeslagen bij herstart. Het systeem gaat er nooit vanuit dat zijn interne staat nog klopt na een onderbreking.

---

## Deployment-stappen

Het standaardproces voor een update:

```
1. Wijziging aangebracht en getest in de lokale repository
2. Commit aangemaakt met duidelijke beschrijving
3. Push naar de centrale repository
4. Op de productieserver: git pull (haal de nieuwe commit op)
5. Build: compileer de nieuwe versie
6. Herstart de relevante dienst(en)
7. Verifieer: check de logs op succesvolle opstart en reconciliatie
8. Leg vast: welke commit-hash draait nu op de productieserver?
```

Stap 8 is niet optioneel. De operator moet altijd weten welke commit-hash de live binary is.

---

## Validatiescripts

Het systeem bevat scripts voor operationele validatie:

**Database-doelverificatie**: verifieert dat een query op de juiste database-pool (ingest of decision) wordt uitgevoerd. Verplicht voor elk handmatig database-onderzoek.

**Live engine-validatie**: controleert of de binary correct gebouwd is, de databases bereikbaar zijn en de API-sleutels werken.

**Safety-rapport**: geeft een overzicht van de WebSocket-gezondheid, veiligheidsstatus per handelspaar en recente anomalieën.

---

## Incident response

Bij een onverwacht incident (onverklaarbaar verlies, exchange-fouten, systeemcrash):

**Stap 1 — Noodstop**
Stop de execution-dienst. De dead man's switch op de exchange annuleert alle open orders binnen het ingestelde tijdvenster.

**Stap 2 — Diagnose**
- Controleer de logs op ERROR- en WARN-berichten
- Controleer open posities op de exchange
- Voer het safety-rapport-script uit

**Stap 3 — Herstel**
- Los het probleem op in de lokale repository
- Commit de fix
- Deploy naar de productieserver
- Herstart de dienst en monitor de reconciliatie-fase nauwkeurig

**Geen uitzonderingen op Git-only**: ook spoedfixes gaan via de repository. Een directe aanpassing op de server is een operationeel risico en verboden.

---

## Monitoring en alerting

Het systeem stuurt proactieve meldingen bij:

- kritieke fouten die actie vereisen
- detectie van inconsistentie tussen de ingest- en decision-databases
- veiligheidsstatus-wijzigingen op handelsparen
- systemen die langer dan verwacht geen updates ontvangen

Alerting verloopt via een geconfigureerde notificatiekanaal (buiten het bereik van deze publieke documentatie).

---

*Volgende: [09 — Strategieën](./09_STRATEGIES.md)*

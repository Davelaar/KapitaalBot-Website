# KapitaalBot — Risk & Safety

**[← 05 — Protection & Exit](./05_PROTECTION_EXIT.md) · [07 — Observability →](./07_OBSERVABILITY.md)**

---

## Wat dit document beschrijft

De risico- en veiligheidslaag van KapitaalBot: hoe het systeem kapitaal beschermt tegen marktfalen, exchange-storingen en onverwacht systeemgedrag. Veiligheid is hiërarchisch georganiseerd, van portfolioniveau tot individueel handelspaar.

---

## Hiërarchie van veiligheidslagen

```
Portfolio-niveau (globaal)
  └─ Maximaal totaalverlies in een tijdvenster
  └─ Maximale totale blootstelling aan de markt

Handelspaar-niveau (per symbool)
  └─ Maximale blootstelling per symbool
  └─ Veiligheidsstatus (normaal / alleen-uitstap / hard geblokkeerd)

Order-niveau (per beslissing)
  └─ Spread te breed ten opzichte van de stop?
  └─ Fill-kans te laag?
  └─ Uitvoeringsmandaat coherent?
```

Elke laag kan een beslissing blokkeren. Een groen licht op portfolio-niveau betekent niet automatisch toestemming op symbool-niveau.

---

## Veiligheidsstatus per handelspaar

Elk handelspaar heeft een permanente veiligheidsstatus in de database:

| Status | Betekenis |
|--------|-----------|
| **Normaal** | Volledig actief; nieuwe entries en exits zijn toegestaan |
| **Alleen-uitstap** | Geen nieuwe entries; bestaande posities worden beschermd en gesloten |
| **Hard geblokkeerd** | Alle acties geblokkeerd; geen trading, geen aanpassing van bescherming |

Een handelspaar kan door meerdere mechanismen in een beperktere status terechtkomen:
- onbetrouwbaar L2-orderboek (checksum-fout)
- abnormale slippage op recente fills
- externe trigger van de watchdog
- handmatige override door de operator

Overgang naar een minder beperkende status vereist dat de trigger-conditie niet meer aanwezig is.

---

## Kapitaaltoewijzing

Het systeem beheert actief hoeveel kapitaal tegelijkertijd is ingezet:

**Slotbeheer**: het maximum aantal gelijktijdig open posities is begrensd. Als alle slots bezet zijn, worden nieuwe kandidaten geblokkeerd ongeacht hun kwaliteit.

**Blootstellingslimieten**: de totale marktwaarde van alle open posities is begrensd, zowel per handelspaar als over het hele portfolio. Een individueel handelspaar kan nooit meer dan een bepaald percentage van het totale kapitaal innemen.

**Grootte-afstemming op kwaliteit**: de grootte van een positie wordt geschaald op basis van de geschatte edge en fill-kans. Hogere kwaliteit rechtvaardigt grotere positiegrootte — maar altijd begrensd door absolute limieten.

---

## Blootstelling-reconciliatie

Het systeem controleert regelmatig of zijn interne administratie overeenkomt met de werkelijkheid op de exchange:

**Bij opstart**: alle balansen en open orders worden gesynchroniseerd met de exchange voordat de eerste handelsbeslissing wordt genomen.

**Periodiek**: het systeem controleert of posities die intern als open worden bijgehouden, ook werkelijk open zijn op de exchange. Posities die op de exchange gesloten zijn maar intern nog als open staan, worden opgeruimd.

**Ghost-lock-preventie**: dit is het scenario waarbij het systeem een slot bezet houdt voor een positie die al gesloten is. Zonder reconciliatie zou dit leiden tot minder beschikbare capaciteit dan werkelijk aanwezig.

---

## Circuit breakers

Bij afwijkend systeemgedrag worden automatisch breakers geactiveerd:

**Foutpercentage**: als een significant deel van de API-aanvragen mislukt, stopt het systeem met nieuwe entries.

**Globaal verlies**: als het cumulatieve verlies over een bepaald tijdvenster een grens bereikt, schakelt het systeem over naar alleen-uitstap modus.

**Verouderde data**: als de prijs-cache of het L2-orderboek langer dan een drempel geen updates heeft ontvangen, worden nieuwe entries geblokkeerd. Beslissingen op basis van verouderde data zijn onbetrouwbaar.

---

## Consistentie-watchdog

Een achtergrondproces controleert continu de samenhang tussen de ingest-database en de decision-database:

- Draaien de twee processen (ingest en execution) op dezelfde epoch?
- Zijn er posities of orders die tegenstrijdig zijn tussen de twee databases?
- Zijn er handelsparen waarbij de beslissingsdata ouder is dan verwacht?

Bij gedetecteerde inconsistentie:
1. Het betrokken handelspaar gaat naar alleen-uitstap modus
2. Een alarm wordt verstuurd
3. De herstelactie wordt gelogd

Dit is de bescherming tegen het "split-brain"-scenario: waarbij de execution-engine beslissingen neemt op basis van data die niet meer overeenkomt met de actuele markt.

---

## Wat het systeem niet kan voorkomen

Eerlijkheid over grenzen is onderdeel van een transparante architectuur:

- **Flash crashes en extreme gapping**: een prijs kan in milliseconden door een stop schieten voordat de exchange de stop kan uitvoeren
- **Exchange-uitval**: als de exchange onbereikbaar is, kunnen beschermende stops niet worden bijgewerkt; de dead man's switch geeft een tijdgebonden achtervang
- **Onbekende correlaties**: het systeem behandelt handelsparen individueel; systemische marktschokken die meerdere paren tegelijk raken, worden niet anders behandeld dan individuele schokken

---

*Volgende: [07 — Observability](./07_OBSERVABILITY.md)*

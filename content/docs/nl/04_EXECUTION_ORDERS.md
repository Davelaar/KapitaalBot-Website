# KapitaalBot — Execution & Order Lifecycle

**[← 03 — Strategy Pipeline](./03_STRATEGY_PIPELINE.md) · [05 — Protection & Exit →](./05_PROTECTION_EXIT.md)**

---

## Wat dit document beschrijft

Hoe KapitaalBot een handelsbeslissing omzet in een order op de exchange, en hoe de volledige lifecycle van die order wordt gevolgd. De nadruk ligt op de principes van betrouwbaarheid en traceerbaarheid.

---

## Van beslissing naar order

De strategy-pipeline produceert uitvoeringsmandaten. Het execution-systeem zet die mandaten om in acties:

```
Mandate (Execute)
  ↓
Kandidaat wordt in een prioriteitswachtrij geplaatst
  ↓
Execution-choke controleert veiligheidscondities
  ↓ (groen licht)
Order wordt aangemaakt in de database (status: pending)
  ↓
Order wordt verstuurd via private WebSocket
  ↓
Exchange bevestigt ontvangst (ACK)
  ↓
Exchange stuurt statusupdates: open, gedeeltelijk gevuld, gevuld, gecanceld
  ↓
Database bijgewerkt bij elke statusovergang
```

Belangrijk: de order bestaat in de database *voordat* hij naar de exchange wordt gestuurd. Als het systeem op enig moment herstart, is de order-toestand altijd reconstrueerbaar vanuit de database.

---

## De executions-feed als bron van waarheid

De WebSocket-bevestiging op een geplaatste order is slechts een ACK — een bevestiging dat de exchange het verzoek heeft ontvangen. De werkelijke status (open, gevuld, gecanceld) komt uitsluitend via de `executions`-feed.

Dit onderscheid is cruciaal: een positieve ACK betekent niet dat een order is gevuld. Het systeem wacht op expliciete statusberichten via de executions-feed voordat het de interne toestand bijwerkt.

---

## Order-toestandsmachine

Orders doorlopen een vaste reeks toestanden. Elke overgang heeft een reden en wordt gelogd:

```
[aangemaakt] → [verzonden naar exchange] → [open op de exchange]
  → [gedeeltelijk gevuld] → [volledig gevuld]
  → [gecanceld]
  → [geweigerd door exchange]
  → [verlopen]
```

Elke toestand is gedocumenteerd. Er zijn geen impliciete overgangen. Een order die niet meer in een actieve toestand staat, heeft altijd een eindtoestand met reden.

---

## Uitvoeringsintentie

KapitaalBot maakt expliciet onderscheid tussen drie uitvoeringsintentijes:

| Intentie | Beschrijving |
|----------|-------------|
| **MakerEntry** | Limietorder op of nabij de beste koers; liquiditeit verschaffen |
| **TakerEntry** | Order die direct kruist met bestaand aanbod in het boek; liquiditeit onttrekken |
| **TakerExit** | Uitstap via een marktorder; prioriteit is snelheid, niet koers |

De intentie bepaalt welk type order wordt geplaatst en hoe de exchange het zal verwerken.

---

## Fill-verwerking

Wanneer een order (gedeeltelijk) wordt gevuld, start een reeks gecoördineerde acties:

1. De fill wordt vastgelegd in de fills-tabel
2. De netto positie wordt bijgewerkt
3. Voor entry-fills: protectie wordt direct geactiveerd (zie [05 — Protection & Exit](./05_PROTECTION_EXIT.md))
4. Bij een sluitende fill: de gerealiseerde PnL wordt berekend

Fill-verwerking is **idempotent**: als hetzelfde fill-bericht twee keer binnenkomt (wat kan bij reconnects), wordt het tweede bericht herkend en genegeerd. Er worden geen dubbele boekingen gemaakt.

---

## Dead man's switch

Het systeem onderhoudt een veiligheidsautomaat bij de exchange: als de bot stopt met het sturen van een vernieuwingssignaal, worden alle open orders automatisch geannuleerd door de exchange na een ingesteld tijdvenster.

Dit beschermt tegen situaties waarbij het systeem crasht, de verbinding verbreekt of anderszins onbereikbaar wordt terwijl er open orders zijn. De exchange neemt dan het initiatief om orders op te ruimen — er is geen actie van de operator vereist.

---

## Concurrentiebeheer

Het systeem kan meerdere handelsparen tegelijkertijd evalueren en uitvoeren. Voor elk handelspaar geldt echter één tegelijkertijdigheidsbeperking: twee evaluatiecycli kunnen niet tegelijk een order proberen te openen voor hetzelfde handelspaar. Een veiligheidsslot per symbool voorkomt race conditions.

---

## Traceerbaarheid

Elke order is volledig traceerbaar:

- **Aanmaaktijdstip**: wanneer de beslissing is genomen
- **Verzendelingstijdstip**: wanneer de order naar de exchange is gestuurd
- **Bevestigingstijdstip**: wanneer de exchange heeft bevestigd
- **Fill-tijdstip**: wanneer uitvoering heeft plaatsgevonden
- **Reden**: waarom elk type order is gekozen

Dit maakt forensisch onderzoek na het feit mogelijk: elke handeling is herleidbaar naar een specifiek beslissingsmoment.

---

*Volgende: [05 — Protection & Exit](./05_PROTECTION_EXIT.md)*

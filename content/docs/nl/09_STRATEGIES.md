# KapitaalBot — Strategie-families

**[← 08 — Operations](./08_OPERATIONS.md) · [Index →](./DOC_INDEX.md)**

---

## Wat dit document beschrijft

De zes strategie-families die KapitaalBot hanteert. Dit document beschrijft *wat* elke familie probeert te bereiken en *in welke marktomstandigheden* ze inzetbaar zijn. Geen exacte drempelwaarden, geen implementatiedetails.

---

## Hoe strategie-selectie werkt

KapitaalBot hanteert elf specifieke strategievarianten, gegroepeerd in zes families. Bij elke evaluatiecyclus worden alle elf varianten beoordeeld voor elk handelspaar. Elke variant die niet voldoet, wordt afgewezen met een machineleesbare reden. Precies één variant wordt geselecteerd — of het resultaat is "geen kans" als geen enkele variant voldoet.

De selectie is gebaseerd op drie factoren:
1. Het gedetecteerde marktregime
2. De actuele markt-eigenschappen (drift, spread, liquiditeit, volatiliteit)
3. Regime-gewichten die aangeven hoe geschikt een strategie is in het huidige regime

---

## Familie 1: Breakout

**Kernidee**: meebewegen met een koersbeweging die duidelijk door een niveau breekt en versnelt.

**Twee varianten**:

*Directe uitbraak (Breakout Immediate)*: activeer direct bij sterke versnelling. Dit is de snelste variant — bedoeld voor situaties waarbij uitstel betekent dat het meeste van de beweging al voorbij is.

*Bevestigde uitbraak (Breakout Confirmed)*: activeer pas als de beweging consistent is over meerdere tijdshorizonten. Meer zekerheid, lagere kans op een vals signaal, maar later instap.

**Gunstige regimes**: Trend, Hoge volatiliteit (met voorzichtigheid), Chaos-directioneel

**Minder geschikt voor**: Lage-liquiditeit (te groot risico op slechte uitvoering), Range (bewegingen keren terug)

---

## Familie 2: Momentum

**Kernidee**: inspelen op een bestaande aanhoudende koersbeweging — óf meerijden terwijl hij aanhoudt, óf anticiperen op het uitdoven ervan.

**Twee varianten**:

*Momentumrit (Momentum Ride)*: volg een beweging die aanhoudt. Vereist dat de richting consistent is over meerdere horizons. Werkt het best als de beweging versnelt of stabiel blijft.

*Momentumuitdoving (Momentum Fade)*: anticipeer op het afzwakken van een bestaande beweging. Activeer als er tekenen zijn dat de trend uitdooft, maar nog niet omgekeerd is.

**Gunstige regimes**: Trend (Ride), Trend/High-vol (Fade bij sterkere tekenen van uitdoving)

**Minder geschikt voor**: Range (geen aanhoudende beweging), Chaos-ruis (te onvoorspelbaar)

---

## Familie 3: MeanReversion

**Kernidee**: anticiperen op terugkeer naar een evenwichtsniveau na een tijdelijke uitschieter.

**Twee varianten**:

*Snelle terugkeer (Snapback)*: activeer bij een korte, scherpe uitschieter in markten die typisch terugkeren. De richting van de trade is tegengesteld aan de uitschieter.

*Geleidelijke terugkeer (Grind)*: activeer in stabiele range-omstandigheden waarbij de terugkeer geleidelijker verloopt. Vereist hogere spread-stabiliteit.

**Gunstige regimes**: Range (primair), Hoge volatiliteit (Snapback bij ondiepte uitschieter)

**Minder geschikt voor**: Trend (tegengesteld aan de trend), Chaos-directioneel (risico op doorzettende beweging)

---

## Familie 4: Maker

**Kernidee**: liquiditeit verschaffen aan de markt via passieve limietorders, en de spread als marge incasseren.

**Twee varianten**:

*Maker stap vooruit (MakerStepAhead)*: plaatst een limietorder op een specifieke positie in de wachtrij, vooruitlopend op verwachte orderstromen. Vereist geauthenticeerde L3-orderboekdata voor wachtrijzichtbaarheid.

*Passieve maker (MakerPassiveQueue)*: plaatst een standaard passieve limietorder op de beste koers. Minder selectief dan stap-vooruit, bredere toepasbaarheid.

**Gunstige regimes**: Range, Lage volatiliteit, Lage liquiditeit (Passieve variant)

**Minder geschikt voor**: Sterke trends (het boek beweegt weg van de limietorder), Chaos (te onvoorspelbaar voor maker-uitvoering)

**Bijzonderheden**: Maker-strategieën genereren een maker-exit bij take-profit, wat ook voor de uitstap een lagere fee heeft. Ze zijn echter gevoeliger voor adverse selection.

---

## Familie 5: Volatility

**Kernidee**: profiteren van versnelde, richtingsgevoelige bewegingen in hoog-volatiele regimes.

**Één variant**: *Volatiliteitspieksurge (VolatilitySurge)*: activeer in hoog-volatiele of chaosregimes waarbij de beweging duidelijk versnelt en een richting heeft. Dit is een agressievere strategie die uitsluitend in de twee meest extreme regimes actief is.

**Gunstige regimes**: Hoge volatiliteit, Chaos-directioneel

**Minder geschikt voor**: Alle andere regimes

---

## Familie 6: Liquidity

**Kernidee**: opereren in specifieke laag-liquiditeitsomstandigheden waarbij de handelsdichtheid en het handelsprofiel een herkenbaar patroon vertonen.

**Één variant**: *Liquiditeitsvacuüm (LiquidityVacuum)*: activeer uitsluitend in het laag-liquiditeitsregime waarbij de handelsdichtheid binnen een specifiek bereik valt. Combineert beperkte activiteit met kenmerkende koersdynamiek.

**Gunstige regimes**: Uitsluitend Laag-liquiditeit

**Minder geschikt voor**: Alle andere regimes (de activatieconditie sluit ze uit)

---

## Geen kans (NoOpportunity)

Geen van de elf varianten voldoet. Het systeem neemt geen positie in en logt expliciet waarom elke variant is afgewezen.

Dit is een valide uitkomst — geen foutconditie. Het systeem wacht op betere omstandigheden voor het volgende handelspaar of het volgende evaluatiemoment.

---

## Relatie tussen families en uitvoering

De strategie-familie bepaalt niet alleen *welke positie* wordt ingenomen, maar ook *hoe* die wordt uitgevoerd:

- Breakout- en Momentum-families: doorgaans taker-uitvoering (snelheid prioriteit)
- Maker-families: altijd maker-uitvoering (limietorders)
- MeanReversion: mix afhankelijk van urgentie
- Volatility: taker-uitvoering (versnelling vereist snelle entry)
- Liquidity: afhankelijk van marktsituatie

En ook *hoe de positie wordt beschermd*: elke familie heeft bijbehorende exit-beleidstypen die passen bij de verwachte prijsdynamiek.

---

*Terug naar: [Index](./DOC_INDEX.md)*

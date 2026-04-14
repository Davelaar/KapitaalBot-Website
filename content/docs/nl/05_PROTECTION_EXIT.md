# KapitaalBot — Protection & Exit

**[← 04 — Execution](./04_EXECUTION_ORDERS.md) · [06 — Risk & Safety →](./06_RISK_SAFETY.md)**

---

## Wat dit document beschrijft

Hoe KapitaalBot open posities beschermt en sluit. Bescherming is geen nagedachte maar een integraal onderdeel van elke handelsbeslissing: het exit-beleid wordt vastgesteld op het moment van de entry, niet achteraf.

---

## Het principe: bescherming is niet optioneel

Een open positie zonder bescherming is architecturaal verboden. Het systeem kent een expliciete garantie: elke open positie heeft altijd een actieve beschermende stop op de exchange. Als die bescherming om enige reden ontbreekt, wordt ze onmiddellijk hersteld.

Dit is geen beleidsregel maar een harde systeemeigenschap: de toestandsmachine voor open posities heeft geen toestand die "open zonder bescherming" toestaat.

---

## Beschermingslagenlagen

### Initiële stop
Geplaatst direct na een succesvolle entry-fill. Beschermt tegen directe tegenbeweging. De afstand van de stop is strategie-afhankelijk en is onderdeel van het uitvoeringsmandaat.

### Breakeven-trigger
Zodra een positie voldoende winst heeft opgebouwd, wordt de stop verplaatst naar de entry-prijs. Vanaf dat moment is het maximale verlies op deze positie nul (exclusief fees en slippage).

### Trailing stop
De primaire methode om winst te vergrendelen bij gunstige bewegingen. De stop "reist mee" met de prijs in de gunstige richting, maar beweegt niet terug bij ongunstige bewegingen.

De breedte van de trailing stop is afgestemd op de marktomstandigheden op het moment van de entry. Een volatiel instrument heeft een bredere trail nodig om "noise" te absorberen; een stabiel instrument kan een krappe trail gebruiken.

### Winstdoel
Bij bepaalde exit-beleidstypen wordt een vast winstdoel gehanteerd. Wanneer de prijs dit doel bereikt, wordt de positie actief gesloten. Dit kan via een limietorder (maker-exit) of direct via een marktorder.

### Tijdslimiet
Elke positie heeft een maximale looptijd. Als een positie na afloop van die tijd nog open staat, wordt ze automatisch gesloten. Dit voorkomt dat posities "vergeten" worden in het systeem.

### Paniekultstap
Als het verlies op een positie een kritieke drempel bereikt die hoger ligt dan de initiële stop, wordt een nooduitstap geactiveerd. Dit is een achtervangsysteem voor situaties waarbij de normale stop is overgeslagen (bijv. door extreme marktbewegingen).

---

## Exit-scenario's

Het systeem kent meerdere padtypen voor het sluiten van posities:

**Gepland pad**
De positie wordt gesloten via het vooraf ingestelde exit-beleid: de trailing stop of het winstdoel is bereikt, of de tijdslimiet is verstreken.

**Veiligheidspad**
Een externe veiligheidsregel triggert uitstap: het maximale verlies is bereikt, of het systeem detecteert dat de marktomstandigheden sterk zijn veranderd ten opzichte van de entry.

**Herstelpad**
Een technisch probleem heeft de positie achtergelaten zonder bijbehorende bescherming. Het systeem detecteert dit bij opstart of periodieke controle en herstelt de bescherming onmiddellijk.

---

## Orphan-detectie

Bij opstart controleert het systeem of er posities op de exchange zijn zonder bijbehorende bescherming in de database. Zulke "orphan"-posities worden onmiddellijk beschermd: de bot plaatst direct een beschermende stop zonder te wachten op een nieuwe signaalcyclus.

Dit scenario kan optreden na een crash of connectiefout. Het systeem is ontworpen om hier robuust mee om te gaan.

---

## Dust-herstel

Een positie kan technisch onsluitbaar worden als de grootte net onder de minimale ordergrootte van de exchange valt — een situatie die ontstaat door gedeeltelijke fills of afrondingsverschillen. In dat geval kan het systeem een minimale aanvulling uitvoeren om de positie sluitbaar te maken.

Dit is uitsluitend een technisch herstelpad. Het is geen positiegemiddelde of bijkopen als verdedigingsstrategie.

---

## Waarom dit ontwerp?

**Bescherming is pre-committed**: het exit-beleid is vastgelegd op het moment van de entry. Dit elimineert situaties waarbij een verliesgevende positie wordt aangehouden omdat "de markt wel terugkeert".

**Gelaagde bescherming**: meerdere onafhankelijke mechanismen (stop, trailing, paniekultstap, tijdslimiet) waarborgen dat er altijd een uitweg is, ook als één mechanisme faalt.

**Exchange-side stops**: de primaire bescherming staat op de exchange, niet alleen in de bot. Als de bot onbereikbaar wordt, is er nog steeds bescherming actief.

---

*Volgende: [06 — Risk & Safety](./06_RISK_SAFETY.md)*

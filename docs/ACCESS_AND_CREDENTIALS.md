# Toegang en inloggen (Tier 2 / Tier 3)

**Doel:** Uitleg wat "Access" en "Log in" doen en welke credentials nodig zijn. Er zijn **geen standaard inloggegevens**; alles gaat via environment variables op de server.

---

## Wat zie je op de site?

| In de navigatie | Betekenis |
|-----------------|-----------|
| **Access** (Toegang) | Link naar het **aanvraagformulier** voor Tier 2. Vul e-mail en reden in; aanvragen worden opgeslagen. Toegang wordt handmatig toegekend; daarna krijg je een **toegangscode** (zie hieronder). |
| **Log in** | Link naar de **inlogpagina**. Hier voer je de toegangscode in die je hebt gekregen. Bij geldige code krijg je een sessie (cookie) voor Tier 2 of Tier 3. |

- **Tier 1:** Iedereen ziet het dashboard (status, metrics, regime, market). Data is vertraagd/geaggregeerd.
- **Tier 2:** Na inloggen met een Tier 2-code: toegang tot /dashboard/tier2 en /dashboard/tier2/docs.
- **Tier 3 (admin):** Na inloggen met een Tier 3-code: toegang tot /admin (full observability, raw JSON).

---

## Credentials: geen defaults

Er bestaan **geen** vaste gebruikersnaam/wachtwoord-combinaties. Toegang verloopt via **geheime codes** die je zelf kiest en in de environment van de **website-server** zet.

### Op de server (kapitaalbot-web)

In de environment van de Next.js-app (bijv. `.env` of systemd `Environment=`):

| Variabele | Verplicht | Beschrijving |
|-----------|-----------|--------------|
| **TIER_COOKIE_SECRET** | Ja (voor login) | Geheim van min. 16 tekens. Wordt gebruikt om de sessie-cookie te ondertekenen. Zonder deze wordt inloggen geweigerd ("Server misconfiguration"). |
| **TIER2_SECRET** | Optioneel | De **toegangscode voor Tier 2**. Iedereen die deze code kent en op /login invoert, krijgt Tier 2-sessie. Je kiest zelf een sterk geheim (bijv. lange random string). |
| **TIER3_SECRET** | Optioneel | De **toegangscode voor Tier 3 (admin)**. Alleen voor beheerders. Andere code dan TIER2_SECRET. |

**Voorbeeld (geen echte geheimen gebruiken):**

```bash
TIER_COOKIE_SECRET=een-lange-random-string-minimaal-16-tekens
TIER2_SECRET=een-andere-geheime-code-voor-tier2
TIER3_SECRET=weer-een-andere-voor-admin
```

- Als **TIER2_SECRET** niet is gezet: niemand kan Tier 2-sessie krijgen (code wordt "Invalid code").
- Als **TIER3_SECRET** niet is gezet: niemand kan Tier 3-sessie krijgen.
- De **gebruiker** krijgt de code niet via de site; jij deelt die buiten de site (bijv. na goedkeuring van een Tier 2-aanvraag).

---

## Flow in het kort

1. Bezoeker gaat naar **Access** → vult aanvraag in → aanvraag wordt opgeslagen (data/tier2_requests.json of backend).
2. Jij kijkt aanvragen na en besluit toegang te geven. Je deelt **buiten de website** de TIER2_SECRET (of een eigen "gebruikerscode" die je in TIER2_SECRET zet) met die persoon.
3. Die persoon gaat naar **Log in** → voert de code in → krijgt Tier 2-sessie (cookie, 7 dagen) → kan /dashboard/tier2 en tier2/docs zien.
4. Voor admin: alleen jij (of vertrouwde personen) kennen TIER3_SECRET; die voeren die in op /login → Tier 3-sessie → toegang tot /admin.

---

## Tier 3 (admin) eenmalig aanmaken

Om zelf als Tier 3 in te loggen en /admin te zien:

1. **Op de server** (waar kapitaalbot-web draait), in de website-repo:
   ```bash
   cd /srv/KapitaalBot-Website
   chmod +x scripts/generate-tier-secrets.sh
   ./scripts/generate-tier-secrets.sh
   ```
   De scriptoutput toont drie regels (TIER_COOKIE_SECRET, TIER2_SECRET, TIER3_SECRET). **Kopieer die volledige output.**

2. **Toevoegen aan de environment** van de website:
   - Als je een `.env` gebruikt: plak de drie regels in `/srv/KapitaalBot-Website/.env`.
   - Als de app via systemd draait: voeg de regels toe aan de `Environment=` of `EnvironmentFile=` van `kapitaalbot-web.service`, daarna `systemctl daemon-reload`.

3. **Service herstarten:**
   ```bash
   systemctl restart kapitaalbot-web.service
   ```

4. **Inloggen:** Ga naar **https://snapdiscounts.nl/login** (of je domein), voer de **TIER3_SECRET**-waarde in (de lange hex-string uit de scriptoutput). Je krijgt dan Tier 3-sessie en kunt **/admin** openen.

**Let op:** Bewaar de TIER3_SECRET ergens veilig (bijv. password manager); zonder die waarde kun je niet opnieuw inloggen tenzij je een nieuwe genereert en op de server zet.

---

## Beveiliging

- Cookie is **HttpOnly**, **Secure** in productie, **SameSite=Lax**.
- Rate limit op de login-API (max 5 pogingen per IP per minuut).
- Geen gebruikersnamen; alleen een gedeeld geheim per tier. Voor zwaardere auth (bijv. per-gebruiker accounts) zou een latere uitbreiding nodig zijn.

---

## Waar staat wat in de code?

- **Login-API:** `app/api/auth/session/route.ts` (POST = inloggen, DELETE = uitloggen).
- **Auth-check:** `lib/auth.ts` (getSessionTier, cookie-verificatie).
- **Pagina’s achter login:** `/dashboard/tier2`, `/dashboard/tier2/docs`, `/admin` controleren sessie en tonen anders een gate met link naar Access en Log in.

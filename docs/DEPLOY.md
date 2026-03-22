# Deploy & validatie (snapdiscounts.nl → kapitaalbot.nl)

- **Staging:** snapdiscounts.nl. Huidige redirect verwijderen; nieuwe site als default. VPS/container of edge SSR; CDN voor static assets.
- **Validatie op staging:** Multi-regime/strategy zichtbaar, tier model, snapshots correct, FAQ-bot (later), dark/light, analytics (later), Pushover (later), mobile UX, performance, viertaligheid, compliance-banner aanwezig.
- **Migratie:** Na validatie DNS/deploy switch naar kapitaalbot.nl. Zero downtime (DNS flip). kapitaalbot.nl bestaande productie tot dan intact.

## Next.js build: lockfile / SWC-waarschuwing

Bij `next build` kan Next 14.2.x proberen `package-lock.json` automatisch te “patchen” voor `@next/swc-*` (optionele platform-binaries). Als de lockfile op één machine is gegenereerd, ontbreken vaak andere platform-packages; de patch-logica kan dan **falen** (bekende upstream edge case: Next gebruikt de verkeerde versiesleutel voor `@next/swc-*` vs. `next`).

**Oplossing in deze repo:** het npm-script `build` zet `NEXT_IGNORE_INCORRECT_LOCKFILE=1` (ondersteund door Next.js). Daarmee wordt die patch overgeslagen en verdwijnen de foutmeldingen; de geïnstalleerde SWC-binary hoort bij je platform (`npm install` op de build-server).

Zie o.a. `process.env.NEXT_IGNORE_INCORRECT_LOCKFILE` in de Next-bron (`patch-incorrect-lockfile`).

## Server-setup (conceptueel)

1. Bot op server: `OBSERVABILITY_EXPORT_DIR=/srv/krakenbot/observability_export`; cron of systemd timer voor `krakenbot export-observability-snapshots` (bijv. elke 60s).
2. Website: build `npm run build`; serve `npm start` of PM2/Node; of Docker. Stel `OBSERVABILITY_EXPORT_DIR` gelijk aan dezelfde directory (of NFS/share) zodat de BFF dezelfde bestanden leest.
3. snapdiscounts.nl: verwijder redirect; wijs virtual host naar de nieuwe app.

# Deploy & validatie (snapdiscounts.nl → kapitaalbot.nl)

- **Staging:** snapdiscounts.nl. Huidige redirect verwijderen; nieuwe site als default. VPS/container of edge SSR; CDN voor static assets.
- **Validatie op staging:** Multi-regime/strategy zichtbaar, tier model, snapshots correct, FAQ-bot (later), dark/light, analytics (later), Pushover (later), mobile UX, performance, viertaligheid, compliance-banner aanwezig.
- **Migratie:** Na validatie DNS/deploy switch naar kapitaalbot.nl. Zero downtime (DNS flip). kapitaalbot.nl bestaande productie tot dan intact.

## Server-setup (conceptueel)

1. Bot op server: `OBSERVABILITY_EXPORT_DIR=/srv/krakenbot/observability_export`; cron of systemd timer voor `krakenbot export-observability-snapshots` (bijv. elke 60s).
2. Website: build `npm run build`; serve `npm start` of PM2/Node; of Docker. Stel `OBSERVABILITY_EXPORT_DIR` gelijk aan dezelfde directory (of NFS/share) zodat de BFF dezelfde bestanden leest.
3. snapdiscounts.nl: verwijder redirect; wijs virtual host naar de nieuwe app.

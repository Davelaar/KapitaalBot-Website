# Lite-bot isolatie — rollback en herstel (KapitaalBot / krakenbot)

Uitgevoerd in het kader van de **Krakenbot Lite** bouwopdracht: oude **execution** wordt uitgezet zodat er geen dubbele live trading optreedt.

## Wat is uitgezet (prod, host `snapdiscounts.nl`)

- `krakenbot-execution.service`: **gestopt** en **disabled** (systemd).
- `krakenbot-execution-only.service`: **gestopt** en **disabled**.
- `/srv/krakenbot/.env`: `EXECUTION_ENABLE=false` gezet na **backup** van `.env` naar  
  `/srv/krakenbot/.env.bak_LITE_ISOLATION_<timestamp>`.

## Wat blijft draaien

- `krakenbot-ingest.service`: **actief** (public market data, geen order placement).

## Operationeel risico na isolatie

- **Stale DB-rij:** op moment van isolatie bestond minstens één `execution_orders`-rij met status `acked_open` (BEAM/USD). Dat is **geen bewijs** dat er nog een open order op de exchange staat; wel een signaal om handmatig in Kraken UI of via API te verifiëren en eventueel te cancelen.
- **Dominante risico:** vergeten `krakenbot-lite` te stoppen vóór rollback van execution → dubbele trading. Rollback-stappen hieronder expliciet volgen.

## Rollback naar oude execution (oude bot)

1. Stop en disable de lite-service (als die al draait):  
   `systemctl stop krakenbot-lite.service && systemctl disable krakenbot-lite.service`
2. Herstel `.env` (of zet handmatig):  
   `EXECUTION_ENABLE=true`  
   Gebruik eventueel de backup:  
   `cp /srv/krakenbot/.env.bak_LITE_ISOLATION_* /srv/krakenbot/.env` (juiste timestamp kiezen).
3. Enable en start execution:  
   `systemctl enable krakenbot-execution.service`  
   `systemctl start krakenbot-execution.service`  
   (of `krakenbot-execution-only.service` als je split-mode gebruikte — zie unit comments op de server.)
4. Verifieer:  
   `systemctl status krakenbot-execution.service`  
   journal: `journalctl -u krakenbot-execution -n 80 --no-pager`
5. **DB / exchange:** na rollback geen automatische garantie dat decision-DB open-order state matcht Kraken SSOT (`executions`). Bij twijfel: reconcile volgens je standaard runbook.

## Verwijzingen

- systemd unit-voorbeelden in deze repo (niet automatisch synced naar `/etc`): `systemd/krakenbot-execution.service` — op server actueel via checkout onder `/srv/krakenbot`.
- Agent DB-routing: [AGENTS.md](../AGENTS.md), `.cursor/rules/db-diagnosis-routing.mdc`.

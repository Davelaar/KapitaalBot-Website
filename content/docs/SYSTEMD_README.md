# Systemd — Krakenbot services

**Rol van dit document:** Actuele systemd-units voor persistent ingest en execution attach. Operationeel. SSOT: [docs/ENGINE_SSOT.md](docs/ENGINE_SSOT.md). Runbook: [docs/LIVE_RUNBOOK_CURRENT.md](docs/LIVE_RUNBOOK_CURRENT.md).

---

## Units

| Unit | Commando | Doel |
|------|----------|------|
| **krakenbot-ingest.service** | `krakenbot run-ingest` | Persistent ingest: public WS (ticker/trade/L2/L3), universe refresh, epoch/snapshot publish. Geen execution. |
| **krakenbot-execution.service** | `krakenbot run-execution-live` met `EXECUTION_ONLY=1` | Execution attach: leest epochs/snapshots uit DB; geen eigen ingest. |

---

## Dependencies

- **Execution** draait na **ingest**: `After=krakenbot-ingest.service`, `Wants=network-online.target`.
- Ingest moet eerst draaien zodat epochs/snapshots beschikbaar zijn voor execution-only mode.

---

## Installatie

```bash
sudo cp systemd/krakenbot-ingest.service /etc/systemd/system/
sudo cp systemd/krakenbot-execution.service /etc/systemd/system/
sudo systemctl daemon-reload
```

---

## Env

- Beide units: `EnvironmentFile=/srv/krakenbot/.env` (of aangepast pad). Vereist o.a. `DATABASE_URL`, `KRAKEN_WS_PUBLIC_URL`.
- Execution: in unit staat `EXECUTION_ONLY=1` en `EXECUTION_ENABLE=true`; voor API: `KRAKEN_API_KEY`, `KRAKEN_API_SECRET` in .env.

---

## Start / stop / restart

```bash
# Ingest (eerst)
sudo systemctl start krakenbot-ingest
sudo systemctl status krakenbot-ingest

# Execution (attach)
sudo systemctl start krakenbot-execution
sudo systemctl status krakenbot-execution

# Restart
sudo systemctl restart krakenbot-ingest
sudo systemctl restart krakenbot-execution

# Stop
sudo systemctl stop krakenbot-execution
sudo systemctl stop krakenbot-ingest
```

---

## Restart policy

- Beide: `Restart=on-failure`, `RestartSec=30` (ingest) of `60` (execution).
- Geen autorecovery-markers in unit; voor log-markers zie docs/LOGGING.md.

---

## Logs

```bash
journalctl -u krakenbot-ingest -f
journalctl -u krakenbot-execution -f
```

SyslogIdentifier: `krakenbot-ingest`, `krakenbot-execution`.

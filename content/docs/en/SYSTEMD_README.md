# Systemd — Krakenbot services

**Rol van dit document:** Actuele systemd-units voor persistent ingest en execution attach. Operationeel. Overzicht: [docs/01_ARCHITECTURE.md](../docs/01_ARCHITECTURE.md). Operations/runbook: [docs/08_OPERATIONS.md](../docs/08_OPERATIONS.md). Publieke status/observability: [kapitaalbot.nl/nl/dashboard](https://kapitaalbot.nl/nl/dashboard) (website, geen runtime-substituut voor logs/DB-proof).

---

## Units

| Unit | Commando | Doel |
|------|----------|------|
| **krakenbot-ingest.service** | `krakenbot run-ingest` | Persistent ingest: public WS (ticker/trade/L2/L3), universe refresh, epoch/snapshot publish. Geen execution. |
| **krakenbot-execution.service** | `krakenbot run-execution-live` (`EXECUTION_ONLY=0` in unit) | Live execution: private WS, heap/poller, orders. Vereist draaiende ingest. |

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

- Beide units laden **`EnvironmentFile=-/srv/krakenbot/.env`** (optioneel `-`). Extra keys: systemd **drop-in** onder `*.service.d/*.conf` of tweede `EnvironmentFile=` indien nodig.

### Loop A (continuous edge refresh) — optionele drop-in

Standaard staat **`CONTINUOUS_EDGE_REFRESH_ENABLE`** uit (`false` in config). Zet in **`.env`** of via drop-in (reproduceerbaar in Git):

- **Voorbeeldbestand:** [`drop-in-examples/krakenbot-execution-continuous-edge-refresh.conf`](drop-in-examples/krakenbot-execution-continuous-edge-refresh.conf) — kopieer naar  
  `/etc/systemd/system/krakenbot-execution.service.d/continuous-edge-refresh.conf`, daarna `daemon-reload` + `restart`.

**Wat je wél ziet:** journal-regels `LOOP_A_EDGE_REFRESHER_STARTED`, `FLOW_HEAP_REFRESH_EVENT trigger=loop_a_material_mid` — dat is **heap/ranking**, geen orders.

**Wat je niet automatisch ziet:** extra trades. Orders gaan via `flow_poller` → `flow_execute_single_candidate` (gates: MSP, safety, allocator, realism, enz.). Loop A verandert alleen hoe snel kandidaten op de heap worden bijgewerkt.
- **Dual-DB verplicht:** `INGEST_DATABASE_URL` (ingest) én `DECISION_DATABASE_URL` (decision), of equivalente `INGEST_DB_*` + `DECISION_DB_*` zoals in [scripts/trading_env.sh](../scripts/trading_env.sh). Zonder tweede target start de binary niet.
- Ingest: ook `KRAKEN_WS_PUBLIC_URL` (default mag in .env).
- Execution: unit zet `EXECUTION_ONLY=1` en `EXECUTION_ENABLE=true`; API: `KRAKEN_API_KEY`, `KRAKEN_API_SECRET` in env.
- Vóór eerste start: `./scripts/validate_execution_readiness.sh` — zie [docs/SERVER_RUNTIME_ENV_AND_READINESS.md](../docs/SERVER_RUNTIME_ENV_AND_READINESS.md).

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

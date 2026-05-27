# Krakenbot-lite — singleton live orchestrator (run discipline)

Operational rule: treat runtime truth as **`systemctl` + `journalctl` + process namespace checks**, never as Cursor/SSH exit codes.

## Authoritative runner (preferred)

Use **`krakenbot-lite.service`** on the execution host (`/etc/systemd/system/krakenbot-lite.service`).

- **Canonical command**: `/srv/krakenbot-lite/target/release/krakenbot-lite orchestrate --live`
- **Logs**: `journalctl -u krakenbot-lite -f`
- **Singleton check**:

```bash
pgrep -af 'krakenbot-lite orchestrate --live'
# Expect exactly ONE line (+ your pgrep grep itself if you widen the pattern)
```

## Forbidden / high-risk patterns

- **`nohup ... orchestrate --live &` via SSH** while `krakenbot-lite.service` remains **active (running)** unless you first intentionally stop/disable the unit. This risks **two authenticated trading loops** concurrently.
- Interpreting a **Broken pipe / SSH disconnect** as “lite failed” unless corroborated by **journal**, **heartbeat absence**, or **explicit process exit**.

## Measurement / vol-econ SSH runs (temporary)

If you must run bounded experiments outside systemd:

1. **`systemctl stop krakenbot-lite`** (or `disable`, if policy requires) — make overlap impossible by construction.
2. Prefer **`tmux`/`screen`** on the server (detach-safe) plus a deterministic log path (not only stdout over SSH).

## Truth sources hierarchy

1. **`systemctl status krakenbot-lite`** (Main PID / Active since).
2. **`journalctl -u krakenbot-lite`** (restart boundaries, abrupt stops).
3. Optional ad-hoc file logs (**only when you control the redirection** explicitly).

Persisted lite telemetry (DECISION):

- **`DECISION_DATABASE_URL`** → **`krakenbot_decision`** / schema **`lite.bot_events`** (not ingest).

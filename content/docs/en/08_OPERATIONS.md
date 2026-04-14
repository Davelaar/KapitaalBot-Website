# KapitaalBot — Operations

**[← 07 — Observability](./07_OBSERVABILITY.md) · [09 — Strategies →](./09_STRATEGIES.md)**

---

## What this document covers

How KapitaalBot runs as a production system: the deployment approach, service architecture, and principles for operational management. This document describes the structure — not configuration values or SSH access details.

---

## Deployment principle: Git-only

KapitaalBot enforces a strict Git-only code flow. This means:

- All changes are committed and pushed to the repository
- The production server always fetches code via `git pull`
- Direct modifications on the server outside Git are forbidden
- Every runtime execution is traceable to a specific commit hash

**Why this principle?**
A production system that trades with real capital must never be in a state where it is unclear what code is running. Git traceability is the hard requirement for any forensic investigation.

---

## Two core services

KapitaalBot runs as two independent long-running services, managed via systemd:

**Ingest service**
Responsible for continuous data collection. Connects to public and authenticated WebSocket feeds. Writes to the ingest database. Can restart without interrupting the execution service.

**Execution service**
Responsible for strategy evaluation and trading. Reads state data from the ingest database. Writes decisions and outcomes to the decision database. Starts with a full reconciliation of exchange status.

The decoupling between these services is a deliberate architectural choice: a problem in one service does not immediately cascade to the other.

---

## Startup sequence and reconciliation

When the execution service starts:

1. Database connections are verified
2. API authentication is tested
3. All balances and open orders are synchronised with the exchange
4. Safety status per trading pair is restored
5. Only then does the first evaluation cycle begin

Step 3 (reconciliation) is not skipped on restart. The system never assumes its internal state is still accurate after an interruption.

---

## Deployment steps

The standard process for an update:

```
1. Change made and tested in local repository
2. Commit created with clear description
3. Push to central repository
4. On production server: git pull (fetch the new commit)
5. Build: compile the new version
6. Restart the relevant service(s)
7. Verify: check logs for successful startup and reconciliation
8. Record: which commit hash is now running on the production server?
```

Step 8 is not optional. The operator must always know which commit hash the live binary corresponds to.

---

## Validation scripts

The system includes scripts for operational validation:

**Database target verification**: verifies that a query is running against the correct database pool (ingest or decision). Required for any manual database investigation.

**Live engine validation**: verifies that the binary is correctly built, databases are reachable, and API keys are working.

**Safety report**: provides an overview of WebSocket health, safety status per trading pair, and recent anomalies.

---

## Incident response

On an unexpected incident (unexplained loss, exchange errors, system crash):

**Step 1 — Emergency stop**
Stop the execution service. The dead man's switch on the exchange will cancel all open orders within the configured time window.

**Step 2 — Diagnosis**
- Check logs for ERROR and WARN messages
- Check open positions on the exchange
- Run the safety report script

**Step 3 — Recovery**
- Fix the problem in the local repository
- Commit the fix
- Deploy to the production server
- Restart the service and closely monitor the reconciliation phase

**No exceptions to Git-only**: even emergency fixes go through the repository. A direct modification on the server is an operational risk and is forbidden.

---

## Monitoring and alerting

The system sends proactive notifications on:

- critical errors requiring action
- detection of inconsistency between the ingest and decision databases
- safety status changes on trading pairs
- systems not receiving updates for longer than expected

Alerting runs via a configured notification channel (outside the scope of this public documentation).

---

*Next: [09 — Strategies](./09_STRATEGIES.md)*

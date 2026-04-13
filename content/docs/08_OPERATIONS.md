# 08_OPERATIONS.md - Deployment and Operations

This document provides practical information for deploying, managing, and troubleshooting
the Krakenbot trading engine in a production environment.

## Systemd Services

Krakenbot is managed as a set of `systemd` services on the server, ensuring reliable operation and automatic restarts.

-   `krakenbot-ingest.service`: Manages the market data ingestion process.
-   `krakenbot-execution.service`: Manages the core trading and execution logic.
-   `krakenbot-research.service`: (Optional) Manages research and observability data processing.

Common commands:
- `systemctl start <service>`: Start a service.
- `systemctl stop <service>`: Stop a service.
- `systemctl restart <service>`: Restart a service.
- `systemctl status <service>`: Check the current status of a service.
- `journalctl -u <service> -f`: Monitor live logs for a service.

## Deployment (`deploy.sh`)

Deployment is handled via the `scripts/deploy.sh` script, which follows a **Git-only codeflow**.

1.  **Local Commit**: All changes must be committed and pushed to the Git repository.
2.  **Server Pull**: The `deploy.sh` script (or manual command) performs a `git pull` on the server (`/srv/krakenbot`).
3.  **Build**: The bot is built from the fresh Git state using `cargo build --release`.
4.  **Restart**: The relevant `systemd` services are restarted to apply the changes.

This process ensures that the code running on the server is always traceable to a specific Git commit.

## Server Validation Scripts

Several scripts are available to validate the system state after deployment or restart:

-   `scripts/validate_live_engine_server.sh`: Performs a comprehensive check of the live engine's health and connectivity.
-   `scripts/check_execution_runtime_truth.sh`: Verifies the consistency of the execution runtime state.
-   `scripts/db_target_precheck.sh`: Mandatory script to verify database connectivity and identity before performing any DB-related tasks.

## Environment Configuration (`.env`)

The bot's behavior is configured via environment variables, typically stored in a `.env` file in the repository root. Key variables include:

-   `INGEST_DATABASE_URL`, `DECISION_DATABASE_URL`, `RESEARCH_DATABASE_URL`: Database connection strings.
-   `KRAKEN_API_KEY`, `KRAKEN_API_SECRET`: Exchange credentials.
-   `EXECUTION_ENABLE`: Global flag to enable or disable live trading.
-   `LOG_LEVEL`: Controls the verbosity of logging.

## Restart Doctrine

-   **Scheduled Restarts**: Periodic restarts (e.g., daily) are recommended to clear any transient state and ensure long-term stability.
-   **Emergency Restarts**: If critical errors or inconsistencies are detected, services should be restarted immediately.
-   **Reconciliation on Startup**: The bot automatically performs exposure and position reconciliation upon startup to ensure a consistent state.

## Incident Response

In the event of an incident (e.g., unexpected losses, exchange downtime, software crashes):

1.  **Halt Trading**: Use `EXECUTION_ENABLE=false` or stop the `krakenbot-execution` service.
2.  **Assess State**: Use the validation scripts and logs to understand the current situation.
3.  **Manual Intervention**: If necessary, manually manage positions or orders on the exchange.
4.  **Root Cause Analysis**: Identify the cause of the incident and implement necessary fixes.
5.  **Recovery**: Once the issue is resolved and validated, resume trading in a controlled manner.

This operational framework ensures that Krakenbot can be managed effectively and safely in a dynamic production environment.
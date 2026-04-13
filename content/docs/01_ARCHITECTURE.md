# 01 — Systeemarchitectuur

[← 00 — Module-inventaris](./00_MODULE_INVENTORY.md) | **01 — Architectuur** | [02 — Data-ingest](./02_DATA_INGEST.md) →

---

Dit document beschrijft de architectuur van de Krakenbot trading engine: componenten, datastromen, database-topologie en procesmodellen.

## Navigatiemenu

- [Systeemoverzicht](#systeemoverzicht)
- [Runtime Topologie](#runtime-topologie)
- [Datastromen (Live Pad)](#datastromen-live-pad)
- [Strategy Pipeline Flow](#strategy-pipeline-flow)
- [Execution Lifecycle](#execution-lifecycle)
- [Database Topologie (SSOT)](#database-topologie-ssot)
- [Procesmodel & Services](#procesmodel-services)

---

<a name="systeemoverzicht"></a>
## Systeemoverzicht

De Krakenbot is opgebouwd uit modulaire lagen met strikte verantwoordelijkheden:

- **Ingest Laag**: Verwerkt publieke en private WebSocket feeds, valideert checksums (L2) en persisteert ruwe marktdata.
- **State & Projection**: Onderhoudt de in-memory en Redis-backed toestand van de markt (MSP), orderboeken en balansen.
- **Strategy Pipeline**: Analyseert regimes, berekent edge/confidence en genereert execution mandates.
- **Execution Engine**: Beheert de order lifecycle, positie-monitoring, trailing stops en risk guards.
- **Observability**: Verzamelt metrics, logt funnel-events en faciliteert forward-return analyse.

---

<a name="runtime-topologie"></a>
## Runtime Topologie

Krakenbot gebruikt een **dual-pool architectuur** om ingest-load te scheiden van execution-latency.

```mermaid
flowchart TB
  subgraph Ingest_Process [Persistent Ingest]
    direction TB
    WS_Pub["Public WS (v2)"]
    WS_L3["L3 WS (v2 Auth)"]
    Writer["Async Batch Writer"]
    
    WS_Pub --> Writer
    WS_L3 --> Writer
    Writer --> DB_Ingest[("DB INGEST (Postgres)")]
  end

  subgraph Execution_Process [Execution Engine]
    direction TB
    EvalLoop["Evaluation Loop"]
    Refresh["State Refresh (run_symbol_state)"]
    Pipeline["Strategy Pipeline"]
    Risk["Risk & Safety Guards"]
    Adapter["Kraken WS Adapter"]
    
    EvalLoop --> Refresh
    Refresh -- "Read Raw" --> DB_Ingest
    Refresh -- "Write Refreshed" --> DB_Ingest
    
    Refresh --> Pipeline
    Pipeline --> Risk
    Risk --> Adapter
  end

  subgraph Decision_Storage [Decision & Truth]
    DB_Decision[("DB DECISION (Postgres)")]
    Redis_MSP[("Redis (MSP Projection)")]
  end

  Adapter <--> WS_Priv["Private WS (v2 Auth)"]
  WS_Priv <--> DB_Decision
  Risk <--> Redis_MSP
  EvalLoop <--> DB_Decision
```

---

<a name="datastromen-live-pad"></a>
## Datastromen (Live Pad)

Het systeem is **state-first** en **route-centric**. De hot-path scant geen ruwe tabellen per tick, maar gebruikt een ververste `run_symbol_state`.

```mermaid
sequenceDiagram
    participant WS as Kraken WS
    participant Ingest as Ingest Service
    participant DBI as DB Ingest
    participant Exec as Execution Service
    participant DBD as DB Decision

    WS->>Ingest: Market Data (Ticker/L2/L3)
    Ingest->>DBI: Batch Write (Raw Samples)
    
    Note over Exec: Start Eval Cycle
    Exec->>DBI: refresh_run_symbol_state
    DBI-->>Exec: Refreshed State Rows
    
    Exec->>Exec: Run Readiness & Pipeline
    Exec->>Exec: Edge/Confidence Scoring
    
    rect rgb(200, 220, 240)
        Note over Exec: Execution Decision
        Exec->>DBD: Create Order (Pending)
        Exec->>WS: add_order (Private WS)
        WS-->>Exec: Order Ack / Fill
        Exec->>DBD: Update Order / Fill / Position
    end
```

---

<a name="strategy-pipeline-flow"></a>
## Strategy Pipeline Flow

De pipeline transformeert marktdata naar uitvoerbare plannen via een hiërarchie van filters en scorers.

```mermaid
graph TD
    A["Market Features (Spread, Vol, Drift, OFI)"] --> B["Regime Detection (Trend/Range/Chaos)"]
    B --> C["Strategy Selection (Liquidity/Momentum/Expansion)"]
    C --> D["Readiness Gate (Blocker Audit)"]
    D --> E["Route Engine (V1/V2 Adaptive)"]
    E --> F["Edge & Confidence Scoring"]
    F --> G["Ranking & Selection"]
    G --> H["Risk Gate (Capital/Exposure/Safety)"]
    H --> I["Execution Mandate (Intent)"]
```

---

<a name="execution-lifecycle"></a>
## Execution Lifecycle

Orders doorlopen een strikte state-machine om consistentie tussen de database en de exchange te garanderen.

```mermaid
stateDiagram-v2
    [*] --> Submitted: Pipeline Execute
    Submitted --> PendingAck: add_order sent
    PendingAck --> Open: Order Ack (New)
    Open --> PartiallyFilled: Partial Fill
    PartiallyFilled --> Filled: Full Fill
    Open --> Filled: Full Fill
    
    Open --> Cancelled: User/Bot Cancel
    PendingAck --> Rejected: Exchange Reject
    
    Filled --> [*]
    Cancelled --> [*]
    Rejected --> [*]

    Note right of Submitted: DB-first — order row in DB before Kraken submit.
```

---

<a name="database-topologie-ssot"></a>
## Database Topologie (SSOT)

Het systeem onderscheidt drie logische rollen voor data-opslag:

| Pool | Omgevingsvariabele | Primaire Inhoud (SSOT) |
| :--- | :--- | :--- |
| **INGEST** | `INGEST_DATABASE_URL` | Ruwe marktdata, L2/L3 metrics, `run_symbol_state` (refreshed). |
| **DECISION** | `DECISION_DATABASE_URL` | Orders, Fills, Posities, Safety State, Watchdog logs. |
| **RESEARCH** | `RESEARCH_DATABASE_URL` | Forward-return observations, Microstructure snapshots. |

> **Harde Regel**: Geen cross-pool joins in de applicatie. Gebruik `db_target_precheck.sh` voor diagnose.

---

<a name="procesmodel-services"></a>
## Procesmodel & Services

Krakenbot draait als een set van **systemd** services op de productie-server (`/srv/krakenbot`):

1. **`krakenbot-ingest.service`**:
   - Taak: Continue dataverzameling.
   - Mode: `run-ingest`.
   - Schrijft naar: INGEST pool.

2. **`krakenbot-execution.service`**:
   - Taak: Strategie-evaluatie en trading.
   - Mode: `run-execution-live`.
   - Schrijft naar: DECISION pool.

3. **Maintenance**:
   - `retention`: Periodieke opschoning van oude samples.
   - `watchdog`: Bewaakt consistentie en herstelt stale states.

---

[← 00 — Module-inventaris](./00_MODULE_INVENTORY.md) | **01 — Architectuur** | [02 — Data-ingest](./02_DATA_INGEST.md) →

---

*Document gegenereerd voor technische documentatie. Laatst bijgewerkt: 2026-04-13.*

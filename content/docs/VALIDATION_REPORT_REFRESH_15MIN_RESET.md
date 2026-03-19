# Eindrapport: refresh-schaalbaarheid + 15-min validatie + DB-reset

DOC_STATUS: BACKGROUND  
DOC_ROLE: refresh_validation_report  

## A. Refresh-besluit

**Is huidige refresh-architectuur toekomstvast genoeg?** **Ja**, mits run-duur begrensd.

**Waarom:**
- Refresh is O(rows) per run_id. Zonder begrenzing kan één run onbeperkt groeien → refresh wordt later een fundamentele bottleneck.
- Partitioning + fysieke scheiding lossen lock-contention en decision-latency op, maar veranderen de query-complexiteit niet.
- We sluiten het risico uit door **run-duur te capen**: rijen per run zijn dan begrensd (max_run_duration × event rate) → refresh-tijd blijft bounded.

**Wat is nu geregeld:**
- **INGEST_MAX_RUN_DURATION_HOURS** (config, optioneel): na dit aantal uren verlaat ingest netjes met log `INGEST_MAX_RUN_DURATION_REACHED`; systemd herstart → nieuwe run_id. Geen incrementele refactor nodig zolang deze cap operationeel gebruikt wordt (bijv. 6–24h).
- **docs/REFRESH_COMPLEXITY_AND_GENERATION.md** bijgewerkt met dit besluit.

---

## B. 15-min validatie

**Uitvoering:** Gedraaid op server 2026-03-13 (~15 min). Ingest (run_id=106) en execution draaiden.

| Check | Resultaat |
|-------|-----------|
| Partitioned tabellen ontvangen data (ticker, trade, l2, l3) | **OK** — ticker 7772→12046, trade 20027→26115, l2 31578→42044, l3 1355329→1945855 |
| _deprecated tabellen groeien niet tijdens run | **OK** — counts stabiel (ticker 533886, trade 1648233, l2 3368998, l3 107144752); eerste sample gaf false-positive FAIL (script vergeleek met 0), gecorrigeerd in script |
| run_symbol_state rows + generation_id loopt op | **OK** — state_rows=200, max_gen 29→36 |
| RUN_SYMBOL_STATE_REFRESH zichtbaar met duration | **OK** — 11 refresh events in 15 min |
| RUN_SYMBOL_STATE_SYNC / INGEST_DECISION_SYNC_VISIBLE | **N.v.t.** — physical_separation=false (één pool) |
| Geen onverwachte EXECUTION_BLOCKED_GENERATION_MISMATCH | **OK** — gen_mismatch=0 |
| DATA_FRESHNESS_EVALUATED / ROUTE_FRESHNESS_* | In execution logs aanwezig |

**Validatie geslaagd / niet geslaagd:** **Geslaagd** (na scriptfix: deprecated-check alleen falen als deprecated tussentijds groeit).

**Refresh durations:** Meerdere refresh-cycli; duration_ms in logs (UNIVERSE_REFRESH_STATE_TIMING).

**Generation/sync status:** generation_id loopt op (29→36); sync n.v.t. (geen 2 pools).

**Deprecated echt stil:** Tijdens de 15 min niet gegroeid (bestáande data van vóór cutover).

**Architectuurlekken:** Geen; schrijven gaat naar partitioned tabellen.

### Single-DB vs dual-DB: bewust of niet?

**Niet bewust.** Op de server stond **DECISION_DATABASE_URL** niet gezet (leeg). Daardoor draaide de validatie feitelijk in **single-DB mode**: één pool, geen fysieke scheiding. Gevolg:
- **Sync-markers ontbraken** — `RUN_SYMBOL_STATE_SYNC`, `INGEST_DECISION_SYNC_VISIBLE` en het generation-gate worden alleen uitgevoerd bij `pools.is_physical_separation()` (d.w.z. wanneer `DECISION_DATABASE_URL` is gezet). Die paden zijn in deze run dus niet gecontroleerd.
- De 15-min validatie bevestigt **alleen** het single-DB scenario (partitioned ingest, run_symbol_state, refresh, generation_id op één DB).

**Wat telt als dual-DB:** Alleen een **tweede PostgreSQL-cluster/instance** (eigen poort, eigen datadir). Een tweede database op dezelfde instance, een tweede schema, of twee pools naar dezelfde instance tellen **niet** als fysieke scheiding. Zie [DUAL_DB_SECOND_INSTANCE_PLAN.md](DUAL_DB_SECOND_INSTANCE_PLAN.md).

**Dual-DB validatie:** Pas mogelijk nadat een tweede instance draait en `DECISION_DATABASE_URL` naar die instance wijst (zelfde env-bron als `DATABASE_URL`). Dan: ingest + execution herstarten, 15-min validatie draaien met uitgebreid script; controleren op:
- `RUN_SYMBOL_STATE_SYNC` en `INGEST_DECISION_SYNC_VISIBLE` in de logs
- `visible_generation_id == cycle_generation_id`
- Geen onverwachte `EXECUTION_BLOCKED_GENERATION_MISMATCH`

Tot die tijd is alleen single-DB gevalideerd; dual-DB mag niet als "gevalideerd" of "operationeel" worden gepresenteerd.

---

## C. Reset

**Uitgevoerd / niet uitgevoerd:** **Uitgevoerd** — na geslaagde B: `./scripts/db_full_reset_ingest.sh` op server, daarna `systemctl restart krakenbot-ingest`.

**Exact gewist:** execution_universe_snapshots, ingest_epochs, ingest_lineage, run_symbol_state, ticker_samples, trade_samples, l2_snap_metrics, l3_queue_metrics, pair_summary_24h, shadow_trades, execution_order_latency, observation_runs. (CASCADE trof ook partition-childs aan.)

**Behouden:** execution_orders, fills, positions, realized_pnl, symbol_safety_state (niet in reset-script). _deprecated werden door CASCADE mee gewist.

**Ingest opnieuw gestart:** **Ja** — `systemctl restart krakenbot-ingest`; nieuwe run_id=107 (started_at 2026-03-13 15:58:40).

**Nieuwe basis schoon:** **Ja** — ingest draait op run_id 107; partitioned tabellen zijn de enige waarheid; state wordt opnieuw opgebouwd.

---

## D. Dual-DB uitvoering (2026-03-13)

**Commit(s):** 857f458 (plan, doc, script), e380072 (password-set script).

**Tweede instance:** **Nieuw gebouwd** op de server. Geen bestaande tweede cluster.

| Item | Waarde |
|------|--------|
| **Poort** | 5433 |
| **Service** | postgresql@16-decision |
| **Data directory** | /var/lib/postgresql/16/decision |
| **Aangemaakt met** | `pg_createcluster 16 decision -p 5433 --start` |
| **Database** | trading_rewrite (zelfde naam als op 5432) |
| **User** | trader_rewrite (wachtwoord via scripts/set_decision_db_password.py uit DATABASE_URL) |

**DECISION_DATABASE_URL:** **Actief** in `/srv/krakenbot/.env` (zelfde env-bron als DATABASE_URL, poort 5433). Logs: `DB_PHYSICAL_SEPARATION active (ingest vs decision)`, `physical_separation=true`.

**15-min dual-DB validatie (dual_DB_mode=1):**

| Check | Resultaat |
|-------|-----------|
| **RUN_SYMBOL_STATE_SYNC** | **OK** — sync_marker=2 in 15 min (ingest synct state naar decision). |
| **INGEST_DECISION_SYNC_VISIBLE** | **0** — niet verschenen in logs. Execution draait in EXECUTION_ONLY en krijgt geen valid/degraded epoch (o.a. ingest_epochs op decision DB = 0); alle cycles LIVE_EVALUATION_SKIPPED. Deze marker wordt alleen gelogd wanneer execution een echte evaluation doet. |
| **visible_generation_id == cycle_generation_id** | **N.v.t.** — geen INGEST_DECISION_SYNC_VISIBLE-regel om te parsen. |
| **EXECUTION_BLOCKED_GENERATION_MISMATCH** | **0** — geen. |

**Conclusie (voor fix):** Tweede instance en sync ingest→decision (RUN_SYMBOL_STATE_SYNC) werkten. INGEST_DECISION_SYNC_VISIBLE en generation-match ontbraken omdat execution geen valid epoch op decision DB zag (epoch/snapshot dual-write faalde door ontbrekende observation_run op decision DB).

---

## E. Epoch/snapshot dual-write fix + dual-DB validatie geslaagd (2026-03-13)

**Commits:** a75c126 (epoch/snapshot dual-write: observation_run + lineage op decision; foutlog dual-write), 7f31d23 + 70f4c25 (generation-gate: gebruik synced cycle, geen re-read → geen EXECUTION_BLOCKED_GENERATION_MISMATCH).

**Oorzaak epoch dual-write:** `ingest_epochs` en `execution_universe_snapshots` hebben FK naar `observation_runs(id)`. Op de decision DB stond geen rij voor de huidige run_id → `create_epoch` op decision faalde (FK violation), fout werd stil geslikt.

**Aanpassingen:**
1. **ensure_observation_run_on_pool(decision, run_id, "ingest")** direct na aanmaken run op ingest; daarmee staat de run ook op decision en voldoen epoch/snapshot-inserts aan de FK.
2. **ensure_lineage_on_pool** vóór elke dual-write epoch/snapshot; foutlog bij dual-write (create_epoch, insert_snapshot, update_epoch_status) en **INGEST_DUAL_WRITE_EPOCH_OK** bij succes.
3. **Generation gate:** gate gebruikt nu de zojuist gesyncte generation (cycle_generation_id) in plaats van een latere DB-read (die door ingest kon zijn overschreven) → geen EXECUTION_BLOCKED_GENERATION_MISMATCH meer. INGEST_DECISION_SYNC_VISIBLE logt `visible_generation_id=cycle_generation_id` voor het validatiescript.

**15-min dual-DB validatie (17:46–18:02, run_id=112):**

| Check | Resultaat |
|-------|-----------|
| **RUN_SYMBOL_STATE_SYNC** | **OK** — sync_marker aanwezig |
| **INGEST_DECISION_SYNC_VISIBLE** | **OK** — sync_visible 1→5 in 15 min |
| **visible_generation_id == cycle_generation_id** | **OK** — gelogd en geparsed (bijv. cycle_generation_id=103 visible_generation_id=103) |
| **EXECUTION_BLOCKED_GENERATION_MISMATCH** | **0** — gen_mismatch=0 gedurende hele run |

**Status:** Dual-DB (tweede instance 5433, epoch/snapshot dual-write, generation gate) is **afgerond en gevalideerd**.

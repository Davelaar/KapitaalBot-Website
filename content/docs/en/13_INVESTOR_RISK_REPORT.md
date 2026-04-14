# KapitaalBot — Investor Risk Report

**[← 12 — Investor Overview](./12_INVESTOR_OVERVIEW.md) · [Index →](./DOC_INDEX.md)**

---

> This report is intended to give potential investors an honest picture of the risks and shortcomings of KapitaalBot in its current state. No point in this report is hidden. Technical observations are demonstrable from the codebase.

---

## Risk 1: Single-exchange dependency

**Issue**: the system operates exclusively on Kraken spot markets. There is no multi-exchange architecture.

**Impact on investability**: during a prolonged Kraken outage, API change, or unavailability, the system is completely inactive. There is no failover to another venue.

**Technical solution**: multi-exchange architecture requires significant refactoring of the exchange adapters, execution layer, and balance reconciliation. This is a substantial technical undertaking, not a quick addition.

---

## Risk 2: No formalised backtesting infrastructure

**Issue**: the codebase contains no integrated backtesting pipeline. Strategy performance has not been systematically validated against historical data across varying market conditions.

**Impact on investability**: it is not possible to state with statistical confidence that strategies have historically worked. The only available validation is live behaviour and forward observations.

**Technical solution**: building a replay environment that can run historical market data through the pipeline, combined with a strategy validation framework. This exists as an infrastructure concept but has not yet been built.

---

## Risk 3: Operational single point of failure

**Issue**: the system is managed by a single operator. There is no documented procedure for handover or continuity in the event of operator unavailability.

**Impact on investability**: single point of failure at the operational level. In the event of illness, unavailability, or another disruption, no one else can manage the system.

**Technical solution**: documented runbook for operational handover, multiple administrators with access, and operational SLA documentation.

---

## Risk 4: Complex migration history (132 SQL migrations)

**Issue**: the database has 132 SQL migration scripts across three pools (ingest, decision, research). There is no centralised overview or change log documenting what each migration changed and why.

**Impact on investability**: the complexity of the data structure makes onboarding of new developers more difficult and increases the risk of migration problems during major schema changes.

**Technical solution**: introduce a migration documentation standard, create a schema overview document, and periodically consolidate obsolete migrations into consolidated schema snapshots.

---

## Risk 5: Documentation completeness was recently limited

**Issue**: until the recent update, public documentation was incomplete and partially contained overly technical details that could enable reconstruction. Strategy documentation was entirely absent.

**Impact on investability**: incomplete documentation weakens due-diligence possibilities and increases reliance on the operator as a knowledge source.

**Technical solution**: this risk is partially mitigated by the documentation revision in this project. Remaining gaps: no formal API documentation, no formal SLA documentation.

---

## Risk 6: No formal disaster recovery procedure

**Issue**: there is no documented DR procedure for scenarios such as complete server failure, database corruption, or loss of critical credentials.

**Impact on investability**: in a catastrophic system incident, recovery time is unknown and not guaranteed.

**Technical solution**: create a DR playbook, implement regular DB backups with a documented restore procedure, and store credentials offsite.

---

## Risk 7: Crypto market risk

**Issue**: the system trades exclusively in cryptocurrencies. Crypto markets feature extreme price volatility, regulatory uncertainty, exchange risks, and lower liquidity than traditional markets.

**Impact on investability**: the underlying asset class carries inherent risks that the system cannot eliminate.

**Technical "solution"**: this is not a technical risk but a market risk. The system has protective mechanisms (stops, circuit breakers, exposure limits) but does not eliminate market risk.

---

## Summary: risk assessment by category

| Category | Severity | Mitigability |
|----------|----------|-------------|
| Single-exchange dependency | High | Yes, but large undertaking |
| No backtesting | High | Yes, but significant undertaking |
| Operational single PoF | High | Yes, relatively quickly |
| Migration complexity | Medium | Yes, gradually |
| Documentation completeness | Medium | Yes, partially already mitigated |
| No DR procedure | High | Yes, relatively quickly |
| Crypto market risk | Inherent | No (market factor) |

---

*Back to: [12 — Investor Overview](./12_INVESTOR_OVERVIEW.md)*

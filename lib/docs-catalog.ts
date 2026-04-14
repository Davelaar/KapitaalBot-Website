/**
 * Metadata for public engine docs (`content/docs/<locale>/*.md`, canonical list under `nl/`).
 * Keys match markdown basenames without .md
 */
export const DOCS_META: Record<string, { labelKey: string; descKey: string }> = {
  DOC_INDEX: { labelKey: "docs.meta.DOC_INDEX.label", descKey: "docs.meta.DOC_INDEX.desc" },
  "01_ARCHITECTURE": {
    labelKey: "docs.meta.01_ARCHITECTURE.label",
    descKey: "docs.meta.01_ARCHITECTURE.desc",
  },
  "02_DATA_INGEST": {
    labelKey: "docs.meta.02_DATA_INGEST.label",
    descKey: "docs.meta.02_DATA_INGEST.desc",
  },
  "03_STRATEGY_PIPELINE": {
    labelKey: "docs.meta.03_STRATEGY_PIPELINE.label",
    descKey: "docs.meta.03_STRATEGY_PIPELINE.desc",
  },
  "04_EXECUTION_ORDERS": {
    labelKey: "docs.meta.04_EXECUTION_ORDERS.label",
    descKey: "docs.meta.04_EXECUTION_ORDERS.desc",
  },
  "05_PROTECTION_EXIT": {
    labelKey: "docs.meta.05_PROTECTION_EXIT.label",
    descKey: "docs.meta.05_PROTECTION_EXIT.desc",
  },
  "06_RISK_SAFETY": {
    labelKey: "docs.meta.06_RISK_SAFETY.label",
    descKey: "docs.meta.06_RISK_SAFETY.desc",
  },
  "07_OBSERVABILITY": {
    labelKey: "docs.meta.07_OBSERVABILITY.label",
    descKey: "docs.meta.07_OBSERVABILITY.desc",
  },
  "08_OPERATIONS": {
    labelKey: "docs.meta.08_OPERATIONS.label",
    descKey: "docs.meta.08_OPERATIONS.desc",
  },
  "00_MODULE_INVENTORY": {
    labelKey: "docs.meta.00_MODULE_INVENTORY.label",
    descKey: "docs.meta.00_MODULE_INVENTORY.desc",
  },
  FASE_0B_RUNTIME: {
    labelKey: "docs.meta.FASE_0B_RUNTIME.label",
    descKey: "docs.meta.FASE_0B_RUNTIME.desc",
  },
  DECIMAL_F64_POLICY_AND_INVENTORY: {
    labelKey: "docs.meta.DECIMAL_F64_POLICY_AND_INVENTORY.label",
    descKey: "docs.meta.DECIMAL_F64_POLICY_AND_INVENTORY.desc",
  },
  FORWARD_RETURNS_OBSERVABILITY: {
    labelKey: "docs.meta.FORWARD_RETURNS_OBSERVABILITY.label",
    descKey: "docs.meta.FORWARD_RETURNS_OBSERVABILITY.desc",
  },
  DOCS_TARGET_STRUCTURE: {
    labelKey: "docs.meta.DOCS_TARGET_STRUCTURE.label",
    descKey: "docs.meta.DOCS_TARGET_STRUCTURE.desc",
  },
  OBSERVABILITY_SNAPSHOT_CONTRACT: {
    labelKey: "docs.meta.OBSERVABILITY_SNAPSHOT_CONTRACT.label",
    descKey: "docs.meta.OBSERVABILITY_SNAPSHOT_CONTRACT.desc",
  },
  SYSTEMD_README: {
    labelKey: "docs.meta.SYSTEMD_README.label",
    descKey: "docs.meta.SYSTEMD_README.desc",
  },
};

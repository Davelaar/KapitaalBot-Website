import Link from "next/link";

/**
 * Tier 1: documentatie-overzicht. Alleen leidende SSOT/INDEX en kern-docs;
 * geen volledige inhoud, wel korte beschrijvingen en verwijzing naar repo.
 */
const DOCS = [
  { path: "ENGINE_SSOT.md", label: "Engine SSOT", desc: "Engine-status, statusmatrix, wat actueel is." },
  { path: "DOC_INDEX.md", label: "Document index", desc: "Welke documenten leidend zijn, welke historisch." },
  { path: "ARCHITECTURE_ENGINE_CURRENT.md", label: "Architectuur", desc: "Huidige architectuur — modules, dataflow, execution lifecycle." },
  { path: "LIVE_RUNBOOK_CURRENT.md", label: "Runbook", desc: "Operationeel runbook — ingest, execution attach, markers." },
  { path: "VALIDATION_MODEL_CURRENT.md", label: "Validatiemodel", desc: "Bootstrap/attach/evaluation/lifecycle proof." },
  { path: "OBSERVABILITY_SNAPSHOT_CONTRACT.md", label: "Observability-contract", desc: "Contract tussen bot en website (snapshots)." },
  { path: "CHANGELOG_ENGINE.md", label: "Changelog engine", desc: "Technische changelog per subsystem." },
  { path: "LOGGING.md", label: "Logging", desc: "Loggingstructuur en markers." },
  { path: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md", label: "DB-architectuur", desc: "State-first, partition, generation, stale-edge prevention." },
];

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Documentation — KapitaalBot",
  description: "Leidende documentatie voor de KapitaalBot-engine. SSOT en overzicht.",
};

export default function DocsPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Documentatie</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Leidende documenten voor de engine. Single source of truth: ENGINE_SSOT.md; overzicht: DOC_INDEX.md.
        Volledige docs en rapporten zijn beschikbaar via Tier 2.
      </p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {DOCS.map((d) => (
          <li key={d.path} className="card" style={{ marginBottom: "0.75rem" }}>
            <strong style={{ fontSize: "1rem" }}>{d.label}</strong>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>{d.desc}</p>
            <code style={{ fontSize: "0.8rem", color: "var(--accent)" }}>{d.path}</code>
          </li>
        ))}
      </ul>
    </main>
  );
}

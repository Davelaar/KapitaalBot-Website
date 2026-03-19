import Link from "next/link";
import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

const DOC_META: Record<string, { label: string; desc: string }> = {
  ENGINE_SSOT: { label: "Engine SSOT", desc: "Engine-status, statusmatrix, runtime-topology (incl. Mermaid-diagram)." },
  DOC_INDEX: { label: "Document index", desc: "Welke documenten leidend zijn, welke historisch." },
  ARCHITECTURE_ENGINE_CURRENT: { label: "Architectuur", desc: "Huidige architectuur — modules, dataflow, execution lifecycle." },
  LIVE_RUNBOOK_CURRENT: { label: "Runbook", desc: "Operationeel runbook — ingest, execution attach, markers." },
  VALIDATION_MODEL_CURRENT: { label: "Validatiemodel", desc: "Bootstrap/attach/evaluation/lifecycle proof." },
  OBSERVABILITY_SNAPSHOT_CONTRACT: { label: "Observability-contract", desc: "Contract tussen bot en website (snapshots)." },
  CHANGELOG_ENGINE: { label: "Changelog engine", desc: "Technische changelog per subsystem." },
  LOGGING: { label: "Logging", desc: "Loggingstructuur en markers." },
  DB_ARCHITECTURE_STALE_EDGE_SAFE: { label: "DB-architectuur", desc: "State-first, partition, generation, stale-edge prevention." },
  VALIDATION_REPORT_REFRESH_15MIN_RESET: { label: "15-min validatie", desc: "Proof-run met refresh/reset checks en expected outcomes." },
  SYSTEMD_README: { label: "Systemd units", desc: "Service-overzicht voor ingest/execution/export en operationele startvolgorde." },
};

function getDocSlugs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Documentation — KapitaalBot",
  description: "Leidende documentatie voor de KapitaalBot-engine. SSOT, overzicht en Mermaid-diagrammen.",
};

export default function DocsPage() {
  const slugs = getDocSlugs();

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Documentatie</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Leidende documenten voor de engine. Single source of truth: ENGINE_SSOT; overzicht: DOC_INDEX.
        Klik op een document voor de volledige inhoud inclusief Mermaid-diagrammen.
      </p>
      <section className="card" style={{ padding: "1rem 1.25rem" }}>
        <table className="docs-index-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.4rem 0.25rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: 600,
                }}
              >
                Onderwerp
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.4rem 0.25rem",
                  borderBottom: "1px solid var(--border)",
                  fontWeight: 600,
                }}
              >
                Document
              </th>
            </tr>
          </thead>
          <tbody>
            {slugs.map((slug) => {
              const meta = DOC_META[slug] ?? { label: slug, desc: "" };
              return (
                <tr key={slug}>
                  <td style={{ padding: "0.4rem 0.25rem", verticalAlign: "top" }}>
                    <strong>{meta.label}</strong>
                    {meta.desc && (
                      <p style={{ margin: "0.15rem 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>{meta.desc}</p>
                    )}
                  </td>
                  <td style={{ padding: "0.4rem 0.25rem", verticalAlign: "top" }}>
                    <Link
                      href={`/docs/${slug}`}
                      className="docs-index-link"
                      style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem" }}
                    >
                      {slug}.md
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}

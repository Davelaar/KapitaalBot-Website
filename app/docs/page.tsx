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
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {slugs.map((slug) => {
          const meta = DOC_META[slug] ?? { label: slug, desc: "" };
          return (
            <li key={slug}>
              <Link
                href={`/docs/${slug}`}
                className="card"
                style={{
                  display: "block",
                  marginBottom: "0.75rem",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <strong style={{ fontSize: "1rem" }}>{meta.label}</strong>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: "0.25rem 0 0 0" }}>{meta.desc}</p>
                <code style={{ fontSize: "0.8rem", color: "var(--accent)" }}>{slug}.md</code>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

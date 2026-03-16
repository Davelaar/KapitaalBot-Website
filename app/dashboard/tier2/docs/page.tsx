import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";

export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    title: "Leidende documenten",
    docs: [
      { path: "ENGINE_SSOT.md", topic: "Engine-status, statusmatrix" },
      { path: "ARCHITECTURE_ENGINE_CURRENT.md", topic: "Architectuur" },
      { path: "LIVE_RUNBOOK_CURRENT.md", topic: "Runbook" },
      { path: "VALIDATION_MODEL_CURRENT.md", topic: "Validatiemodel" },
      { path: "OBSERVABILITY_SNAPSHOT_CONTRACT.md", topic: "Observability-contract" },
      { path: "OBSERVABILITY_EXPORT_SETUP.md", topic: "Export runbook" },
      { path: "CHANGELOG_ENGINE.md", topic: "Changelog engine" },
      { path: "LOGGING.md", topic: "Logging" },
      { path: "INGEST_EXECUTION_EPOCH_CONTRACT.md", topic: "Epoch/snapshot contract" },
    ],
  },
  {
    title: "Ondersteunend / referentie",
    docs: [
      { path: "DB_ARCHITECTURE_STALE_EDGE_SAFE.md", topic: "State-first, partition, generation" },
      { path: "EXECUTION_REPORT_FRESHNESS_AND_500L3.md", topic: "Freshness, safety, L3" },
      { path: "VALIDATION_REPORT_REFRESH_15MIN_RESET.md", topic: "15-min validatie, DB-reset" },
    ],
  },
];

export default async function Tier2DocsPage() {
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" />;
  }

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard/tier2" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Dashboard Tier 2
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Documentatie (Tier 2)</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Volledige documentindex. Bron: KRAKENBOTMAART docs/DOC_INDEX.md.
      </p>
      {SECTIONS.map((sec) => (
        <section key={sec.title} className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{sec.title}</h2>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--muted)", fontSize: "0.9rem" }}>
            {sec.docs.map((d) => (
              <li key={d.path}>
                <code>{d.path}</code> — {d.topic}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

import Link from "next/link";

const MODULES = [
  { id: "a", name: "Run & Data Health", data: "Sample counts, feed freshness, run timeline" },
  { id: "b", name: "Epoch & Ingest", data: "Epoch validity, symbol universe size" },
  { id: "c", name: "Execution", data: "Orders, fills, expected vs realized edge" },
  { id: "d", name: "Latency", data: "Submit→ack, fill→exit, histogram" },
  { id: "e", name: "PnL & Positions", data: "Cumulatieve PnL, exposure" },
  { id: "f", name: "Safety & WS", data: "Symbols per mode, quiet/hard-block" },
  { id: "g", name: "Market / Pair Summary", data: "Suitability, spread, L2/L3 depth" },
  { id: "h", name: "Shadow Trades", data: "Outcome distribution, missed move" },
  { id: "i", name: "Event Buffer", data: "Buffered events KPI" },
];

/**
 * Tier 2 dashboard. Toegang vereist Tier 2-sessie (auth Phase 6).
 * Modules A–I: data uit tier2_* snapshots zodra auth + export beschikbaar.
 */
export default function DashboardTier2Page() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Dashboard
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Dashboard Tier 2
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Uitgebreide modules. Toegang na handmatige Tier 2-toekenning. Filters en
        strategy/regime toggles komen bij integratie van tier2_* snapshots.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--muted)" }}>Filters (placeholder):</span>
        <button type="button" className="card" style={{ padding: "0.35rem 0.75rem", cursor: "pointer" }}>Regime</button>
        <button type="button" className="card" style={{ padding: "0.35rem 0.75rem", cursor: "pointer" }}>Strategy</button>
      </div>

      {MODULES.map((m) => (
        <section key={m.id} className="card" style={{ marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
            {m.id.toUpperCase()}. {m.name}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            {m.data}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            Tier 2 snapshot endpoint wordt hier geladen na auth.
          </p>
        </section>
      ))}

      <section className="card" style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Tier-model & dataflow (conceptueel)</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          Onderstaande diagrammen volgen de SSOT-engine-documentatie. Ze tonen hoe Tier 1, Tier 2 en Tier 3
          observability op elkaar aansluiten. De data zelf komt uitsluitend uit read-model snapshots; geen directe
          DB-query’s vanaf de website.
        </p>
        <div style={{ overflowX: "auto", fontSize: "0.8rem", lineHeight: 1.5 }}>
          <pre style={{ marginBottom: "0.75rem" }}>
{`\`\`\`mermaid
flowchart LR
  Tier1["Tier 1 (publiek)"] --> Tier2["Tier 2 (op aanvraag)"]
  Tier2 --> Tier3["Tier 3 (admin)"]

  Tier1 --> SnapPublic["public_* snapshots"]
  Tier2 --> SnapTier2["tier2_* snapshots"]
  Tier3 --> SnapAdmin["admin_observability_snapshot"]
\`\`\``}
          </pre>
          <pre>
{`\`\`\`mermaid
flowchart TB
  BotEngine["Krakenbot Engine"] --> Export["export-observability-snapshots"]
  Export --> Dir["OBSERVABILITY_EXPORT_DIR"]
  Dir --> SiteTier1["KapitaalBot Observability (Tier 1)"]
  Dir --> SiteTier2["KapitaalBot Observability (Tier 2)"]
\`\`\``}
          </pre>
        </div>
      </section>
    </main>
  );
}

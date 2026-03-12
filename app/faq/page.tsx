import Link from "next/link";

/**
 * FAQ (sectie 12). Retrieval-based FAQ-bot later; tier-aware; weigert strategie/thresholds.
 */
export default function FAQPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>FAQ</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Veelgestelde vragen. FAQ-bot (retrieval, tier-aware) komt in een latere fase.
      </p>
      <div className="card">
        <h2 style={{ fontSize: "1.1rem" }}>Wat is KapitaalBot?</h2>
        <p style={{ color: "var(--muted)" }}>
          Een autonoom crypto trading systeem met multi-regime en multi-strategy
          execution. Dit platform is uitsluitend informatief.
        </p>
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.1rem" }}>Waarom vertraagde data op Tier 1?</h2>
        <p style={{ color: "var(--muted)" }}>
          Om observability en uitleg te bieden zonder realtime signal-gedrag of
          reverse-engineering te faciliteren.
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import { FaqChatbot } from "@/components/FaqChatbot";

/**
 * FAQ (sectie 12) + FAQ-chatbot (RAG-preview).
 */
export default function FAQPage() {
  const items: { q: string; a: string }[] = [
    {
      q: "Wat is KapitaalBot?",
      a: "Een autonoom crypto trading systeem met multi-regime en multi-strategy execution. Het platform toont uitsluitend observability-data (vertraagd, geaggregeerd); geen live orders of realtime signalen.",
    },
    {
      q: "Waarom vertraagde data op Tier 1?",
      a: "Om observability en uitleg te bieden zonder realtime signal-gedrag of reverse-engineering te faciliteren. Tier 1 toont run-status, regime/strategy-overviews, tellers en samenvattingen.",
    },
    {
      q: "Wat is Tier 1 vs Tier 2?",
      a: "Tier 1 is open: status, regimes, strategieën, handelstellers, markt-overzicht. Tier 2 (op aanvraag) biedt meer detail: execution dashboards, latency, strategy activity, shadow trades.",
    },
    {
      q: "Is dit financieel advies?",
      a: "Nee. Dit platform is informatief en technisch. Geen beleggingsadvies, geen garanties. Handel op eigen risico.",
    },
    {
      q: "Waar komt de data vandaan?",
      a: "De bot exporteert read-model snapshots (JSON) naar een export-directory. De website leest alleen deze snapshots; geen directe database-toegang of execution-tabellen.",
    },
  ];

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
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map(({ q, a }) => (
          <div key={q} className="card">
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{q}</h2>
            <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>{a}</p>
          </div>
        ))}
      </div>
      <FaqChatbot />
    </main>
  );
}

import Link from "next/link";
import { Tier2RequestForm } from "@/components/Tier2RequestForm";

export default function Tier2RequestPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Tier 2-toegang aanvragen
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "50ch" }}>
        Tier 2 biedt uitgebreidere observability: execution dashboards, latency-metrics,
        strategy activity. Vul het formulier in; toegang wordt handmatig toegekend.
      </p>
      <Tier2RequestForm />
      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
        Formulier wordt in een latere fase gekoppeld aan backend / e-mail of admin-panel.
      </p>
    </main>
  );
}

import Link from "next/link";
import { StatusStrip } from "@/components/StatusStrip";
import { MetricCardGrid } from "@/components/MetricCardGrid";
import { RegimeStrategyOverview } from "@/components/RegimeStrategyOverview";

export default function DashboardPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Dashboard (Tier 1)
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Regime- en strategy-overview; system status. Vertraagde/geaggregeerde
        data.
      </p>

      <StatusStrip />
      <MetricCardGrid />
      <RegimeStrategyOverview />
    </main>
  );
}

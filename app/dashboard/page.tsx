import Link from "next/link";
import {
  getPublicStatusSnapshot,
  getPublicRegimeSnapshot,
  getPublicStrategySnapshot,
  getPublicTradingSnapshot,
  getPublicMarketSnapshot,
  getPublicDemoTrades,
} from "@/lib/read-snapshots";
import StatusStrip from "@/components/StatusStrip";
import MetricCardGrid from "@/components/MetricCardGrid";
import RegimeStrategyOverview from "@/components/RegimeStrategyOverview";
import MarketSummary from "@/components/MarketSummary";
import DemoTradeTeaser from "@/components/DemoTradeTeaser";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();
  const market = getPublicMarketSnapshot();
  const demo = getPublicDemoTrades();

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

      <StatusStrip status={status} />
      <MetricCardGrid
        status={status}
        trading={trading}
        regime={regime}
        strategy={strategy}
      />
      <RegimeStrategyOverview regime={regime} strategy={strategy} />
      <MarketSummary market={market} />
      <DemoTradeTeaser demo={demo} maxItems={8} />
    </main>
  );
}

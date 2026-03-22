import Link from "next/link";
import { cookies } from "next/headers";
import {
  getPublicStatusSnapshotCached,
  getPublicRegimeSnapshotCached,
  getPublicStrategySnapshotCached,
  getPublicTradingSnapshotCached,
  getPublicMarketSnapshotCached,
  getPublicDemoTradesCached,
} from "@/lib/read-snapshots-cached";
import { t, type Locale } from "@/lib/i18n";
import { DashboardIntro } from "@/components/DashboardIntro";
import StatusStrip from "@/components/StatusStrip";
import MetricCardGrid from "@/components/MetricCardGrid";
import RegimeStrategyOverview from "@/components/RegimeStrategyOverview";
import MarketSummary from "@/components/MarketSummary";
import DemoTradeTeaser from "@/components/DemoTradeTeaser";
import RecentExecutionSection from "@/components/RecentExecutionSection";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "nl") as Locale;
  const [status, regime, strategy, trading, market, demo] = await Promise.all([
    getPublicStatusSnapshotCached(),
    getPublicRegimeSnapshotCached(),
    getPublicStrategySnapshotCached(),
    getPublicTradingSnapshotCached(),
    getPublicMarketSnapshotCached(),
    getPublicDemoTradesCached(),
  ]);

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.system")}
        </Link>
      </nav>
      <DashboardIntro status={status} locale={locale} />

      <StatusStrip status={status} locale={locale} />
      <MetricCardGrid
        status={status}
        trading={trading}
        regime={regime}
        strategy={strategy}
      />
      <RecentExecutionSection trading={trading} maxOrders={10} maxFills={10} />
      <RegimeStrategyOverview regime={regime} strategy={strategy} />
      <MarketSummary market={market} />
      <DemoTradeTeaser demo={demo} maxItems={8} />
    </main>
  );
}

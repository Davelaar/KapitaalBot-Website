import Link from "next/link";
import {
  getPublicStatusSnapshotCached,
  getPublicRegimeSnapshotCached,
  getPublicStrategySnapshotCached,
  getPublicTradingSnapshotCached,
  getTier2DataBundleCached,
} from "@/lib/read-snapshots-cached";
import { t, type Locale } from "@/lib/i18n";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { DashboardCockpit } from "@/components/DashboardCockpit";
import { RouteCentricDashboard } from "@/components/RouteCentricDashboard";
import { DashboardAutoRefresh } from "@/components/DashboardAutoRefresh";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const [status, regime, strategy, trading, dataBundle] = await Promise.all([
    getPublicStatusSnapshotCached(),
    getPublicRegimeSnapshotCached(),
    getPublicStrategySnapshotCached(),
    getPublicTradingSnapshotCached(),
    getTier2DataBundleCached(),
  ]);

  return (
    <DashboardAutoRefresh intervalMs={60_000}>
      <main className="kb-dashboard-shell">
        <nav style={{ marginBottom: "1.25rem" }}>
          <Link href={withLocale(locale, "/")}>← {t(locale, "nav.system")}</Link>
        </nav>
        <DashboardCockpit
          locale={locale}
          status={status}
          regime={regime}
          strategy={strategy}
          trading={trading}
          dataBundle={dataBundle}
        />
        <RouteCentricDashboard
          locale={locale}
          status={status}
          regime={regime}
          strategy={strategy}
          trading={trading}
          dataBundle={dataBundle}
        />
      </main>
    </DashboardAutoRefresh>
  );
}

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
import { DashboardIntro } from "@/components/DashboardIntro";
import { RouteCentricDashboard } from "@/components/RouteCentricDashboard";

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
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.system")}
        </Link>
      </nav>
      <DashboardIntro status={status} locale={locale} />
      <RouteCentricDashboard
        locale={locale}
        status={status}
        regime={regime}
        strategy={strategy}
        trading={trading}
        dataBundle={dataBundle}
      />
    </main>
  );
}

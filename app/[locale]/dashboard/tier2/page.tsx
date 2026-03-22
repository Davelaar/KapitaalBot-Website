import { getSessionTier } from "@/lib/auth";
import {
  getTier2ExecutionSnapshotCached,
  getTier2LatencySnapshotCached,
  getTier2PnlSnapshotCached,
  getTier2SafetySnapshotCached,
} from "@/lib/read-snapshots-cached";
import { TierGate } from "@/components/TierGate";
import { DashboardTier2Content } from "@/components/DashboardTier2Content";
import { parseLocaleParam } from "@/lib/locale-path";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function DashboardTier2Page({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" locale={locale} />;
  }
  const [execution, latency, pnl, safety] = await Promise.all([
    getTier2ExecutionSnapshotCached(),
    getTier2LatencySnapshotCached(),
    getTier2PnlSnapshotCached(),
    getTier2SafetySnapshotCached(),
  ]);
  return (
    <main>
      <DashboardTier2Content
        execution={execution}
        latency={latency}
        pnl={pnl}
        safety={safety}
      />
    </main>
  );
}

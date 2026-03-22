import { getSessionTier } from "@/lib/auth";
import {
  getTier2ExecutionSnapshotCached,
  getTier2LatencySnapshotCached,
  getTier2PnlSnapshotCached,
  getTier2SafetySnapshotCached,
} from "@/lib/read-snapshots-cached";
import { TierGate } from "@/components/TierGate";
import { DashboardTier2Content } from "@/components/DashboardTier2Content";

export const dynamic = "force-dynamic";

export default async function DashboardTier2Page() {
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" />;
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

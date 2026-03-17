import { getSessionTier } from "@/lib/auth";
import {
  getTier2ExecutionSnapshot,
  getTier2LatencySnapshot,
  getTier2PnlSnapshot,
  getTier2SafetySnapshot,
} from "@/lib/read-snapshots";
import { TierGate } from "@/components/TierGate";
import { DashboardTier2Content } from "@/components/DashboardTier2Content";

export const dynamic = "force-dynamic";

export default async function DashboardTier2Page() {
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" />;
  }
  const execution = getTier2ExecutionSnapshot();
  const latency = getTier2LatencySnapshot();
  const pnl = getTier2PnlSnapshot();
  const safety = getTier2SafetySnapshot();
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

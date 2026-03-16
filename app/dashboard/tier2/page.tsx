import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import { DashboardTier2Content } from "@/components/DashboardTier2Content";

export const dynamic = "force-dynamic";

export default async function DashboardTier2Page() {
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" />;
  }
  return (
    <main>
      <DashboardTier2Content />
    </main>
  );
}

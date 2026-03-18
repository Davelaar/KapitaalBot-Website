import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import {
  getPublicStatusSnapshot,
  getPublicRegimeSnapshot,
  getPublicStrategySnapshot,
  getPublicTradingSnapshot,
  getPublicMarketSnapshot,
} from "@/lib/read-snapshots";
import { AdminSnapshotStatus } from "@/components/AdminSnapshotStatus";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const tier = await getSessionTier();

  if (tier < 3) {
    return <TierGate kind="tier3" />;
  }

  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();
  const market = getPublicMarketSnapshot();

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Dashboard
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Admin — Full observability</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Laatste snapshot-timestamps, run_id, epoch status, aanwezigheid market/trading. Raw JSON viewer.
      </p>
      <section className="card" style={{ marginBottom: "1.5rem", padding: "1rem 1.25rem" }}>
        <Link href="/admin/cms" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
          → CMS-light editor (content + notes)
        </Link>
      </section>
      <AdminSnapshotStatus
        status={status}
        regime={regime}
        strategy={strategy}
        trading={trading}
        market={market}
      />
    </main>
  );
}

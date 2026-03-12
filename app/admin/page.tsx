import Link from "next/link";
import { requireTier } from "@/lib/auth";
import {
  getPublicStatusSnapshot,
  getPublicRegimeSnapshot,
  getPublicStrategySnapshot,
  getPublicTradingSnapshot,
  getPublicMarketSnapshot,
} from "@/lib/read-snapshots";
import { AdminSnapshotStatus } from "@/components/AdminSnapshotStatus";

export const dynamic = "force-dynamic";

/**
 * Admin: full observability, snapshot status, raw JSON (Tier 3 when auth is enabled).
 */
export default async function AdminPage() {
  const allowed = requireTier(3);

  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();
  const market = getPublicMarketSnapshot();

  if (!allowed) {
    return (
      <main>
        <div className="card" style={{ maxWidth: "480px" }}>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>Tier 3 vereist</h2>
          <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
            Deze pagina is alleen toegankelijk voor beheerders (Tier 3). Log in met admin-rechten.
          </p>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            ← Terug naar home
          </Link>
        </div>
      </main>
    );
  }

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

import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import { readTier2Requests } from "@/lib/tier2-requests";
import { Tier2RequestsAdmin } from "@/components/Tier2RequestsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminAccessPage() {
  const tier = await getSessionTier();

  if (tier < 3) {
    return <TierGate kind="tier3" />;
  }

  const rows = readTier2Requests();
  const sorted = [...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href="/admin" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Admin
        </Link>
        <Link href="/dashboard" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Dashboard
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Admin — Toegang & aanvragen</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.25rem" }}>
        Overzicht van Tier 2-aanvragen. Bij goedkeuring wordt de aanvraag gemarkeerd als "approved" en (optioneel) een
        e-mail/webhook getriggerd met inloginstructies.
      </p>
      <Tier2RequestsAdmin initialRequests={sorted} />
    </main>
  );
}


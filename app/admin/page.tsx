import Link from "next/link";
import { requireTier } from "@/lib/auth";

/**
 * Admin: full observability, raw lifecycle (Tier 3). Placeholder tot auth + admin_observability_snapshot.
 */
export default function AdminPage() {
  const allowed = requireTier(3);
  if (!allowed) {
    return (
      <main>
        <p style={{ color: "var(--muted)" }}>
          Toegang alleen voor Tier 3 (admin). Log in met admin-rechten.
        </p>
        <Link href="/" style={{ color: "var(--accent)" }}>← Home</Link>
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
      <h1 style={{ fontSize: "1.75rem" }}>Admin — Full observability</h1>
      <p style={{ color: "var(--muted)" }}>
        Raw lifecycle, tuning. Data uit admin_observability_snapshot (nog niet geïmplementeerd).
      </p>
    </main>
  );
}

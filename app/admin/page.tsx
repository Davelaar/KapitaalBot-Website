import Link from "next/link";
import { requireTier } from "@/lib/auth";

/**
 * Admin: full observability, raw lifecycle (Tier 3). Placeholder until auth + admin_observability_snapshot.
 */
export default function AdminPage() {
  const allowed = requireTier(3);
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
        Raw lifecycle, tuning. Data uit admin_observability_snapshot (nog niet geïmplementeerd).
      </p>
      <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Snapshot-status</h2>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.9rem" }}>
            Toekomst: overzicht van alle export-bestanden en laatste export-tijdstempel.
          </p>
        </div>
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Raw lifecycle</h2>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.9rem" }}>
            Toekomst: order/fill-lifecycle uit admin_observability_snapshot.
          </p>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";

export default function Tier2RequestPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Tier 2-toegang aanvragen
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Vul onderstaand formulier in. Toegang wordt handmatig toegekend.
      </p>
      <div className="card" style={{ maxWidth: "400px" }}>
        <form>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            E-mail
          </label>
          <input
            type="email"
            name="email"
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              color: "var(--fg)",
            }}
          />
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Reden / gebruik
          </label>
          <textarea
            name="reason"
            rows={3}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              color: "var(--fg)",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              background: "var(--accent)",
              color: "#0f1419",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Verstuur aanvraag
          </button>
        </form>
      </div>
      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
        Formulier wordt in een latere fase gekoppeld aan backend / e-mail of
        admin-panel.
      </p>
    </main>
  );
}

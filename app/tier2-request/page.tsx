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
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "50ch" }}>
        Tier 2 biedt uitgebreidere observability: execution dashboards, latency-metrics,
        strategy activity. Vul het formulier in; toegang wordt handmatig toegekend.
      </p>
      <div className="card" style={{ maxWidth: "420px" }}>
        <form
          onSubmit={(e) => e.preventDefault()}
          aria-label="Tier 2 aanvraag"
        >
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="tier2-email"
              style={{
                display: "block",
                marginBottom: "0.35rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              E-mail
            </label>
            <input
              id="tier2-email"
              type="email"
              name="email"
              required
              placeholder="jouw@email.nl"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--fg)",
                fontSize: "1rem",
              }}
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="tier2-reason"
              style={{
                display: "block",
                marginBottom: "0.35rem",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Reden / gebruik
            </label>
            <textarea
              id="tier2-reason"
              name="reason"
              rows={4}
              placeholder="Bijv. technische review, compliance, interne observability."
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                color: "var(--fg)",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1.25rem",
              background: "var(--accent)",
              color: "#0f1419",
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9375rem",
            }}
          >
            Verstuur aanvraag
          </button>
        </form>
      </div>
      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
        Formulier wordt in een latere fase gekoppeld aan backend / e-mail of admin-panel.
      </p>
    </main>
  );
}

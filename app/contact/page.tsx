import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact — KapitaalBot",
  description: "Contact en toegang tot KapitaalBot observability.",
};

export default function ContactPage() {
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Contact</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Voor een privé-aanvraag of technische dialoog: gebruik het Access-formulier. Geen performance claims; toegang wordt handmatig beoordeeld.
      </p>
      <section className="card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: 0 }}>
          <Link href="/tier2-request" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            → Access (Tier 2-aanvraag)
          </Link>
        </p>
      </section>
      <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
        Data, Changelog en FAQ staan in de navigatie. Voor compliance en disclaimer: zie de footer en de Access-pagina.
      </p>
    </main>
  );
}

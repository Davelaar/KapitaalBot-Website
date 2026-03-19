import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  const title = "KapitaalBot — Contact";
  const description = "KapitaalBot contact & access.";
  return {
    title,
    description,
  };
}

export default function ContactPage() {
  const locale = useLocale();
  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "contact.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        {t(locale, "contact.intro")}
      </p>
      <section className="card" style={{ marginBottom: "1rem" }}>
        <p style={{ margin: 0 }}>
          <Link href="/tier2-request" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            → {t(locale, "contact.accessLink")}
          </Link>
        </p>
      </section>
      <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
        {t(locale, "contact.footer")}
      </p>
    </main>
  );
}

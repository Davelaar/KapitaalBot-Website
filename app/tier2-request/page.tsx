import Link from "next/link";
import { Tier2RequestForm } from "@/components/Tier2RequestForm";
import { cookies } from "next/headers";
import { t, type Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";

export default async function Tier2RequestPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || defaultLocale) as Locale;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {t(locale, "nav.system")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        {t(locale, "access.title")}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "0.75rem", maxWidth: "50ch" }}>
        {t(locale, "access.intro")}
      </p>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", fontSize: "0.8125rem", maxWidth: "50ch" }}>
        {t(locale, "access.tier2.disclaimer")}
      </p>
      <Tier2RequestForm />
    </main>
  );
}

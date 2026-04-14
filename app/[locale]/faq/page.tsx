import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";
import type { Locale } from "@/lib/i18n";
import { FAQ_SECTIONS } from "@/lib/faq-sections";

export default async function FAQPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "faq.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem", maxWidth: "78ch", lineHeight: 1.65 }}>{t(locale, "faq.intro")}</p>
      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
        {FAQ_SECTIONS.map((section) => (
          <section key={section.id} className="card" style={{ padding: "1rem 1.25rem" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{t(locale, section.titleKey)}</h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {section.items.map((item) => (
                <article key={`${section.id}-${item.qKey}`} className="card" style={{ margin: 0 }}>
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>{t(locale, item.qKey)}</h3>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{t(locale, item.aKey)}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <FaqChatbot />
    </main>
  );
}

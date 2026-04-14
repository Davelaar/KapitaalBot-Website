import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";
import type { Locale } from "@/lib/i18n";
import { FAQ_SECTIONS } from "@/lib/faq-sections";
import { buildFaqStructuredData } from "@/lib/faq-jsonld";

export default async function FAQPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const structuredData = buildFaqStructuredData(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <nav style={{ marginBottom: "1.5rem" }}>
          <Link href={withLocale(locale, "/")} className="kb-text-link">
            ← {t(locale, "nav.home")}
          </Link>
        </nav>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "faq.title")}</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1rem", maxWidth: "78ch", lineHeight: 1.65 }}>
          {t(locale, "faq.intro")}
        </p>
        <FaqChatbot />
        <h2 className="kb-faq-list-heading" style={{ fontSize: "1.1rem", marginBottom: "0.65rem", color: "var(--text-secondary)" }}>
          {t(locale, "faq.listHeading")}
        </h2>
        <div className="kb-faq-root" style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
          {FAQ_SECTIONS.map((section, sectionIdx) => (
            <details
              key={section.id}
              id={`faq-${section.id}`}
              className="kb-faq-category card"
              open={sectionIdx === 0}
            >
              <summary className="kb-faq-category-summary">
                <span className="kb-faq-category-title">{t(locale, section.titleKey)}</span>
              </summary>
              <div className="kb-faq-category-body">
                {section.items.map((item) => (
                  <details key={`${section.id}-${item.qKey}`} className="kb-faq-item">
                    <summary className="kb-faq-question">
                      <span className="kb-faq-q-text">{t(locale, item.qKey)}</span>
                    </summary>
                    <div className="kb-faq-answer">{t(locale, item.aKey)}</div>
                  </details>
                ))}
              </div>
            </details>
          ))}
        </div>
      </main>
    </>
  );
}

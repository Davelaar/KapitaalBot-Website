import Link from "next/link";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";
import { FaqChatbot } from "@/components/FaqChatbot";
import type { Locale } from "@/lib/i18n";

type QA = { q: string; a: string };

function section(title: string, rows: QA[]) {
  return (
    <section className="card" style={{ padding: "1rem 1.25rem" }}>
      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{title}</h2>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {rows.map((r) => (
          <article key={r.q} className="card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>{r.q}</h3>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>{r.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function FAQPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";

  const economic: QA[] = [
    {
      q: isNl ? "Wat laat de publieke performance-laag wel en niet zien?" : "What does the public performance layer show and not show?",
      a: isNl
        ? "Wel: uitvoerbaarheid, reject reasons, route-uitkomsten en geaggregeerde execution quality. Niet: accountspecifieke PnL, balances of individuele private allocatiebeslissingen."
        : "It shows execution viability, rejection reasons, route outcomes, and aggregated execution quality. It does not show account-specific PnL, balances, or individual private allocation decisions.",
    },
    {
      q: isNl ? "Waarom is Tier 1 vertraagd?" : "Why is Tier 1 delayed?",
      a: isNl
        ? "Tier 1 is bewust vertraagd om strategische leakage te voorkomen en tegelijk publieke controle op systeemgedrag mogelijk te maken."
        : "Tier 1 is intentionally delayed to prevent strategy leakage while preserving public verification of system behavior.",
    },
  ];

  const legal: QA[] = [
    {
      q: isNl ? "Is dit beleggingsadvies?" : "Is this investment advice?",
      a: isNl
        ? "Nee. De site is een technische transparantie- en observabilitylaag. Het is geen uitnodiging, aanbeveling of individueel advies."
        : "No. This site is a technical transparency and observability layer. It is not a solicitation, recommendation, or personal advice.",
    },
    {
      q: isNl ? "Welke gegevens blijven altijd privé?" : "Which data remains private?",
      a: isNl
        ? "Private accountdetails, gevoelige uitvoeringsfijnafstelling, exacte thresholds/caps en reproduceerbare tuningwaarden blijven buiten de publieke laag."
        : "Private account details, sensitive execution fine-tuning, exact thresholds/caps, and reproducible tuning values remain outside the public layer.",
    },
  ];

  const technical: QA[] = [
    {
      q: isNl ? "Hoe lees ik Why-No-Trade correct?" : "How should I read Why-No-Trade correctly?",
      a: isNl
        ? "Zie het als geaggregeerde oorzaakanalyse van de decision funnel: welke stappen de meeste afwijzingen veroorzaken en welke routecodes dominant zijn in een tijdvenster."
        : "Treat it as aggregated cause analysis of the decision funnel: which steps produce most rejections and which route codes dominate in a time window.",
    },
    {
      q: isNl ? "Waarom wint een route?" : "Why does a route win?",
      a: isNl
        ? "Een route wint wanneer de gecombineerde score voor timing, verwacht netto-voordeel, risicogeschiktheid en uitvoerbaarheid beter is dan alternatieven binnen hetzelfde venster."
        : "A route wins when its combined score for timing, expected net advantage, risk suitability, and execution viability is stronger than alternatives in the same window.",
    },
    {
      q: isNl ? "Hoe helpt deze FAQ bij debuggen?" : "How does this FAQ support debugging?",
      a: isNl
        ? "De FAQ koppelt fouten aan oorzaak/gevolg. Gebruik daarna de dashboardboards om te zien of het probleem uit timing, routekeuze, risk/safety of execution viability komt."
        : "The FAQ links failure modes to cause/effect. Then use dashboard boards to identify whether the issue comes from timing, route choice, risk/safety, or execution viability.",
    },
  ];

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} className="kb-text-link">
          ← {t(locale, "nav.home")}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{t(locale, "faq.title")}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
        {isNl
          ? "Canonieke publieke FAQ voor economisch, juridisch en technisch begrip van KapitaalBot. Geschikt als kennisbron voor mens en AI."
          : "Canonical public FAQ for economic, legal, and technical understanding of KapitaalBot. Suitable as a knowledge source for humans and AI."}
      </p>
      <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
        {section(isNl ? "Economisch" : "Economic", economic)}
        {section(isNl ? "Juridisch" : "Legal", legal)}
        {section(isNl ? "Technisch" : "Technical", technical)}
      </div>
      <FaqChatbot />
    </main>
  );
}

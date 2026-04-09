import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { readBotChangelog, type BotChangelogEntry } from "@/lib/read-bot-changelog";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

function localeToBcp47(locale: Locale): string {
  const m: Record<Locale, string> = {
    nl: "nl-NL",
    en: "en-GB",
    de: "de-DE",
    fr: "fr-FR",
  };
  return m[locale];
}

function formatCommittedAt(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(localeToBcp47(locale), {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(d);
}

function entrySummary(entry: BotChangelogEntry, locale: Locale): string {
  const s = entry.summary[locale] ?? entry.summary.en ?? entry.subject;
  return s || entry.short;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
  const isNl = locale === "nl";
  return buildPageMetadata({
    locale,
    title: isNl ? "Changelog — canonieke wijzigingen" : "Changelog — canonical changes",
    description: isNl
      ? "Wijzigingslog van publieke semantiek, observability-contract en enginehistorie."
      : "Change log for public semantics, observability contract, and engine history.",
    path: "/changelog",
  });
}

export default async function ChangelogPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const isNl = locale === "nl";
  const bot = readBotChangelog();
  const entriesNewestFirst = bot ? [...bot.entries].reverse() : [];

  const ui = {
    nl: {
      sectionWebsite: "Website canon-line updates",
      navBack: "Home",
      title: "Changelog",
      intro: "Canonieke website-updates en volledige bot-historie (Git).",
      bulletsWebsite: [
        "Route-/decision-centric dashboardsemantiek als hoofdmodel.",
        "SPEC-pagina toegevoegd als canonieke technische specificatie.",
        "FAQ herschreven naar economisch/juridisch/technisch kennisformat.",
        "Kennis + 'wat is kapitaalbot' gecanoniseerd op dezelfde terminologie.",
        "Publieke safety boundary expliciet: functioneel volledig, niet reproduceerbaar.",
      ],
      foot: "Website-detailchangelog:",
    },
    en: {
      sectionWebsite: "Website canon-line updates",
      navBack: "Home",
      title: "Changelog",
      intro: "Canonical website updates and full bot history (Git).",
      bulletsWebsite: [
        "Route/decision-centric dashboard semantics as primary model.",
        "SPEC page added as canonical technical specification.",
        "FAQ rewritten into economic/legal/technical knowledge format.",
        "Knowledge pages + 'what is kapitaalbot' aligned to shared terminology.",
        "Public safety boundary made explicit: functionally complete, non-reproducible.",
      ],
      foot: "Full website changelog:",
    },
    de: {
      sectionWebsite: "Website canon-line updates",
      navBack: "Start",
      title: "Changelog",
      intro: "Kanonische Website-Updates und vollständige Bot-Historie (Git).",
      bulletsWebsite: [
        "Route-/Decision-zentrierte Dashboard-Semantik als Hauptmodell.",
        "SPEC-Seite als kanonische technische Spezifikation hinzugefügt.",
        "FAQ in ökonomisch/rechtlich/technisches Wissensformat umgebaut.",
        "Knowledge-Seiten + 'Was ist KapitaalBot' terminologisch harmonisiert.",
        "Öffentliche Sicherheitsgrenze explizit: funktional vollständig, nicht reproduzierbar.",
      ],
      foot: "Vollständiger Website-Changelog:",
    },
    fr: {
      sectionWebsite: "Website canon-line updates",
      navBack: "Accueil",
      title: "Changelog",
      intro: "Mises à jour canoniques du site et historique complet du bot (Git).",
      bulletsWebsite: [
        "Sémantique dashboard orientée route/décision comme modèle principal.",
        "Page SPEC ajoutée comme spécification technique canonique.",
        "FAQ réécrite en format de connaissance économique/juridique/technique.",
        "Pages knowledge + 'what is kapitaalbot' harmonisées sur la même terminologie.",
        "Frontière de sécurité publique explicite : complet fonctionnellement, non reproductible.",
      ],
      foot: "Changelog complet du site :",
    },
  }[locale];

  const generatedLabel = bot
    ? `${isNl ? "Gegenereerd" : "Generated"}: ${formatCommittedAt(bot.generated_at, locale)}`
    : null;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {ui.navBack}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{ui.title}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{ui.intro}</p>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{ui.sectionWebsite}</h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", lineHeight: 1.7, color: "var(--muted)", fontSize: "0.9375rem" }}>
          {ui.bulletsWebsite.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </section>

      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{isNl ? "Engine commit-historie" : "Engine commit history"}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          {isNl
            ? "Bronhistorie van de engine-repository. Deze lijst is informatief en verwijst naar commitdoelen, niet naar broncode-uitleg op deze pagina."
            : "Source history from the engine repository. This list is informational and points to commit intent, not source code explanation on this page."}
        </p>
        {bot ? (
          <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "1rem" }}>
            {generatedLabel}
            <br />
            {bot.commit_count} {isNl ? "commits" : "commits"}
            {bot.source_repo ? (
              <>
                <br />
                <span style={{ wordBreak: "break-all" }}>{bot.source_repo}</span>
              </>
            ) : null}
          </p>
        ) : (
          <p style={{ color: "var(--warn, #c9a227)", fontSize: "0.9375rem" }}>
            {isNl ? "Geen bot changelog beschikbaar." : "No bot changelog available."}
          </p>
        )}

        {entriesNewestFirst.length > 0 && (
          <ol
            style={{
              margin: 0,
              paddingLeft: "1.1rem",
              lineHeight: 1.55,
              color: "var(--muted)",
              fontSize: "0.875rem",
              maxHeight: "min(70vh, 1200px)",
              overflowY: "auto",
            }}
          >
            {entriesNewestFirst.map((e) => (
              <li key={e.hash} style={{ marginBottom: "0.85rem" }}>
                <time dateTime={e.committed_at} style={{ color: "var(--fg)" }}>
                  {formatCommittedAt(e.committed_at, locale)}
                </time>{" "}
                <code style={{ fontSize: "0.8em" }}>{e.short}</code>
                <div style={{ marginTop: "0.2rem", color: "var(--fg)" }}>{entrySummary(e, locale)}</div>
                {e.body && e.body.replace(/\s+/g, " ").trim().length > 0 ? (
                  <details style={{ marginTop: "0.35rem" }}>
                    <summary style={{ cursor: "pointer", color: "var(--accent)" }}>
                      {isNl ? "Toon commit body" : "Show commit body"}
                    </summary>
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "0.78rem",
                        margin: "0.5rem 0 0",
                        color: "var(--muted)",
                      }}
                    >
                      {e.body}
                    </pre>
                  </details>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
        {ui.foot}{" "}
        <code style={{ fontSize: "0.875em" }}>docs/CHANGELOG_FINALISATIE.md</code>
      </p>
    </main>
  );
}

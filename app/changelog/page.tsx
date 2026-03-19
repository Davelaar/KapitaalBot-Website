import Link from "next/link";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, t } from "@/lib/i18n";
import { readBotChangelog, type BotChangelogEntry } from "@/lib/read-bot-changelog";

export const dynamic = "force-dynamic";

function getLocaleFromCookieStore(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Locale {
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

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

export async function generateMetadata() {
  return {};
}

export default async function ChangelogPage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieStore(cookieStore);
  const bot = readBotChangelog();
  const entriesNewestFirst = bot ? [...bot.entries].reverse() : [];

  const ui = {
    nl: {
      sectionWebsite: "Website (maart 2026)",
      navBack: "Home",
      title: "Changelog",
      intro: "Website-updates en volledige bot-historie (Git).",
      bulletsWebsite: [
        "Changelog-pagina; navigatie.",
        "Freshness-indicator (GOOD/WARN/STALE), null handling.",
        "Dashboard: metric cards, sorteerbare markttabel, regime stacked bar.",
        'Homepage: hero, Waarom / Hoe observability, Tier-model.',
        "Tier2-aanvraag: POST /api/tier2-request, rate limit.",
        "Compliance-banner per taal (cookie).",
        "Admin: snapshot-status + raw JSON (Tier 3).",
        "SEO: OG/twitter, robots, sitemap, JSON-LD.",
        "Error boundaries (error.tsx, global-error.tsx).",
      ],
      foot: "Website-detailchangelog:",
    },
    en: {
      sectionWebsite: "Website (March 2026)",
      navBack: "Home",
      title: "Changelog",
      intro: "Website updates and full bot history (Git).",
      bulletsWebsite: [
        "Changelog page; navigation.",
        "Freshness indicator (GOOD/WARN/STALE), null handling.",
        "Dashboard: metric cards, sortable market table, regime stacked bar.",
        "Homepage: hero, Why / How observability, Tier model.",
        "Tier2 request: POST /api/tier2-request, rate limit.",
        "Compliance banner per language (cookie).",
        "Admin: snapshot status + raw JSON (Tier 3).",
        "SEO: OG/twitter, robots, sitemap, JSON-LD.",
        "Error boundaries (error.tsx, global-error.tsx).",
      ],
      foot: "Full website changelog:",
    },
    de: {
      sectionWebsite: "Website (März 2026)",
      navBack: "Start",
      title: "Changelog",
      intro: "Website-Updates und vollständige Bot-Historie (Git).",
      bulletsWebsite: [
        "Changelog-Seite; Navigation.",
        "Freshness-Indikator (GOOD/WARN/STALE), Null-Handling.",
        "Dashboard: Metrik-Karten, sortierbare Markttabelle, Regime-Stacked-Bar.",
        "Homepage: Hero, Warum / Wie Observability, Tier-Modell.",
        "Tier2-Anfrage: POST /api/tier2-request, Rate-Limit.",
        "Compliance-Banner pro Sprache (Cookie).",
        "Admin: Snapshot-Status + Raw-JSON (Tier 3).",
        "SEO: OG/Twitter, robots, Sitemap, JSON-LD.",
        "Error Boundaries (error.tsx, global-error.tsx).",
      ],
      foot: "Vollständiger Website-Changelog:",
    },
    fr: {
      sectionWebsite: "Site (mars 2026)",
      navBack: "Accueil",
      title: "Changelog",
      intro: "Mises à jour du site et historique complet du bot (Git).",
      bulletsWebsite: [
        "Page Changelog ; navigation.",
        "Indicateur de fraîcheur (GOOD/WARN/STALE), gestion des null.",
        "Dashboard : cartes métriques, tableau marché triable, barres par régime.",
        "Accueil : hero, Pourquoi / Comment l’observabilité, modèle par tier.",
        "Demande Tier2 : POST /api/tier2-request, rate limit.",
        "Bannière compliance par langue (cookie).",
        "Admin : statut snapshot + JSON brut (Tier 3).",
        "SEO : OG/twitter, robots, sitemap, JSON-LD.",
        "Error boundaries (error.tsx, global-error.tsx).",
      ],
      foot: "Changelog complet du site :",
    },
  }[locale];

  const generatedLabel = bot
    ? `${t(locale, "changelog.bot.generated")}: ${formatCommittedAt(bot.generated_at, locale)}`
    : null;

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>
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
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{t(locale, "changelog.bot.title")}</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.9375rem", marginBottom: "0.75rem", lineHeight: 1.6 }}>
          {t(locale, "changelog.bot.intro")}
        </p>
        {bot ? (
          <p style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "1rem" }}>
            {generatedLabel}
            <br />
            {bot.commit_count} {t(locale, "changelog.bot.commits")}
            {bot.source_repo ? (
              <>
                <br />
                <span style={{ wordBreak: "break-all" }}>{bot.source_repo}</span>
              </>
            ) : null}
          </p>
        ) : (
          <p style={{ color: "var(--warn, #c9a227)", fontSize: "0.9375rem" }}>{t(locale, "changelog.bot.empty")}</p>
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
                      {t(locale, "changelog.bot.moreBody")}
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

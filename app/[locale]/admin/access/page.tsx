import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import { readTier2Requests } from "@/lib/tier2-requests";
import { Tier2RequestsAdmin } from "@/components/Tier2RequestsAdmin";
import type { Locale } from "@/lib/i18n";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export default async function AdminAccessPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const tier = await getSessionTier();

  if (tier < 3) {
    return <TierGate kind="tier3" locale={locale} />;
  }

  const rows = readTier2Requests();
  const sorted = [...rows].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Link href={withLocale(locale, "/admin")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {locale === "nl" ? "Admin" : locale === "en" ? "Admin" : locale === "de" ? "Admin" : "Admin"}
        </Link>
        <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {locale === "nl" ? "Dashboard" : locale === "en" ? "Dashboard" : locale === "de" ? "Dashboard" : "Dashboard"}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        {locale === "nl"
          ? "Admin — Toegang & aanvragen"
          : locale === "en"
            ? "Admin — Access & requests"
            : locale === "de"
              ? "Admin — Zugriff & Anfragen"
              : "Admin — Accès & demandes"}
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.25rem" }}>
        {locale === "nl"
          ? 'Overzicht van Tier 2-aanvragen. Bij goedkeuring wordt de aanvraag gemarkeerd als "goedgekeurd" en (optioneel) wordt een e-mail/webhook getriggerd met login-instructies.'
          : locale === "en"
            ? 'Overview of Tier 2 requests. When approved, the request is marked as "approved" and (optionally) an email/webhook is triggered with login instructions.'
            : locale === "de"
              ? 'Übersicht über Tier-2-Anfragen. Bei Genehmigung wird die Anfrage als "genehmigt" markiert und (optional) eine E-Mail/Webhook mit Login-Anweisungen ausgelöst.'
              : 'Aperçu des demandes Tier 2. Lors de l’approbation, la demande est marquée "approuvé" et (optionnellement) un e-mail/webhook est déclenché avec des instructions de connexion.'}
      </p>
      <Tier2RequestsAdmin initialRequests={sorted} />
    </main>
  );
}

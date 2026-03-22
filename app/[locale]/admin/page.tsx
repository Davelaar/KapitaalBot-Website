import Link from "next/link";
import { getSessionTier } from "@/lib/auth";
import { TierGate } from "@/components/TierGate";
import {
  getPublicStatusSnapshotCached,
  getPublicRegimeSnapshotCached,
  getPublicStrategySnapshotCached,
  getPublicTradingSnapshotCached,
  getPublicMarketSnapshotCached,
} from "@/lib/read-snapshots-cached";
import { AdminSnapshotStatus } from "@/components/AdminSnapshotStatus";
import type { Locale } from "@/lib/i18n";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const tier = await getSessionTier();

  if (tier < 3) {
    return <TierGate kind="tier3" locale={locale} />;
  }

  const [status, regime, strategy, trading, market] = await Promise.all([
    getPublicStatusSnapshotCached(),
    getPublicRegimeSnapshotCached(),
    getPublicStrategySnapshotCached(),
    getPublicTradingSnapshotCached(),
    getPublicMarketSnapshotCached(),
  ]);

  const ui = {
    nl: {
      navDashboard: "Dashboard",
      title: "Admin — Full observability",
      intro: "Laatste snapshot-timestamps, run_id, epoch status, aanwezigheid market/trading. Raw JSON viewer.",
      linkAccess: "→ Tier 2-aanvragen & toegang",
      linkCms: "→ CMS-light editor (content + notes)",
    },
    en: {
      navDashboard: "Dashboard",
      title: "Admin — Full observability",
      intro: "Latest snapshot timestamps, run_id, epoch status, presence of market/trading. Raw JSON viewer.",
      linkAccess: "→ Tier 2 requests & access",
      linkCms: "→ CMS-light editor (content + notes)",
    },
    de: {
      navDashboard: "Dashboard",
      title: "Admin — Vollständige Observability",
      intro: "Letzte Snapshot-Timestamps, run_id, Epoch-Status, Vorhandensein von Market/Trading. Raw-JSON-Viewer.",
      linkAccess: "→ Tier 2-Anfragen & Zugriff",
      linkCms: "→ CMS-light Editor (Inhalt + Notizen)",
    },
    fr: {
      navDashboard: "Dashboard",
      title: "Admin — Observabilité complète",
      intro: "Derniers timestamps de snapshots, run_id, statut des epochs, présence market/trading. Visualiseur JSON brut.",
      linkAccess: "→ Demandes Tier 2 & accès",
      linkCms: "→ Éditeur CMS-light (contenu + notes)",
    },
  }[locale];

  return (
    <main>
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link href={withLocale(locale, "/dashboard")} style={{ color: "var(--accent)", textDecoration: "none" }}>
          ← {ui.navDashboard}
        </Link>
      </nav>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{ui.title}</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>{ui.intro}</p>
      <section
        className="card"
        style={{
          marginBottom: "1.5rem",
          padding: "1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
        }}
      >
        <Link href={withLocale(locale, "/admin/access")} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
          {ui.linkAccess}
        </Link>
        <Link href={withLocale(locale, "/admin/cms")} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
          {ui.linkCms}
        </Link>
      </section>
      <AdminSnapshotStatus
        status={status}
        regime={regime}
        strategy={strategy}
        trading={trading}
        market={market}
      />
    </main>
  );
}

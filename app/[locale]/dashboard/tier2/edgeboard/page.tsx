import { TierGate } from "@/components/TierGate";
import { DashboardTier2EdgeboardContent } from "@/components/DashboardTier2EdgeboardContent";
import { getSessionTier } from "@/lib/auth";
import { parseLocaleParam } from "@/lib/locale-path";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getTier2DataBundleCached } from "@/lib/read-snapshots-cached";
import type { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale) as Locale;
  return buildPageMetadata({
    locale,
    title: "Edgeboard Tier 2 — KapitaalBot",
    description:
      "Operationeel edgeboard-overzicht met DB precheck, meta, ranked snapshots, candidates en training-context voor expected edge, confidence en freshness.",
    path: "/dashboard/tier2/edgeboard",
  });
}

export default async function DashboardTier2EdgeboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale) as Locale;
  const tier = await getSessionTier();
  if (tier < 2) {
    return <TierGate kind="tier2" locale={locale} />;
  }

  const dataBundle = await getTier2DataBundleCached();

  return (
    <main>
      <DashboardTier2EdgeboardContent dataBundle={dataBundle} />
    </main>
  );
}

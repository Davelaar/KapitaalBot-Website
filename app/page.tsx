import {
  getPublicStatusSnapshot,
  getPublicRegimeSnapshot,
  getPublicStrategySnapshot,
  getPublicTradingSnapshot,
  getPublicDemoTrades,
} from "@/lib/read-snapshots";
import { getCmsData, getProductionNotes } from "@/lib/read-cms";
import { HomePageContent } from "@/components/HomePageContent";
import { getLocaleFromCookies } from "@/lib/locale-server";
import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildPageMetadata({
    locale,
    title: t(locale, "seo.home.metaTitle"),
    description: t(locale, "seo.home.metaDesc"),
    path: "/",
    keywords: t(locale, "seo.home.keywords"),
  });
}

export default async function HomePage() {
  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();
  const demo = getPublicDemoTrades();
  const productionNotes = getProductionNotes();
  const cms = getCmsData();
  const notices = cms?.notices ?? [];

  return (
    <main>
      <HomePageContent
        status={status}
        regime={regime}
        strategy={strategy}
        trading={trading}
        demo={demo}
        productionNotes={productionNotes}
        notices={notices}
      />
    </main>
  );
}

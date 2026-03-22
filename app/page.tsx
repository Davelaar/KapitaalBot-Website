import {
  getPublicStatusSnapshotCached,
  getPublicRegimeSnapshotCached,
  getPublicStrategySnapshotCached,
  getPublicTradingSnapshotCached,
  getPublicDemoTradesCached,
} from "@/lib/read-snapshots-cached";
import { getCmsDataCached, getProductionNotesCached } from "@/lib/read-cms-cached";
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
  const [status, regime, strategy, trading, demo, productionNotes, cms] = await Promise.all([
    getPublicStatusSnapshotCached(),
    getPublicRegimeSnapshotCached(),
    getPublicStrategySnapshotCached(),
    getPublicTradingSnapshotCached(),
    getPublicDemoTradesCached(),
    getProductionNotesCached(),
    getCmsDataCached(),
  ]);
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

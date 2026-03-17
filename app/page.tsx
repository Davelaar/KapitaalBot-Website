import {
  getPublicStatusSnapshot,
  getPublicRegimeSnapshot,
  getPublicStrategySnapshot,
  getPublicTradingSnapshot,
  getPublicDemoTrades,
} from "@/lib/read-snapshots";
import { getProductionNotes } from "@/lib/read-cms";
import { HomePageContent } from "@/components/HomePageContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const status = getPublicStatusSnapshot();
  const regime = getPublicRegimeSnapshot();
  const strategy = getPublicStrategySnapshot();
  const trading = getPublicTradingSnapshot();
  const demo = getPublicDemoTrades();
  const productionNotes = getProductionNotes();

  return (
    <main>
      <HomePageContent
        status={status}
        regime={regime}
        strategy={strategy}
        trading={trading}
        demo={demo}
        productionNotes={productionNotes}
      />
    </main>
  );
}

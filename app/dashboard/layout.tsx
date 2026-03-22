import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { getLocaleFromCookies } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const title = `${t(locale, "nav.data")} — KapitaalBot`;
  const description = `${t(locale, "dashboard.intro")} ${t(locale, "dashboard.intro2")}`;
  return buildPageMetadata({
    locale,
    title,
    description,
    path: "/dashboard",
  });
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

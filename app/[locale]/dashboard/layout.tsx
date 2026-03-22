import { t } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/page-metadata";
import { parseLocaleParam } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const locale = parseLocaleParam(params.locale);
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

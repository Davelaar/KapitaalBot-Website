import { redirect } from "next/navigation";
import { parseLocaleParam, withLocale } from "@/lib/locale-path";

export const dynamic = "force-dynamic";

export default async function Tier2DocsPage({ params }: { params: { locale: string } }) {
  const locale = parseLocaleParam(params.locale);
  redirect(withLocale(locale, "/docs"));
}

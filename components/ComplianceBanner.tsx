import { cookies } from "next/headers";
import { getCmsData } from "@/lib/read-cms";
import { defaultLocale, t, type Locale } from "@/lib/i18n";

function getLocaleFromCookieStore(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Locale {
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

export default async function ComplianceBanner() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieStore(cookieStore);

  const cms = getCmsData();
  const override = cms?.compliance_override?.trim() ?? "";
  const content = override ? override : t(locale, "compliance.default");

  return (
    <aside className="compliance-banner" role="note" aria-label={t(locale, "compliance.ariaLabel")}>
      <div className="compliance-banner__inner">
        <strong>{content}</strong>
      </div>
    </aside>
  );
}

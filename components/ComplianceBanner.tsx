import { getCmsDataCached } from "@/lib/read-cms-cached";
import { t, type Locale } from "@/lib/i18n";

export default async function ComplianceBanner({ locale }: { locale: Locale }) {
  const cms = await getCmsDataCached();
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

import { t, type Locale } from "@/lib/i18n";

const BUNQ_DONATE_URL = "https://bunq.me/kapitaalbot";

/**
 * Fixed viewport CTA outside scroll/flex columns: wrapper is pointer-events-none
 * except on the link, so layout ancestors cannot swallow interaction.
 */
export function DonateFloatingCta({ locale }: { locale: Locale }) {
  return (
    <div className="kb-donate-fab-anchor" data-kb-donate-anchor>
      <a
        href={BUNQ_DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="kb-donate-fab"
        aria-label={t(locale, "donate.ariaLabel")}
      >
        {t(locale, "donate.cta")}
      </a>
    </div>
  );
}

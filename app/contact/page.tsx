import { cookies } from "next/headers";
import { ContactPageContent } from "@/components/ContactPageContent";
import type { Locale } from "@/lib/i18n";
import { defaultLocale, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function localeFromCookies(cookieStore: Awaited<ReturnType<typeof cookies>>): Locale {
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = localeFromCookies(cookieStore);
  return {
    title: `${t(locale, "contact.title")} — KapitaalBot`,
    description: t(locale, "contact.metaDescription"),
  };
}

export default function ContactPage() {
  return <ContactPageContent />;
}

import { cookies } from "next/headers";
import { defaultLocale, type Locale } from "@/lib/i18n";

export async function getLocaleFromCookies(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("NEXT_LOCALE")?.value;
  if (raw && ["nl", "en", "de", "fr"].includes(raw)) return raw as Locale;
  return defaultLocale;
}

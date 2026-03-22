import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://kapitaalbot.nl"),
};

function localeFromHeader(): Locale {
  const raw = headers().get("x-kb-locale");
  if (raw && locales.includes(raw as Locale)) return raw as Locale;
  return defaultLocale;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = localeFromHeader();
  return (
    <html lang={lang} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale } from "@/lib/i18n";
import { isLocale } from "@/lib/locale-path";

const LOCALE_HEADER = "x-kb-locale";

function isStaticOrSpecial(pathname: string): boolean {
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next")) return true;
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  const last = pathname.split("/").pop() || "";
  if (last.includes(".")) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticOrSpecial(pathname)) {
    return NextResponse.next();
  }

  const first = pathname.split("/").filter(Boolean)[0];

  if (!first || !isLocale(first)) {
    const url = request.nextUrl.clone();
    const rest = pathname === "/" ? "" : pathname;
    url.pathname = `/${defaultLocale}${rest}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, first);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr).*)"],
};

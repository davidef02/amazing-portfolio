import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

// Ogni pagina frontend vive sotto /[locale]. Se manca il prefisso di locale
// (es. "/"), redirect alla locale di default (en). admin/api/asset esclusi dal matcher.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // salta admin e api di Payload, gli interni di Next e i file statici (con estensione)
  matcher: ["/((?!admin|api|_next|_static|.*\\..*).*)"],
};

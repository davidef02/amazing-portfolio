import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";
import { getServerSideURL } from "@/utilities/getURL";

// Sitemap nativa Next (serve /sitemap.xml). Le pagine vivono sotto /[locale]:
// emetto /en e /it con alternateRefs hreflang reciproci + x-default sulla defaultLocale.
// L'URL base viene da NEXT_PUBLIC_SERVER_URL (env, letta a build-time).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getServerSideURL();

  const languages = {
    ...Object.fromEntries(locales.map((l) => [l, `${base}/${l}`])),
    "x-default": `${base}/${defaultLocale}`,
  };

  return locales.map((l) => ({
    url: `${base}/${l}`,
    changeFrequency: "monthly",
    priority: l === defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}

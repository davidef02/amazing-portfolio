import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/i18n/config";
import { getServerSideURL } from "@/utilities/getURL";

// Sitemap nativa Next (serve /sitemap.xml). Le pagine vivono sotto /[locale]:
// per ogni pagina emetto una entry per locale con alternateRefs hreflang reciproci
// + x-default sulla defaultLocale. L'URL base da NEXT_PUBLIC_SERVER_URL (env, build-time).
// `path` "" = home; aggiungere qui ogni nuova pagina statica sotto /[locale].
const PAGES: { path: string; changeFrequency: "monthly" | "yearly"; priority: number }[] = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getServerSideURL();

  return PAGES.flatMap(({ path, changeFrequency, priority }) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, `${base}/${l}${path}`])),
      "x-default": `${base}/${defaultLocale}${path}`,
    };

    return locales.map((l) => ({
      url: `${base}/${l}${path}`,
      changeFrequency,
      // home: default locale un filo più alta; le altre pagine tengono la priority indicata
      priority: path === "" && l !== defaultLocale ? 0.9 : priority,
      alternates: { languages },
    }));
  });
}

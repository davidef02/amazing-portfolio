import type { Metadata } from "next";
import { cn } from "@/utilities/ui";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import React, { cache } from "react";
import { Analytics } from "@vercel/analytics/next";
import Toaster from "@/components/Toaster";
import HashScroll from "@/components/HashScroll";
import "./globals.css";
import { getServerSideURL } from "@/utilities/getURL";
import { getPayload } from "payload";
import config from "@payload-config";
import { locales, defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

// siteConfig serve sia in generateMetadata che nel layout: fetch localizzato una
// volta per locale (React cache dedup per argomento).
const getSiteConfig = cache(async (locale: Locale) => {
  const payload = await getPayload({ config });
  return await payload.findGlobal({ slug: "siteConfig", depth: 1, locale });
});

const OG_LOCALE: Record<Locale, string> = { en: "en_US", it: "it_IT" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const siteConfig = await getSiteConfig(locale);
  const serverURL = getServerSideURL();

  const shareImage =
    typeof siteConfig.seo.metaImage === "object" && siteConfig.seo.metaImage
      ? siteConfig.seo.metaImage.url
      : undefined;

  const faviconUrl =
    typeof siteConfig.favicon === "object" && siteConfig.favicon
      ? siteConfig.favicon.url
      : undefined;

  const canonical = `${serverURL}/${locale}`;

  return {
    metadataBase: new URL(serverURL),
    title: siteConfig.seo.metaTitle,
    description: siteConfig.seo.metaDescription,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${serverURL}/${l}`])),
        "x-default": `${serverURL}/${defaultLocale}`,
      },
    },
    icons: faviconUrl ? { icon: faviconUrl } : undefined,

    openGraph: {
      title: siteConfig.seo.metaTitle,
      description: siteConfig.seo.metaDescription,
      url: canonical,
      siteName: siteConfig.siteTitle,
      type: "website",
      locale: OG_LOCALE[locale],
      images: shareImage
        ? [
            {
              url: shareImage,
              width: 1200,
              height: 630,
              alt: siteConfig.seo.metaTitle,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: siteConfig.seo.metaTitle,
      description: siteConfig.seo.metaDescription,
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const siteConfig = await getSiteConfig(locale);

  const hexes = siteConfig.colors?.selection ?? {};
  const mainColor = siteConfig.colors?.mainColor ?? "yellow";

  // inietto gli hex del tema (SiteConfig) come CSS var, sovrascrivono i fallback in globals.css
  const colors = {
    "--yellow": hexes.yellow,
    "--green": hexes.green,
    "--red": hexes.red,
    "--blue": hexes.blue,
    "--main": `var(--${mainColor})`,
  } as React.CSSProperties;

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={locale}
      data-scroll-behavior="smooth"
    >
      <body style={colors}>
        {children}
        <Toaster />
        <HashScroll />
        <Analytics />
      </body>
    </html>
  );
}

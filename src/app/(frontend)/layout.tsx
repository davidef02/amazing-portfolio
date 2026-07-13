import type { Metadata } from "next";
import { cn } from "@/utilities/ui";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import React, { cache } from "react";
import { AdminBar } from "@/components/AdminBar";
import { draftMode } from "next/headers";
import "./globals.css";
import { getServerSideURL } from "@/utilities/getURL";
import { getPayload } from "payload";
import config from "@payload-config";

// dato che siteconfig serve sia in generate metadata che rootlayout, faccio l'operazione
// una singola volta e la salvo in cache
const getSiteConfig = cache(async () => {
  const payload = await getPayload({ config });
  return await payload.findGlobal({ slug: "siteConfig", depth: 1 });
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  const shareImage =
    typeof siteConfig.seo.metaImage === "object" && siteConfig.seo.metaImage
      ? siteConfig.seo.metaImage.url
      : undefined;

  return {
    metadataBase: new URL(getServerSideURL()),
    title: siteConfig.seo.metaTitle,
    description: siteConfig.seo.metaDescription,
    alternates: { canonical: siteConfig.seo.metaLink },

    openGraph: {
      title: siteConfig.seo.metaTitle,
      description: siteConfig.seo.metaDescription,
      url: siteConfig.seo.metaLink,
      siteName: siteConfig.siteTitle,
      type: "website",
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();
  const siteConfig = await getSiteConfig();

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
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en">
      <body style={colors}>
        <AdminBar
          adminBarProps={{
            preview: isEnabled,
          }}
        />
        {children}
      </body>
    </html>
  );
}

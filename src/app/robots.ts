import type { MetadataRoute } from "next";
import { getServerSideURL } from "@/utilities/getURL";

// robots.txt nativo Next. Blocca admin/api, punta alla sitemap.
export default function robots(): MetadataRoute.Robots {
  const base = getServerSideURL();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}

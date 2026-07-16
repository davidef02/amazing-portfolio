const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

const LOCALES = ['en', 'it']
const DEFAULT_LOCALE = 'en'

const alternateRefs = [
  ...LOCALES.map((l) => ({ href: `${SITE_URL}/${l}`, hreflang: l })),
  { href: `${SITE_URL}/${DEFAULT_LOCALE}`, hreflang: 'x-default' },
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // le rotte /[locale] sono dinamiche: l'auto-discovery non le espande in /en /it,
  // quindi le fornisco esplicitamente con gli alternateRefs hreflang reciproci.
  additionalPaths: async () =>
    LOCALES.map((l) => ({
      loc: `/${l}`,
      changefreq: 'monthly',
      priority: l === DEFAULT_LOCALE ? 1.0 : 0.9,
      lastmod: new Date().toISOString(),
      alternateRefs,
    })),
  // escludi admin/api e il placeholder dinamico dall'auto-discovery
  exclude: ['/admin', '/admin/*', '/api', '/api/*', '/[locale]', '/[locale]/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
  },
}

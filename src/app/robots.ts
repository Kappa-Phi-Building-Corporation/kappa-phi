import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kappa-phi.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/portal',
          '/profile',
          '/alumni/directory',
          '/alumni/tree',
          '/alumni/chapter-eternal',
          '/auth/',
          '/search',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

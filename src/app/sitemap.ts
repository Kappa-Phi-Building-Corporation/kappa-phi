import type { MetadataRoute } from 'next'
import { getSiteContent } from '@/lib/siteContent'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kappa-phi.org'

type Route = { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }

// Public, unauthenticated marketing pages only — member portal pages
// (/portal, /profile, /alumni/directory, /alumni/tree, /alumni/chapter-eternal)
// require login and aren't useful to search engines.
const routes: Route[] = [
  { path: '',                        changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/about',                  changeFrequency: 'monthly', priority: 0.8 },
  { path: '/board',                  changeFrequency: 'monthly', priority: 0.7 },
  { path: '/donations',              changeFrequency: 'monthly', priority: 0.7 },
  { path: '/donations/byron',        changeFrequency: 'yearly',  priority: 0.5 },
  { path: '/donations/scholarship',  changeFrequency: 'yearly',  priority: 0.5 },
  { path: '/newsletters',            changeFrequency: 'monthly', priority: 0.6 },
  { path: '/events',                 changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/contact',                changeFrequency: 'yearly',  priority: 0.6 },
  { path: '/alumni',                 changeFrequency: 'monthly', priority: 0.6 },
  { path: '/login',                  changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/register',               changeFrequency: 'yearly',  priority: 0.3 },
]

// Reads admin-toggled settings from the database, so it must render per request
// rather than being prerendered at build time (CI builds have no database
// credentials, and a build-time snapshot would ignore later admin changes).
export const dynamic = 'force-dynamic'

// Pages an admin can switch off under Homepage & About Content are only listed while shown.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent()
  const all: Route[] = [
    ...routes,
    ...(content.campaign_enabled === 'true' ? [{ path: '/campaign', changeFrequency: 'weekly' as const, priority: 0.8 }] : []),
    ...(content.property_page_enabled === 'true' ? [{ path: '/property', changeFrequency: 'monthly' as const, priority: 0.6 }] : []),
  ]
  const lastModified = new Date()
  return all.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}

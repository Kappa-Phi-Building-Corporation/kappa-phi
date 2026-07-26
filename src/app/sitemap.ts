import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kappa-phi.org'

// Public, unauthenticated marketing pages only — member portal pages
// (/portal, /profile, /alumni/directory, /alumni/tree, /alumni/chapter-eternal)
// require login and aren't useful to search engines.
const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '',                        changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/about',                  changeFrequency: 'monthly', priority: 0.8 },
  { path: '/board',                  changeFrequency: 'monthly', priority: 0.7 },
  { path: '/property',               changeFrequency: 'monthly', priority: 0.6 },
  { path: '/donations',              changeFrequency: 'monthly', priority: 0.7 },
  { path: '/donations/byron',        changeFrequency: 'yearly',  priority: 0.5 },
  { path: '/donations/scholarship',  changeFrequency: 'yearly',  priority: 0.5 },
  { path: '/events',                 changeFrequency: 'weekly',  priority: 0.7 },
  { path: '/contact',                changeFrequency: 'yearly',  priority: 0.6 },
  { path: '/alumni',                 changeFrequency: 'monthly', priority: 0.6 },
  { path: '/login',                  changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/register',               changeFrequency: 'yearly',  priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}

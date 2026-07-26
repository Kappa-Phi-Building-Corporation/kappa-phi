import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteContent } from '@/lib/siteContent'
import { updateSiteContent } from './actions'

export const metadata = { title: 'Homepage & About Content — Admin' }

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'
const textareaCls = inputCls + ' resize-y'

export default async function SiteContentPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { success, error } = await searchParams
  const content = await getSiteContent()

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Homepage &amp; About Content</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Edit the hero text, stats, and mission statement shown on the public homepage and About page.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            Changes saved.
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form action={updateSiteContent} className="space-y-8">
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white font-bold text-lg">Homepage</h2>

            <div>
              <label htmlFor="home_hero_badge" className={labelCls}>Hero Badge</label>
              <input id="home_hero_badge" name="home_hero_badge" defaultValue={content.home_hero_badge} className={inputCls} />
            </div>

            <div>
              <label htmlFor="home_hero_subtitle" className={labelCls}>Hero Subtitle</label>
              <textarea id="home_hero_subtitle" name="home_hero_subtitle" defaultValue={content.home_hero_subtitle} rows={3} className={textareaCls} />
            </div>

            <div>
              <label htmlFor="home_mission" className={labelCls}>Mission Statement</label>
              <textarea id="home_mission" name="home_mission" defaultValue={content.home_mission} rows={4} className={textareaCls} />
            </div>

            <div>
              <span className={labelCls}>Stats Bar</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([1, 2, 3, 4] as const).map(n => (
                  <div key={n} className="grid grid-cols-2 gap-2 bg-kp-dark border border-kp-border rounded-xl p-3">
                    <input
                      name={`home_stat_${n}_number`}
                      aria-label={`Stat ${n} number`}
                      defaultValue={content[`home_stat_${n}_number` as keyof typeof content]}
                      placeholder="Number"
                      className={inputCls}
                    />
                    <input
                      name={`home_stat_${n}_label`}
                      aria-label={`Stat ${n} label`}
                      defaultValue={content[`home_stat_${n}_label` as keyof typeof content]}
                      placeholder="Label"
                      className={inputCls}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-white font-bold text-lg">About Page</h2>
            <div>
              <label htmlFor="about_intro" className={labelCls}>Intro Paragraph</label>
              <textarea id="about_intro" name="about_intro" defaultValue={content.about_intro} rows={3} className={textareaCls} />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-kp-border">
            <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        </form>

        <Link href="/admin" className="text-gray-500 text-sm hover:text-gray-300 transition-colors no-underline">
          ← Back to Admin Dashboard
        </Link>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteContent } from '@/lib/siteContent'
import { updateCampaignSettings } from './actions'

export const metadata = { title: 'Capital Campaign & Giving Levels' }

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

export default async function AdminGivingLevelsPage({
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

  const [content, { data: levels }, { count: sectionCount }] = await Promise.all([
    getSiteContent(),
    admin
      .from('campaign_giving_levels')
      .select('id, name, amount_label, description, sort_order, is_published')
      .order('sort_order', { ascending: true }),
    admin.from('campaign_sections').select('*', { count: 'exact', head: true }),
  ])

  const rows = levels ?? []
  const { success, error } = await searchParams

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link href="/admin" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Admin Dashboard
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Capital Campaign &amp; Giving Levels</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Everything on the public <Link href="/campaign" className="text-kp-gold hover:underline">Campaign page</Link>: settings, the vision
            &amp; renderings, and the giving levels.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Level added.' : success === 'settings' ? 'Campaign settings saved.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Campaign settings */}
        <form action={updateCampaignSettings} encType="multipart/form-data" className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 space-y-5">
          <h2 className="text-white font-bold text-lg">Campaign Settings</h2>

          <div>
            <label htmlFor="campaign_enabled" className={labelCls}>Status</label>
            <select id="campaign_enabled" name="campaign_enabled" defaultValue={content.campaign_enabled} className={inputCls}>
              <option value="true">Published</option>
              <option value="false">Hidden (menu link, homepage section and page are removed)</option>
            </select>
          </div>

          <div>
            <label htmlFor="campaign_headline" className={labelCls}>Headline</label>
            <input id="campaign_headline" name="campaign_headline" defaultValue={content.campaign_headline} className={inputCls} />
          </div>

          <div>
            <label htmlFor="campaign_intro" className={labelCls}>Introduction</label>
            <textarea id="campaign_intro" name="campaign_intro" defaultValue={content.campaign_intro} rows={4} className={inputCls + ' resize-y'} />
          </div>

          <div>
            <span className={labelCls}>Hero Photo</span>
            <div className="flex items-start gap-4">
              <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden border border-kp-border bg-kp-card">
                <Image
                  src={content.campaign_hero_image || '/images/campaign/living-room.jpg'}
                  alt="Current campaign hero photo"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <input
                  name="hero_image"
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-kp-border file:bg-kp-card file:text-gray-300 file:text-xs file:font-medium hover:file:border-kp-gold hover:file:text-kp-gold file:transition-colors cursor-pointer"
                />
                <p className="text-gray-500 text-xs mt-1.5">Background image behind the headline. Leave empty to keep the current photo.</p>
              </div>
            </div>
          </div>

          <div>
            <span className={labelCls}>Progress</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="campaign_goal" className="block text-xs text-gray-500 mb-1">Fundraising goal ($)</label>
                <input id="campaign_goal" name="campaign_goal" defaultValue={content.campaign_goal} placeholder="e.g. 750000" inputMode="numeric" className={inputCls} />
              </div>
              <div>
                <label htmlFor="campaign_raised" className="block text-xs text-gray-500 mb-1">Total contributed ($)</label>
                <input id="campaign_raised" name="campaign_raised" defaultValue={content.campaign_raised} placeholder="e.g. 537055" inputMode="numeric" className={inputCls} />
              </div>
              <div>
                <label htmlFor="campaign_donors" className="block text-xs text-gray-500 mb-1">Number of donors</label>
                <input id="campaign_donors" name="campaign_donors" defaultValue={content.campaign_donors} placeholder="e.g. 40" inputMode="numeric" className={inputCls} />
              </div>
              <div>
                <label htmlFor="campaign_as_of" className="block text-xs text-gray-500 mb-1">Figures as of</label>
                <input id="campaign_as_of" name="campaign_as_of" defaultValue={content.campaign_as_of} placeholder="e.g. September 23, 2025" className={inputCls} />
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Shown on the homepage and Campaign page. Leave the goal blank to hide the progress bar, or the donor count blank to hide just that number.
            </p>
          </div>

          <div>
            <span className={labelCls}>Fundraising Contact</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input name="fundraising_contact_name" aria-label="Contact name" defaultValue={content.fundraising_contact_name} placeholder="Name or title" className={inputCls} />
              <input name="fundraising_contact_email" aria-label="Contact email" type="email" defaultValue={content.fundraising_contact_email} placeholder="Email" className={inputCls} />
              <input name="fundraising_contact_phone" aria-label="Contact phone" defaultValue={content.fundraising_contact_phone} placeholder="Phone (optional)" className={inputCls} />
            </div>
            <p className="text-gray-500 text-xs mt-2">Shown to donors on the Campaign and Donations pages. Leave the phone blank to omit it.</p>
          </div>

          <div>
            <label htmlFor="campaign_give_url" className={labelCls}>Give Online Link</label>
            <input id="campaign_give_url" name="campaign_give_url" type="url" defaultValue={content.campaign_give_url} className={inputCls} />
            <p className="text-gray-500 text-xs mt-1">
              Where the &quot;Give Online&quot; button, the QR code, and the Donations page &quot;Capital Campaign&quot; card all point.
            </p>
          </div>

          <div>
            <label htmlFor="campaign_give_blurb" className={labelCls}>Give Section Message</label>
            <textarea id="campaign_give_blurb" name="campaign_give_blurb" defaultValue={content.campaign_give_blurb} rows={3} className={inputCls + ' resize-y'} />
          </div>

          <div>
            <label htmlFor="campaign_gift_funds" className={labelCls}>&quot;What Your Gift Funds&quot; List</label>
            <textarea
              id="campaign_gift_funds"
              name="campaign_gift_funds"
              defaultValue={content.campaign_gift_funds}
              rows={6}
              placeholder={'One item per line, e.g.\nRenovated living room'}
              className={inputCls + ' resize-y'}
            />
            <p className="text-gray-500 text-xs mt-1">One item per line. Leave blank to hide this section entirely.</p>
          </div>

          <div>
            <label htmlFor="campaign_renderings_credit" className={labelCls}>Renderings Credit Line</label>
            <input id="campaign_renderings_credit" name="campaign_renderings_credit" defaultValue={content.campaign_renderings_credit} className={inputCls} />
            <p className="text-gray-500 text-xs mt-1">Small print under the renderings. Leave blank to omit it.</p>
          </div>

          <div className="flex justify-end pt-2 border-t border-kp-border">
            <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Save Campaign Settings
            </button>
          </div>
        </form>

        {/* Vision & renderings */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-white font-bold text-lg">Vision &amp; Renderings</h2>
            <p className="text-gray-500 text-xs mt-1">
              {sectionCount ?? 0} section{(sectionCount ?? 0) !== 1 ? 's' : ''} in &quot;What We&apos;re Building,&quot; each with its own photos.
            </p>
          </div>
          <Link
            href="/admin/campaign-sections"
            className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
            Manage Sections &amp; Photos →
          </Link>
        </div>

        {/* Giving levels */}
        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-lg">Giving Levels</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {rows.length} level{rows.length !== 1 ? 's' : ''} · donor names are entered on each level
              </p>
            </div>
            <Link
              href="/admin/giving-levels/new"
              className="shrink-0 bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
              + Add Level
            </Link>
          </div>

          <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
            {rows.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                No giving levels yet. The Campaign page hides this section until you add one.
              </div>
            ) : (
              <div className="divide-y divide-kp-border">
                {rows.map(l => (
                  <div key={l.id} className="flex items-center gap-4 px-5 py-4 hover:bg-kp-card/40 transition-colors">
                    <span className="text-kp-gold text-sm font-black w-28 shrink-0 tabular-nums">{l.amount_label}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-semibold truncate">{l.name}</span>
                        {!l.is_published && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700 shrink-0">Hidden</span>
                        )}
                      </div>
                      {l.description && <div className="text-gray-500 text-xs mt-0.5 truncate">{l.description}</div>}
                    </div>
                    <Link
                      href={`/admin/giving-levels/${l.id}`}
                      className="shrink-0 px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import PatsGuideForm from './PatsGuideForm'
import { updateGuide, addPhoto, deletePhoto } from './actions'

export const metadata = { title: "Booth's Guide to Pats" }

export default async function AdminPatsGuidePage({
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

  let { data: guide } = await admin
    .from('pats_guide')
    .select('id, title, intro, pdf_url')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  // Shouldn't normally happen (the migration seeds one row), but keep the
  // page usable if the table is ever empty.
  if (!guide) {
    const { data: created } = await admin
      .from('pats_guide')
      .insert({ title: "Booth's Guide to Pats" })
      .select('id, title, intro, pdf_url')
      .single()
    guide = created
  }

  const { data: sections } = await admin
    .from('pats_guide_sections')
    .select('id, title, slug, sort_order')
    .order('sort_order', { ascending: true })

  const { data: photos } = await admin
    .from('pats_guide_photos')
    .select('id, photo_url, caption, sort_order')
    .order('sort_order', { ascending: true })

  const { success, error } = await searchParams
  const updateThis = updateGuide.bind(null, guide!.id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Link href="/admin/portal" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Portal Resources
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Booth&apos;s Guide to Pats</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Editing the in-house St. Pat&apos;s guide shown at{' '}
            <Link href="/portal/pats-guide" className="text-kp-gold hover:underline">/portal/pats-guide</Link>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'saved' ? 'Changes saved.'
              : success === 'photo-added' ? 'Photo added.'
              : success === 'photo-removed' ? 'Photo removed.'
              : success === 'section-created' ? 'Section added.'
              : success === 'section-saved' ? 'Section saved.'
              : success === 'section-deleted' ? 'Section removed.'
              : 'Done.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8">
          <PatsGuideForm action={updateThis} guide={guide!} />
        </div>

        {/* Sections — the actual page content, edited one at a time */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-white font-bold text-lg mb-1">Sections</h2>
              <p className="text-gray-500 text-sm">
                Rendered in order on the guide page, with a jump-to link for each in the sidebar.
              </p>
            </div>
            <Link
              href="/admin/portal/pats-guide/sections/new"
              className="shrink-0 bg-kp-gold text-black font-bold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity no-underline">
              + Add Section
            </Link>
          </div>

          {sections && sections.length > 0 ? (
            <div className="divide-y divide-kp-border rounded-xl border border-kp-border overflow-hidden">
              {sections.map(s => (
                <Link
                  key={s.id}
                  href={`/admin/portal/pats-guide/sections/${s.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-kp-card/40 transition-colors no-underline"
                >
                  <span className="text-gray-500 text-xs font-mono w-8 shrink-0">{s.sort_order}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold truncate">{s.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5 truncate font-mono">#{s.slug}</div>
                  </div>
                  <span className="text-gray-500 text-xs shrink-0">Edit →</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500 text-sm border border-dashed border-kp-border rounded-xl">
              No sections yet.
            </div>
          )}
        </div>

        {/* Photo gallery — separate section, own forms, not nested inside PatsGuideForm's <form> */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-white font-bold text-lg mb-1">Photos</h2>
            <p className="text-gray-500 text-sm">Optional images shown in a gallery at the bottom of the guide page.</p>
          </div>

          {photos && photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photos.map(p => (
                <div key={p.id} className="space-y-2">
                  <div className="aspect-square rounded-xl overflow-hidden bg-kp-card border border-kp-border">
                    <img src={p.photo_url} alt={p.caption ?? ''} className="w-full h-full object-cover" />
                  </div>
                  {p.caption && <p className="text-gray-500 text-xs truncate">{p.caption}</p>}
                  <form action={deletePhoto.bind(null, p.id, p.photo_url)}>
                    <button type="submit" className="text-red-400 text-xs hover:underline">Remove</button>
                  </form>
                </div>
              ))}
            </div>
          )}

          <form action={addPhoto} className="flex flex-wrap items-end gap-4 pt-4 border-t border-kp-border">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Add a Photo</label>
              <input
                name="photo"
                type="file"
                accept="image/*"
                required
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-kp-border file:bg-kp-card file:text-gray-300 file:text-sm file:font-medium hover:file:border-kp-gold hover:file:text-kp-gold file:transition-colors cursor-pointer"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Caption <span className="text-gray-600 font-normal">(optional)</span></label>
              <input name="caption" className="w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors" />
            </div>
            <button type="submit"
              className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity shrink-0">
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

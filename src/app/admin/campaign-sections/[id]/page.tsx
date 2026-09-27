import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  updateSection,
  deleteSection,
  addSectionPhotos,
  updateSectionPhotoCaption,
  deleteSectionPhoto,
} from '../actions'
import SectionForm from '../SectionForm'
import DeleteSectionButton from '../DeleteSectionButton'

export const metadata = { title: 'Edit Campaign Section' }

export default async function EditCampaignSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const [{ data: section }, { data: photos }] = await Promise.all([
    admin.from('campaign_sections').select('title, body, sort_order, is_published').eq('id', id).single(),
    admin
      .from('campaign_section_photos')
      .select('id, photo_url, caption, sort_order')
      .eq('section_id', id)
      .order('sort_order', { ascending: true }),
  ])
  if (!section) notFound()

  const { success, error } = await searchParams
  const updateThis = updateSection.bind(null, id)
  const deleteThis = deleteSection.bind(null, id)
  const addPhotosTo = addSectionPhotos.bind(null, id)

  const successMsg: Record<string, string> = {
    created: 'Section created.',
    saved: 'Changes saved.',
    'photos-added': 'Photos added.',
    'photo-removed': 'Photo removed.',
    'caption-saved': 'Caption saved.',
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/campaign-sections"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Campaign Vision &amp; Renderings
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Section</h1>
          <p className="text-gray-500 text-sm mt-1">{section.title}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && successMsg[success] && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {successMsg[success]}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}

        {/* Section details */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <SectionForm action={updateThis} section={section} />
        </div>

        {/* Photos */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white">Photos</h3>
            <p className="text-gray-500 text-xs mt-0.5">Shown as a single wide image if there&apos;s one, or a grid if there are more.</p>
          </div>

          {(photos ?? []).length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(photos ?? []).map(photo => {
                const removeThis = deleteSectionPhoto.bind(null, photo.id, id)
                const saveCaption = updateSectionPhotoCaption.bind(null, photo.id, id)
                return (
                  <div key={photo.id} className="rounded-xl overflow-hidden border border-kp-border bg-kp-dark">
                    <div className="relative group aspect-video bg-kp-card">
                      <Image src={photo.photo_url} alt={photo.caption ?? ''} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                      <form action={removeThis} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="submit"
                          title="Remove photo"
                          className="w-7 h-7 rounded-full bg-black/80 border border-red-700 text-red-400 hover:bg-red-900 transition-colors flex items-center justify-center text-xs font-bold"
                        >
                          ✕
                        </button>
                      </form>
                    </div>
                    <form action={saveCaption} className="flex items-center gap-2 p-2">
                      <input
                        name="caption"
                        defaultValue={photo.caption ?? ''}
                        placeholder="Caption (optional)"
                        className="flex-1 min-w-0 bg-kp-dark border border-kp-border rounded-lg px-3 py-1.5 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-kp-gold"
                      />
                      <button type="submit" className="shrink-0 text-xs font-semibold text-gray-300 hover:text-kp-gold px-2 py-1.5 transition-colors">
                        Save
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          )}

          <form action={addPhotosTo} className="space-y-3 pt-2 border-t border-kp-border">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Add Photos
            </label>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-kp-border file:bg-kp-card file:text-gray-300 file:text-sm file:font-medium hover:file:border-kp-gold hover:file:text-kp-gold file:transition-colors cursor-pointer"
            />
            <p className="text-gray-500 text-xs">Select one or more photos. JPEG, PNG, or WebP.</p>
            <div className="flex justify-end">
              <button type="submit"
                className="bg-kp-blue hover:opacity-90 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-opacity">
                Upload Photos
              </button>
            </div>
          </form>
        </div>

        {/* Danger zone */}
        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Delete Section</h3>
          <p className="text-gray-500 text-xs mb-4">Permanently deletes this section and all its photos. This cannot be undone.</p>
          <DeleteSectionButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}

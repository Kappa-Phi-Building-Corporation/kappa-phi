import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateProject, deleteProject, addProjectPhotos, deleteProjectPhoto } from '../actions'
import ProjectForm from '../ProjectForm'
import DeleteProjectButton from '../DeleteProjectButton'

export const metadata = { title: 'Edit Project' }

export default async function EditProjectPage({
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

  const [{ data: project }, { data: photos }] = await Promise.all([
    admin
      .from('property_projects')
      .select('name, status, description, scheduled_date, completed_date, cost, contractor, sort_order, is_published')
      .eq('id', id)
      .single(),
    admin
      .from('property_project_photos')
      .select('id, photo_url, caption, sort_order')
      .eq('project_id', id)
      .order('sort_order', { ascending: true }),
  ])
  if (!project) notFound()

  const { success, error } = await searchParams
  const updateThis = updateProject.bind(null, id)
  const deleteThis = deleteProject.bind(null, id)
  const addPhotosTo = addProjectPhotos.bind(null, id)

  const successMsg: Record<string, string> = {
    created: 'Project created.',
    saved: 'Changes saved.',
    'photos-added': 'Photos added.',
    'photo-removed': 'Photo removed.',
  }

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/property"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Property Management
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Project</h1>
          <p className="text-gray-500 text-sm mt-1">{project.name}</p>
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

        {/* Project details */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <ProjectForm action={updateThis} project={project} />
        </div>

        {/* Photos */}
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white">Photos</h3>

          {/* Existing photos */}
          {(photos ?? []).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(photos ?? []).map(photo => {
                const removeThis = deleteProjectPhoto.bind(null, photo.id, id)
                return (
                  <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-kp-card">
                    <img src={photo.photo_url} alt={photo.caption ?? ''} className="w-full h-full object-cover" />
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                        {photo.caption}
                      </div>
                    )}
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
                )
              })}
            </div>
          )}

          {/* Add photos form */}
          <form action={addPhotosTo} className="space-y-3">
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
            <p className="text-gray-600 text-xs">Select one or more photos. JPEG, PNG, or WebP.</p>
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
          <h3 className="text-sm font-bold text-red-400 mb-1">Delete Project</h3>
          <p className="text-gray-500 text-xs mb-4">
            Permanently deletes this project and all its photos. This cannot be undone.
          </p>
          <DeleteProjectButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}

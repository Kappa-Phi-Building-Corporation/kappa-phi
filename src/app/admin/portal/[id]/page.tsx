import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updatePortalResource, deletePortalResource } from '../actions'
import ResourceForm from '../ResourceForm'
import DeleteResourceButton from '../DeleteResourceButton'

export const metadata = { title: 'Edit Portal Resource' }

export default async function EditPortalResourcePage({
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

  const { data: resource } = await admin
    .from('portal_resources')
    .select('label, href, is_external, requires_auth, sort_order, is_published')
    .eq('id', id)
    .single()
  if (!resource) notFound()

  const { success, error } = await searchParams
  const updateThis = updatePortalResource.bind(null, id)
  const deleteThis = deletePortalResource.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/portal"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Portal Resources
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Portal Resource</h1>
          <p className="text-gray-500 text-sm mt-1">{resource.label}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Resource added.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <ResourceForm action={updateThis} resource={resource} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove Resource</h3>
          <p className="text-gray-500 text-xs mb-4">
            Permanently deletes this link from the Chapter Portal page. This cannot be undone.
          </p>
          <DeleteResourceButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}

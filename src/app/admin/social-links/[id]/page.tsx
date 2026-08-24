import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { updateSocialLink, deleteSocialLink } from '../actions'
import SocialLinkForm from '../SocialLinkForm'
import DeleteSocialLinkButton from '../DeleteSocialLinkButton'

export const metadata = { title: 'Edit Social Link' }

export default async function EditSocialLinkPage({
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

  const { data: link } = await admin
    .from('social_links')
    .select('platform, label, url, sort_order, is_published')
    .eq('id', id)
    .single()
  if (!link) notFound()

  const { success, error } = await searchParams
  const updateThis = updateSocialLink.bind(null, id)
  const deleteThis = deleteSocialLink.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/social-links"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Social Links
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Social Link</h1>
          <p className="text-gray-500 text-sm mt-1">{link.label}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">
            {success === 'created' ? 'Link added.' : 'Changes saved.'}
          </div>
        )}
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <SocialLinkForm action={updateThis} link={link} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove Link</h3>
          <p className="text-gray-500 text-xs mb-4">Permanently removes this link from the Events page. This cannot be undone.</p>
          <DeleteSocialLinkButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}

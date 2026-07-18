import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import SectionForm from '../../SectionForm'
import DeleteSectionButton from '../../DeleteSectionButton'
import { updateSection, deleteSection } from '../../actions'

export const metadata = { title: 'Edit Guide Section' }

export default async function EditSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: section } = await admin
    .from('pats_guide_sections')
    .select('title, slug, body, sort_order')
    .eq('id', id)
    .single()
  if (!section) notFound()

  const { error } = await searchParams
  const updateThis = updateSection.bind(null, id)
  const deleteThis = deleteSection.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/portal/pats-guide" className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Booth&apos;s Guide to Pats
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Section</h1>
          <p className="text-gray-500 text-sm mt-1">{section.title}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <SectionForm action={updateThis} section={section} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove Section</h3>
          <p className="text-gray-500 text-xs mb-4">
            Permanently deletes this section from the guide page. This cannot be undone.
          </p>
          <DeleteSectionButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}

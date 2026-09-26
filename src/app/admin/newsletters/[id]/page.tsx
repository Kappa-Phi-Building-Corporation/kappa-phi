import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deleteNewsletter } from '../actions'
import NewsletterForm from '../NewsletterForm'
import DeleteNewsletterButton from '../DeleteNewsletterButton'

export const metadata = { title: 'Edit Newsletter' }

export default async function EditNewsletterPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'website_admin') redirect('/portal')

  const { data: newsletter } = await admin
    .from('newsletters')
    .select('id, title, issue_date, description, is_published, file_url, file_size')
    .eq('id', id)
    .single()
  if (!newsletter) notFound()

  const { success } = await searchParams
  const deleteThis = deleteNewsletter.bind(null, id)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/admin/newsletters"
            className="text-gray-500 text-sm hover:text-kp-gold transition-colors mb-3 inline-block no-underline">
            ← Back to Newsletters
          </Link>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Administration</div>
          <h1 className="text-3xl font-black text-white">Edit Newsletter</h1>
          <p className="text-gray-500 text-sm mt-1">{newsletter.title}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-sm">Changes saved.</div>
        )}

        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          <NewsletterForm newsletter={newsletter} />
        </div>

        <div className="bg-kp-surface border border-red-900/40 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-400 mb-1">Remove Newsletter</h3>
          <p className="text-gray-500 text-xs mb-4">Permanently removes this newsletter and its PDF. To just take it off the site for now, turn off &quot;Visible&quot; instead.</p>
          <DeleteNewsletterButton action={deleteThis} />
        </div>
      </div>
    </div>
  )
}

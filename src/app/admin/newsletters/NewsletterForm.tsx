'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatBytes } from '@/lib/formatBytes'
import {
  prepareNewsletterUpload,
  createNewsletter,
  updateNewsletter,
  type NewsletterInput,
} from './actions'

type Newsletter = {
  id: string
  title: string
  issue_date: string
  description: string | null
  is_published: boolean
  file_url: string
  file_size: number | null
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

const MAX_BYTES = 50 * 1024 * 1024

export default function NewsletterForm({ newsletter }: { newsletter?: Newsletter | null }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = new FormData(e.currentTarget)
    const file = form.get('file') as File | null
    const hasFile = !!file && file.size > 0

    if (!newsletter && !hasFile) return setError('Choose a PDF to upload.')
    if (hasFile) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return setError('The file must be a PDF.')
      if (file.size > MAX_BYTES) return setError('That PDF is over 50 MB. Compress it and try again.')
    }

    setBusy(true)
    try {
      const input: NewsletterInput = {
        title: (form.get('title') as string) ?? '',
        issueDate: (form.get('issue_date') as string) ?? '',
        description: (form.get('description') as string) ?? '',
        isPublished: form.get('is_published') === 'on',
      }

      if (hasFile) {
        const prep = await prepareNewsletterUpload()
        if (!prep.ok) throw new Error(prep.error)
        const { error: uploadError } = await createClient()
          .storage.from('newsletters')
          .uploadToSignedUrl(prep.path, prep.token, file, { contentType: 'application/pdf' })
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)
        input.file = { path: prep.path, size: file.size }
      }

      const result = newsletter ? await updateNewsletter(newsletter.id, input) : await createNewsletter(input)
      if (!result.ok) throw new Error(result.error)
      router.push(newsletter ? `/admin/newsletters/${newsletter.id}?success=saved` : '/admin/newsletters?success=created')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelCls}>Title *</label>
          <input id="title" name="title" required defaultValue={newsletter?.title ?? ''} placeholder="e.g. Delta Shelter News — Spring 2025" className={inputCls} />
        </div>
        <div>
          <label htmlFor="issue_date" className={labelCls}>Issue Date *</label>
          <input id="issue_date" name="issue_date" type="date" required defaultValue={newsletter?.issue_date ?? ''} className={inputCls + ' [color-scheme:dark]'} />
          <p className="text-gray-500 text-xs mt-1">Newest first on the site.</p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={newsletter?.description ?? ''}
          placeholder="Optional — a sentence or two on what's inside"
          className={inputCls + ' resize-y'}
        />
      </div>

      <div>
        <label htmlFor="file" className={labelCls}>{newsletter ? 'Replace PDF' : 'PDF File *'}</label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,.pdf"
          className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-kp-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-kp-gold hover:file:opacity-90"
        />
        <p className="text-gray-500 text-xs mt-1.5">
          PDF, up to 50 MB.
          {newsletter && (
            <>
              {' '}Current file:{' '}
              <a href={newsletter.file_url} target="_blank" rel="noopener noreferrer" className="text-kp-gold hover:underline">
                view{newsletter.file_size ? ` (${formatBytes(newsletter.file_size)})` : ''}
              </a>
              . Leave empty to keep it.
            </>
          )}
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input name="is_published" type="checkbox" defaultChecked={newsletter?.is_published ?? true} className="sr-only peer" />
          <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
          <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
        </div>
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Visible on the Newsletters page</span>
      </label>

      {error && (
        <div role="alert" className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-kp-border">
        {busy && <span className="text-gray-400 text-sm">Uploading… keep this page open.</span>}
        <button
          type="submit"
          disabled={busy}
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {newsletter ? 'Save Changes' : 'Publish Newsletter'}
        </button>
      </div>
    </form>
  )
}

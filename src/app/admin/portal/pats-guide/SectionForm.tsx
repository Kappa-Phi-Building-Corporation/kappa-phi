'use client'

type Section = {
  title: string
  slug: string
  body: string
  sort_order: number
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

export default function SectionForm({
  action,
  section,
  defaultSortOrder = 0,
}: {
  action: (formData: FormData) => void | Promise<void>
  section?: Section | null
  defaultSortOrder?: number
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="title" className={labelCls}>Section Title *</label>
          <input id="title" name="title" required defaultValue={section?.title ?? ''} placeholder="e.g. What to Bring" className={inputCls} />
        </div>
        <div>
          <label htmlFor="sort_order" className={labelCls}>Order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={section?.sort_order ?? defaultSortOrder} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="slug" className={labelCls}>URL Slug <span className="text-gray-500 font-normal">(optional — auto-generated from the title if left blank)</span></label>
        <input id="slug" name="slug" defaultValue={section?.slug ?? ''} placeholder="what-to-bring" className={`${inputCls} font-mono`} />
      </div>

      <div>
        <label htmlFor="body" className={labelCls}>Body</label>
        <p className="text-gray-500 text-xs mb-2 leading-relaxed">
          Markdown is supported: <code className="text-kp-gold">**bold**</code>,{' '}
          <code className="text-kp-gold">[link text](url)</code>,{' '}
          <code className="text-kp-gold">- bullet item</code>,{' '}
          blank-line-separated paragraphs, and pipe-delimited tables (<code className="text-kp-gold">| Col | Col |</code>).
          Start a line with <code className="text-kp-gold">{'> '}</code> to render it as a red warning callout.
        </p>
        <textarea id="body" name="body" required rows={16} defaultValue={section?.body ?? ''} className={`${inputCls} resize-y font-mono text-xs leading-relaxed`} />
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {section ? 'Save Section' : 'Add Section'}
        </button>
      </div>
    </form>
  )
}

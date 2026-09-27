'use client'

import EventDescriptionEditor from '@/app/admin/events/EventDescriptionEditor'

type Section = {
  title: string
  body: string | null
  sort_order: number
  is_published: boolean
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

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
      <div>
        <label htmlFor="title" className={labelCls}>Title *</label>
        <input id="title" name="title" required defaultValue={section?.title ?? ''} placeholder="e.g. Multi-Purpose Room" className={inputCls} />
      </div>

      <div>
        <span className={labelCls}>Description</span>
        <EventDescriptionEditor name="body" initialValue={section?.body ?? ''} />
        <p className="text-gray-500 text-xs mt-1.5">Supports bold, underline, bullets, and links — shown under the title on the Campaign page.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="sort_order" className={labelCls}>Sort Order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={section?.sort_order ?? defaultSortOrder} className={inputCls} />
          <p className="text-gray-500 text-xs mt-1">Lower numbers appear first.</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer group pb-2.5">
          <div className="relative">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked={section?.is_published ?? true}
              value="on"
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
            <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Visible on the Campaign page
          </span>
        </label>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {section ? 'Save Changes' : 'Add Section'}
        </button>
      </div>
    </form>
  )
}

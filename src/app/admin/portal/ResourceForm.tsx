'use client'

type Resource = {
  label: string
  href: string
  is_external: boolean
  requires_auth: boolean
  sort_order: number
  is_published: boolean
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'

export default function ResourceForm({
  action,
  resource,
}: {
  action: (formData: FormData) => void | Promise<void>
  resource?: Resource | null
}) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <label className={labelCls}>Link Text *</label>
        <input name="label" required defaultValue={resource?.label ?? ''} placeholder="e.g. Alumni Mailing List" className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>URL *</label>
        <input name="href" required defaultValue={resource?.href ?? ''} placeholder="https://... or /alumni/tree" className={inputCls} />
        <p className="text-gray-600 text-xs mt-1">Use a full URL for external links, or a path like /alumni/tree for pages on this site.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Sort Order</label>
          <input
            name="sort_order"
            type="number"
            min="0"
            defaultValue={resource?.sort_order ?? 0}
            className={inputCls}
          />
          <p className="text-gray-600 text-xs mt-1">Lower numbers appear first.</p>
        </div>
        <div className="flex flex-col gap-3 justify-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                name="is_external"
                type="checkbox"
                defaultChecked={resource?.is_external ?? false}
                value="on"
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Opens in a new tab (external link)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                name="requires_auth"
                type="checkbox"
                defaultChecked={resource?.requires_auth ?? false}
                value="on"
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Requires login to access
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={resource?.is_published ?? true}
                value="on"
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Visible on portal page
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {resource ? 'Save Changes' : 'Add Resource'}
        </button>
      </div>
    </form>
  )
}

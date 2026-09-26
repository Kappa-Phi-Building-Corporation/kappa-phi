'use client'

type GivingLevel = {
  name: string
  amount_label: string
  description: string | null
  donors: string | null
  sort_order: number
  is_published: boolean
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

export default function GivingLevelForm({
  action,
  level,
  defaultSortOrder = 0,
}: {
  action: (formData: FormData) => void | Promise<void>
  level?: GivingLevel | null
  defaultSortOrder?: number
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelCls}>Level Name *</label>
          <input id="name" name="name" required defaultValue={level?.name ?? ''} placeholder="e.g. Founders Circle" className={inputCls} />
        </div>
        <div>
          <label htmlFor="amount_label" className={labelCls}>Amount *</label>
          <input id="amount_label" name="amount_label" required defaultValue={level?.amount_label ?? ''} placeholder="e.g. $10,000+ or $500 – $999" className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Recognition / Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={level?.description ?? ''}
          placeholder="e.g. Name on the donor wall in the renovated living room"
          className={inputCls + ' resize-y'}
        />
      </div>

      <div>
        <label htmlFor="donors" className={labelCls}>Donors</label>
        <textarea
          id="donors"
          name="donors"
          rows={6}
          defaultValue={level?.donors ?? ''}
          placeholder={"One name per line, e.g.\nJane Q. Public '95\nAnonymous"}
          className={inputCls + ' resize-y'}
        />
        <p className="text-gray-500 text-xs mt-1">
          Listed publicly under this level. Put notes in parentheses after the name, e.g. &quot;(in memory of …)&quot;. Leave blank for none.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="sort_order" className={labelCls}>Sort Order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={level?.sort_order ?? defaultSortOrder} className={inputCls} />
          <p className="text-gray-500 text-xs mt-1">Lower numbers appear first — list the highest level first.</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer group pb-2.5">
          <div className="relative">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked={level?.is_published ?? true}
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
          {level ? 'Save Changes' : 'Add Level'}
        </button>
      </div>
    </form>
  )
}

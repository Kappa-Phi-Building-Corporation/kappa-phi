'use client'

type Milestone = {
  year: string
  event: string
  sort_order: number
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

export default function MilestoneForm({
  action,
  milestone,
  defaultSortOrder = 0,
}: {
  action: (formData: FormData) => void | Promise<void>
  milestone?: Milestone | null
  defaultSortOrder?: number
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="year" className={labelCls}>Year *</label>
          <input id="year" name="year" required defaultValue={milestone?.year ?? ''} placeholder="e.g. 1999" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="sort_order" className={labelCls}>Order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={milestone?.sort_order ?? defaultSortOrder} className={inputCls} />
          <p className="text-gray-500 text-xs mt-1">Milestones are listed in this order, lower first.</p>
        </div>
      </div>

      <div>
        <label htmlFor="event" className={labelCls}>Event *</label>
        <textarea id="event" name="event" required rows={3} defaultValue={milestone?.event ?? ''} placeholder="e.g. Major chapter house expansion completed" className={inputCls + ' resize-y'} />
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {milestone ? 'Save Changes' : 'Add Milestone'}
        </button>
      </div>
    </form>
  )
}

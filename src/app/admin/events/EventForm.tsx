'use client'

type Event = {
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  start_time: string | null
  end_time: string | null
  location: string | null
  link_label: string | null
  link_url: string | null
  is_published: boolean
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'
const dateInputCls = inputCls + ' [color-scheme:dark]'
const textareaCls = inputCls + ' resize-y min-h-[120px]'

export default function EventForm({
  action,
  event,
}: {
  action: (formData: FormData) => void | Promise<void>
  event?: Event | null
}) {
  return (
    <form action={action} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className={labelCls}>Title *</label>
        <input
          id="title"
          name="title"
          required
          defaultValue={event?.title ?? ''}
          placeholder="e.g. 118th Annual St. Pats"
          className={inputCls}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className={labelCls}>Start Date *</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            required
            defaultValue={event?.start_date ?? ''}
            className={dateInputCls}
          />
        </div>
        <div>
          <label htmlFor="end_date" className={labelCls}>End Date <span className="text-gray-500 font-normal">(leave blank for single day)</span></label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={event?.end_date ?? ''}
            className={dateInputCls}
          />
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_time" className={labelCls}>Start Time <span className="text-gray-500 font-normal">(optional)</span></label>
          <input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={event?.start_time ?? ''}
            className={dateInputCls}
          />
        </div>
        <div>
          <label htmlFor="end_time" className={labelCls}>End Time <span className="text-gray-500 font-normal">(optional)</span></label>
          <input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={event?.end_time ?? ''}
            className={dateInputCls}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelCls}>Location <span className="text-gray-500 font-normal">(optional)</span></label>
        <input
          id="location"
          name="location"
          defaultValue={event?.location ?? ''}
          placeholder='e.g. Rolla, MO or Virtual'
          className={inputCls}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelCls}>Description / Schedule <span className="text-gray-500 font-normal">(optional)</span></label>
        <textarea
          id="description"
          name="description"
          defaultValue={event?.description ?? ''}
          placeholder={'Multi-line schedule or details.\nEach line will be shown as-is.'}
          className={textareaCls}
        />
        <p className="text-gray-500 text-xs mt-1">Displayed with line breaks preserved. Use plain text.</p>
      </div>

      {/* CTA Link */}
      <div>
        <span className={labelCls}>Call-to-Action Button <span className="text-gray-500 font-normal">(optional)</span></span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="link_label"
            aria-label="Call-to-action button label"
            defaultValue={event?.link_label ?? ''}
            placeholder='Button label, e.g. "Join Google Meet"'
            className={inputCls}
          />
          <input
            name="link_url"
            type="url"
            aria-label="Call-to-action button URL"
            defaultValue={event?.link_url ?? ''}
            placeholder='https://...'
            className={inputCls}
          />
        </div>
        <p className="text-gray-500 text-xs mt-1">Both fields required to show the button.</p>
      </div>

      {/* Published */}
      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              name="is_published"
              value="true"
              defaultChecked={event?.is_published ?? true}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold peer-focus:ring-2 peer-focus:ring-kp-gold/40 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-gray-400 rounded-full peer-checked:bg-black peer-checked:translate-x-5 transition-all" />
          </div>
          <span className="text-sm text-gray-300">Published (visible on events page)</span>
        </label>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button
          type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          {event ? 'Save Changes' : 'Create Event'}
        </button>
      </div>
    </form>
  )
}

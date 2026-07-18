'use client'

type Guide = {
  title: string
  intro: string | null
  pdf_url: string | null
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'

export default function PatsGuideForm({
  action,
  guide,
}: {
  action: (formData: FormData) => void | Promise<void>
  guide: Guide
}) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <label className={labelCls}>Page Title</label>
        <input name="title" required defaultValue={guide.title} className={inputCls} />
      </div>

      <div>
        <label className={labelCls}>Intro <span className="text-gray-600 font-normal">(optional, shown under the title)</span></label>
        <textarea name="intro" rows={2} defaultValue={guide.intro ?? ''} className={`${inputCls} resize-y`} />
      </div>

      <div>
        <label className={labelCls}>Original PDF URL <span className="text-gray-600 font-normal">(optional, shown as a download link)</span></label>
        <input name="pdf_url" type="url" defaultValue={guide.pdf_url ?? ''} placeholder="https://…" className={inputCls} />
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>
    </form>
  )
}

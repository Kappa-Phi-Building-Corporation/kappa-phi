'use client'

import { useState } from 'react'

type Mascot = {
  name: string
  start_year: number | null
  end_year: number | null
  sort_order: number
  is_published: boolean
  photo_url: string | null
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'

export default function MascotForm({
  action,
  mascot,
}: {
  action: (formData: FormData) => void | Promise<void>
  mascot?: Mascot | null
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(mascot?.photo_url ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <form action={action} className="space-y-6">

      {/* Photo */}
      <div>
        <label className={labelCls}>Photo <span className="text-gray-600 font-normal">(optional)</span></label>
        <div className="flex items-start gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-kp-card border border-kp-border shrink-0 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-kp-border file:bg-kp-card file:text-gray-300 file:text-sm file:font-medium hover:file:border-kp-gold hover:file:text-kp-gold file:transition-colors cursor-pointer"
            />
            <p className="text-gray-600 text-xs">JPEG, PNG, or WebP. Stored in Supabase Storage.</p>
            {mascot?.photo_url && (
              <p className="text-gray-600 text-xs">Uploading a new file will replace the current photo.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Mascot Name *</label>
        <input name="name" required defaultValue={mascot?.name ?? ''} placeholder="e.g. Studley" className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Year</label>
          <input name="start_year" type="number" defaultValue={mascot?.start_year ?? ''} placeholder="e.g. 1972" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>End Year <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="end_year" type="number" defaultValue={mascot?.end_year ?? ''} placeholder="Leave blank for Present" className={inputCls} />
          <p className="text-gray-600 text-xs mt-1">Leave blank to display &quot;Present&quot;.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Sort Order</label>
          <input
            name="sort_order"
            type="number"
            min="0"
            defaultValue={mascot?.sort_order ?? 0}
            className={inputCls}
          />
          <p className="text-gray-600 text-xs mt-1">Lower numbers appear first.</p>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={mascot?.is_published ?? true}
                value="on"
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Visible on About page
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {mascot ? 'Save Changes' : 'Add Mascot'}
        </button>
      </div>
    </form>
  )
}

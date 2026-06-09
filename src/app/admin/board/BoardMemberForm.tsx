'use client'

import { useState } from 'react'

type BoardMember = {
  name: string | null
  role: string | null
  category: string | null
  email: string | null
  bio: string | null
  goals: string | null
  goals_bulleted: boolean
  sort_order: number
  is_active: boolean
  photo_url: string | null
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'
const textareaCls = inputCls + ' resize-y min-h-[120px]'

export default function BoardMemberForm({
  action,
  member,
}: {
  action: (formData: FormData) => void | Promise<void>
  member?: BoardMember | null
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(member?.photo_url ?? null)

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
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-top" />
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
            {member?.photo_url && (
              <p className="text-gray-600 text-xs">Uploading a new file will replace the current photo.</p>
            )}
          </div>
        </div>
      </div>

      {/* Name + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input name="name" required defaultValue={member?.name ?? ''} placeholder="e.g. Peter Moore" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Title / Role *</label>
          <input name="role" required defaultValue={member?.role ?? ''} placeholder="e.g. President" className={inputCls} />
        </div>
      </div>

      {/* Category + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category *</label>
          <select
            name="category"
            defaultValue={member?.category ?? 'director'}
            className={inputCls}
          >
            <option value="officer">Officer</option>
            <option value="director">Director</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Email <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="email" type="email" defaultValue={member?.email ?? ''} placeholder="officer@kappa-phi.org" className={inputCls} />
        </div>
      </div>

      {/* Sort Order + Active */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Sort Order</label>
          <input
            name="sort_order"
            type="number"
            min="0"
            defaultValue={member?.sort_order ?? 0}
            className={inputCls}
          />
          <p className="text-gray-600 text-xs mt-1">Lower numbers appear first within their category.</p>
        </div>
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={member?.is_active ?? true}
                value="on"
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
            </div>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              Visible on board page
            </span>
          </label>
        </div>
      </div>

      {/* Biography */}
      <div>
        <label className={labelCls}>Biography <span className="text-gray-600 font-normal">(optional)</span></label>
        <textarea
          name="bio"
          defaultValue={member?.bio ?? ''}
          placeholder="Write biography paragraphs here. Separate paragraphs with a blank line."
          className={textareaCls}
          rows={8}
        />
        <p className="text-gray-600 text-xs mt-1">Separate paragraphs with a blank line (press Enter twice).</p>
      </div>

      {/* Goals */}
      <div>
        <label className={labelCls}>Goals &amp; Updates <span className="text-gray-600 font-normal">(optional)</span></label>
        <textarea
          name="goals"
          defaultValue={member?.goals ?? ''}
          placeholder="Enter goals or updates here. Separate items with a blank line."
          className={textareaCls}
          rows={5}
        />
        <div className="flex items-center gap-3 mt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-gray-300">
            <input
              name="goals_bulleted"
              type="checkbox"
              defaultChecked={member?.goals_bulleted ?? false}
              value="on"
              className="rounded border-kp-border bg-kp-dark text-kp-gold focus:ring-kp-gold"
            />
            Display goals as a bulleted list
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {member ? 'Save Changes' : 'Add Member'}
        </button>
      </div>
    </form>
  )
}

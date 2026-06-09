'use client'

import { useState } from 'react'
import Image from 'next/image'

type Member = {
  first_name: string | null
  last_name: string | null
  title: string | null
  badge_number: string | null
  pledge_class: string | null
  initiation_date: string | null
  passing_date: string | null
  memorial_link_url: string | null
  photo_url: string | null
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'
const dateInputCls = inputCls + ' [color-scheme:dark]'

export default function EternalForm({
  action,
  member,
}: {
  action: (formData: FormData) => void | Promise<void>
  member?: Member | null
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(member?.photo_url ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <form action={action} className="space-y-6">

      {/* Photo upload */}
      <div>
        <label className={labelCls}>Memorial Photo <span className="text-gray-600 font-normal">(optional)</span></label>
        <div className="flex items-start gap-5">
          <div className="w-32 h-40 rounded-xl overflow-hidden bg-kp-card border border-kp-border shrink-0 flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p className="text-gray-600 text-xs">JPEG, PNG, or WebP. Stored in Supabase Storage (not in the database).</p>
            {member?.photo_url && (
              <p className="text-gray-600 text-xs">Uploading a new file will replace the current photo.</p>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Title <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="title" defaultValue={member?.title ?? ''} placeholder="Dr." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>First Name *</label>
          <input name="first_name" required defaultValue={member?.first_name ?? ''} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Last Name *</label>
          <input name="last_name" required defaultValue={member?.last_name ?? ''} className={inputCls} />
        </div>
      </div>

      {/* Badge + Pledge Class */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Badge Number <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="badge_number" defaultValue={member?.badge_number ?? ''} placeholder="e.g. 42" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Pledge Class <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="pledge_class" defaultValue={member?.pledge_class ?? ''} placeholder="e.g. Charter or Fall 1972" className={inputCls} />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Initiation Date <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="initiation_date" type="date" defaultValue={member?.initiation_date ?? ''} className={dateInputCls} />
        </div>
        <div>
          <label className={labelCls}>Chapter Eternal Date *</label>
          <input name="passing_date" type="date" required defaultValue={member?.passing_date ?? ''} className={dateInputCls} />
        </div>
      </div>

      {/* Memorial link */}
      <div>
        <label className={labelCls}>Memorial / Obituary Link <span className="text-gray-600 font-normal">(optional)</span></label>
        <input
          name="memorial_link_url"
          type="url"
          defaultValue={member?.memorial_link_url ?? ''}
          placeholder="https://..."
          className={inputCls}
        />
        <p className="text-gray-600 text-xs mt-1">If provided, the member's name on the memorial page will link to this URL in a new tab.</p>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {member ? 'Save Changes' : 'Add to Memorial'}
        </button>
      </div>
    </form>
  )
}

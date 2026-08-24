'use client'

import { useState } from 'react'
import { SOCIAL_PLATFORMS, SocialIcon } from '@/lib/socialPlatforms'

type SocialLink = {
  platform: string
  label: string
  url: string
  sort_order: number
  is_published: boolean
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kp-gold focus:ring-1 focus:ring-kp-gold transition-colors'

export default function SocialLinkForm({
  action,
  link,
  defaultSortOrder = 0,
}: {
  action: (formData: FormData) => void | Promise<void>
  link?: SocialLink | null
  defaultSortOrder?: number
}) {
  const [platform, setPlatform] = useState(link?.platform ?? 'other')
  const [label, setLabel] = useState(link?.label ?? '')

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="platform" className={labelCls}>Platform</label>
          <select id="platform" name="platform" value={platform} onChange={e => setPlatform(e.target.value)} className={inputCls}>
            {SOCIAL_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <p className="text-gray-500 text-xs mt-1">Controls which icon is shown. Pick &quot;Other&quot; if nothing matches.</p>
        </div>
        <div>
          <label htmlFor="label" className={labelCls}>Button Text *</label>
          <input id="label" name="label" required value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Facebook" className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="url" className={labelCls}>URL *</label>
        <input id="url" name="url" type="url" required defaultValue={link?.url ?? ''} placeholder="https://..." className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="sort_order" className={labelCls}>Sort Order</label>
          <input id="sort_order" name="sort_order" type="number" defaultValue={link?.sort_order ?? defaultSortOrder} className={inputCls} />
          <p className="text-gray-500 text-xs mt-1">Lower numbers appear first.</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer group pb-2.5">
          <div className="relative">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked={link?.is_published ?? true}
              value="on"
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
            <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Visible on the Events page
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2 text-gray-500 text-xs">
        <span>Preview:</span>
        <span className="inline-flex items-center gap-1.5 border border-kp-border rounded-lg px-3 py-1.5 text-gray-300">
          <SocialIcon platform={platform} />
          {label || 'Button Text'}
        </span>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {link ? 'Save Changes' : 'Add Link'}
        </button>
      </div>
    </form>
  )
}

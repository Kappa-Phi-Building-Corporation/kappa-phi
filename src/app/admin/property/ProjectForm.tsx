'use client'

import { useState } from 'react'

type Project = {
  name: string | null
  status: string | null
  description: string | null
  scheduled_date: string | null
  completed_date: string | null
  cost: string | null
  contractor: string | null
  sort_order: number
  is_published: boolean
}

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'
const textareaCls = inputCls + ' resize-y min-h-[100px]'

export default function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => void | Promise<void>
  project?: Project | null
}) {
  const [status, setStatus] = useState(project?.status ?? 'planned')

  return (
    <form action={action} className="space-y-6">

      {/* Name */}
      <div>
        <label className={labelCls}>Project Name *</label>
        <input name="name" required defaultValue={project?.name ?? ''} placeholder="e.g. HVAC Upgrades Phase 2" className={inputCls} />
      </div>

      {/* Status + Sort Order */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Section *</label>
          <select
            name="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={inputCls}
          >
            <option value="planned">Planned Projects</option>
            <option value="recent">Recent Projects</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Sort Order</label>
          <input name="sort_order" type="number" min="0" defaultValue={project?.sort_order ?? 0} className={inputCls} />
          <p className="text-gray-600 text-xs mt-1">Lower numbers appear first within the section.</p>
        </div>
      </div>

      {/* Date field — label changes based on section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {status === 'planned' ? (
          <div>
            <label className={labelCls}>Scheduled Date</label>
            <input name="scheduled_date" defaultValue={project?.scheduled_date ?? ''} placeholder="e.g. Spring 2026 or TBD" className={inputCls} />
            <input type="hidden" name="completed_date" value="" />
          </div>
        ) : (
          <div>
            <label className={labelCls}>Completed Date</label>
            <input name="completed_date" defaultValue={project?.completed_date ?? ''} placeholder="e.g. Summer 2024" className={inputCls} />
            <input type="hidden" name="scheduled_date" value="" />
          </div>
        )}
        <div>
          <label className={labelCls}>Cost <span className="text-gray-600 font-normal">(optional)</span></label>
          <input name="cost" defaultValue={project?.cost ?? ''} placeholder="e.g. $15,000" className={inputCls} />
        </div>
      </div>

      {/* Contractor */}
      <div>
        <label className={labelCls}>Contractor <span className="text-gray-600 font-normal">(optional)</span></label>
        <input name="contractor" defaultValue={project?.contractor ?? ''} placeholder="e.g. Acme Contractors — Rolla, MO" className={inputCls} />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea name="description" defaultValue={project?.description ?? ''} placeholder="Describe the project…" className={textareaCls} rows={6} />
      </div>

      {/* Published toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              name="is_published"
              type="checkbox"
              defaultChecked={project?.is_published ?? true}
              value="on"
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-kp-card border border-kp-border rounded-full peer-checked:bg-kp-gold/80 peer-checked:border-kp-gold transition-colors" />
            <div className="absolute top-1 left-1 w-4 h-4 bg-gray-500 rounded-full peer-checked:translate-x-4 peer-checked:bg-black transition-all" />
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
            Published (visible on property page)
          </span>
        </label>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit" className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {project ? 'Save Changes' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useMemo, useState } from 'react'

export type MissingMember = {
  id: string
  first_name: string | null
  last_name: string | null
  badge_number: string | null
  pledge_class: string | null
}

export type MemberOption = {
  id: string
  first_name: string | null
  last_name: string | null
  badge_number: string | null
}

export default function BigBrotherMaintenance({
  missing,
  allMembers,
  action,
}: {
  missing: MissingMember[]
  allMembers: MemberOption[]
  action: (formData: FormData) => void | Promise<void>
}) {
  const [search, setSearch] = useState('')

  const optionsByExcludedId = useMemo(() => {
    const sorted = [...allMembers].sort((a, b) => (a.last_name ?? '').localeCompare(b.last_name ?? ''))
    return (excludeId: string) => sorted.filter(m => m.id !== excludeId)
  }, [allMembers])

  const q = search.trim().toLowerCase()

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search name or badge…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-kp-card border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors"
      />

      <form action={action}>
        <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
          <div className="divide-y divide-kp-border">
            {missing.map(m => {
              const name = `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || '—'
              const matches = !q || `${name} ${m.badge_number ?? ''} ${m.pledge_class ?? ''}`.toLowerCase().includes(q)
              return (
                <div
                  key={m.id}
                  style={{ display: matches ? 'flex' : 'none' }}
                  className="items-center gap-4 px-5 py-3.5 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex-1 min-w-[180px]">
                    <div className="text-white text-sm font-semibold">{name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {[m.pledge_class, m.badge_number ? `#${m.badge_number}` : null].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </div>
                  <select
                    name={`bb_${m.id}`}
                    defaultValue=""
                    className="w-full sm:w-72 bg-kp-dark border border-kp-border rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-kp-gold transition-colors"
                  >
                    <option value="">— Leave unset —</option>
                    {optionsByExcludedId(m.id).map(o => (
                      <option key={o.id} value={o.id}>
                        {o.last_name ?? ''}, {o.first_name ?? ''}{o.badge_number ? ` (#${o.badge_number})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

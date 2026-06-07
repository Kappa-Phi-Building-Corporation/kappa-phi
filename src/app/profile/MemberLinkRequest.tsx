'use client'

import { useState } from 'react'
import { requestMemberLink } from './actions'
import type { MemberSummary } from './ProfileForm'

const inp = 'w-full bg-kp-card border border-kp-border rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors'

export default function MemberLinkRequest({
  allMembers,
  linkedMemberIds,
  onBack,
}: {
  allMembers: MemberSummary[]
  linkedMemberIds: string[]
  onBack: () => void
}) {
  const [search, setSearch]       = useState('')
  const [selectedId, setSelectedId] = useState<string>('')

  const linkedSet = new Set(linkedMemberIds)

  const filtered = allMembers
    .filter(m => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        m.first_name?.toLowerCase().includes(q) ||
        m.last_name?.toLowerCase().includes(q) ||
        m.badge_number?.includes(q)
      )
    })
    .sort((a, b) => (a.last_name ?? '').localeCompare(b.last_name ?? ''))

  const selected  = allMembers.find(m => m.id === selectedId) ?? null
  const isConflict = selectedId ? linkedSet.has(selectedId) : false

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-kp-gold font-bold text-lg mb-1">Find Your Member Record</h2>
        <p className="text-gray-400 text-sm">
          Search for your name in the member directory and select your record. An admin will review and approve the link.
        </p>
      </div>

      <input
        type="text"
        placeholder="Search by name or badge number…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className={inp}
      />

      <div className="border border-kp-border rounded-xl overflow-hidden max-h-64 overflow-y-auto bg-kp-card">
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-600 text-sm">No members found.</div>
        )}
        {filtered.map(m => {
          const isSelected = m.id === selectedId
          const hasConflict = linkedSet.has(m.id)
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedId(m.id)}
              className={`w-full px-4 py-2.5 text-left border-b border-kp-border/40 last:border-0 flex items-center justify-between gap-3 transition-colors ${
                isSelected
                  ? 'bg-kp-gold/10 border-l-2 border-kp-gold'
                  : 'hover:bg-kp-surface'
              }`}
            >
              <span>
                <span className={`text-sm font-medium ${isSelected ? 'text-kp-gold' : 'text-white'}`}>
                  {m.last_name}, {m.first_name}
                </span>
                {m.badge_number && (
                  <span className="text-gray-500 text-xs ml-2">#{m.badge_number}</span>
                )}
              </span>
              {hasConflict && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-400 shrink-0">
                  Already linked
                </span>
              )}
            </button>
          )
        })}
      </div>

      {isConflict && (
        <div className="bg-amber-900/20 border border-amber-700/50 text-amber-300 px-4 py-3 rounded-xl text-sm">
          This member record appears to be linked to another account. Submitting will flag it as a conflict for admin review — an admin will sort out the correct association.
        </div>
      )}

      <form action={requestMemberLink} className="flex gap-3">
        <input type="hidden" name="requestedMemberId" value={selectedId} />
        <button
          type="submit"
          disabled={!selectedId}
          className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
        >
          {isConflict ? 'Submit for Admin Review' : 'Request Link'}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors"
        >
          Back
        </button>
      </form>
    </div>
  )
}

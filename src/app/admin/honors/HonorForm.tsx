'use client'

import { useState } from 'react'

type Honor = {
  category: string
  member_id: string | null
  display_name: string
  year_label: string | null
  title: string | null
  sort_order: number
}

type MemberOption = { id: string; label: string }

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'student_knight', label: 'Student Knight' },
  { value: 'highest_gpa', label: 'Highest Initiate GPA' },
  { value: 'ifc_rep', label: 'IFC Representative' },
  { value: 'st_pats_board', label: "St. Pat's Board" },
  { value: 'chapter_president', label: 'Chapter President' },
]

const YEAR_HELP: Record<string, string> = {
  student_knight: 'Four-digit year, e.g. 1977',
  highest_gpa: 'Season and two-digit year, e.g. Fall \'65 or Spg \'98',
  ifc_rep: 'Four-digit year, e.g. 1977',
  st_pats_board: 'Two-digit year, e.g. \'77',
  chapter_president: 'Optional. Leave blank if unknown — order is set by Sort Order.',
}

export default function HonorForm({
  action,
  honor,
  members,
}: {
  action: (formData: FormData) => void | Promise<void>
  honor?: Honor | null
  members: MemberOption[]
}) {
  const [category, setCategory] = useState(honor?.category ?? 'student_knight')
  const [displayName, setDisplayName] = useState(honor?.display_name ?? '')
  const [memberId, setMemberId] = useState(honor?.member_id ?? '')

  function handleMemberChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    setMemberId(id)
    if (id) {
      const m = members.find(m => m.id === id)
      if (m) setDisplayName(m.label)
    }
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className={labelCls}>Category *</label>
        <select
          name="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={inputCls}
        >
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div>
        <label className={labelCls}>Link to Member <span className="text-gray-600 font-normal">(optional)</span></label>
        <select name="member_id" value={memberId} onChange={handleMemberChange} className={inputCls}>
          <option value="">— Not linked —</option>
          {members.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <p className="text-gray-600 text-xs mt-1">Selecting a member fills in the display name below. You can still edit it.</p>
      </div>

      <div>
        <label className={labelCls}>Display Name *</label>
        <input
          name="display_name"
          required
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="e.g. Gary M. Woodard"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Year / Term</label>
          <input name="year_label" defaultValue={honor?.year_label ?? ''} placeholder={YEAR_HELP[category]} className={inputCls} />
          <p className="text-gray-600 text-xs mt-1">{YEAR_HELP[category]}</p>
        </div>
        <div>
          <label className={labelCls}>Title / Role <span className="text-gray-600 font-normal">(optional)</span></label>
          <input
            name="title"
            defaultValue={honor?.title ?? ''}
            placeholder={category === 'st_pats_board' ? 'e.g. Masterguard, St. Pat, Trumpeteer' : 'e.g. President'}
            className={inputCls}
          />
          {category === 'st_pats_board' && (
            <p className="text-gray-600 text-xs mt-1">Used for St. Pat&apos;s Board roles. A member with multiple years/roles gets one row per entry.</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelCls}>Sort Order</label>
        <input
          name="sort_order"
          type="number"
          min="0"
          defaultValue={honor?.sort_order ?? 0}
          className={inputCls + ' max-w-[200px]'}
        />
        <p className="text-gray-600 text-xs mt-1">
          Used as a tiebreaker, and as the primary order for Chapter Presidents (when Year is blank).
        </p>
      </div>

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
          {honor ? 'Save Changes' : 'Add Entry'}
        </button>
      </div>
    </form>
  )
}

'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { GeoMember } from './AlumniMap'

// Leaflet uses window — must be client-only, no SSR
const AlumniMap = dynamic(() => import('./AlumniMap'), { ssr: false })

export type DirectoryMember = {
  id: string
  first_name: string | null
  last_name: string | null
  title: string | null
  nickname: string | null
  badge_number: string | null
  pledge_class: string | null
  big_brother_id: string | null
  graduation_year: number | null
  home_phone: string | null
  mobile_phone: string | null
  phone: string | null
  alternate_phone: string | null
  work_phone: string | null
  email: string | null
  alternate_email: string | null
  address_street: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  employer: string | null
  occupation: string | null
  member_kpbc: boolean | null
  member_advisory: boolean | null
  past_member_advisory: boolean | null
  is_deceased: boolean | null
  is_missing: boolean | null
  hide_entry: boolean | null
  updated_at: string | null
  lat: number | null
  lng: number | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(v: string | null | undefined) { return v || '' }
function yesNo(v: boolean | null) { return v ? 'Yes' : 'No' }
function fmtDate(s: string | null) {
  if (!s) return null
  return new Date(s).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}
function badgeNum(m: DirectoryMember) {
  return parseInt(m.badge_number ?? '999999') || 999999
}

function DetailRow({ label, value, blank = true }: { label: string; value?: string | null; blank?: boolean }) {
  if (!value && !blank) return null
  return (
    <div className="flex gap-1 text-sm leading-snug">
      <span className="text-kp-gold shrink-0">{label}:</span>
      <span className="text-white">{value ?? ''}</span>
    </div>
  )
}

function YNRow({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div className="flex gap-1 text-sm leading-snug">
      <span className="text-kp-gold shrink-0">{label}:</span>
      <span className={value ? 'text-green-400' : 'text-gray-400'}>{yesNo(value)}</span>
    </div>
  )
}

// ── Member detail panel ───────────────────────────────────────────────────────
function MemberDetail({
  member,
  bigBrother,
  isAdmin,
}: {
  member: DirectoryMember
  bigBrother: DirectoryMember | null
  isAdmin: boolean
}) {
  const fullName = [member.title, member.first_name, member.last_name].filter(Boolean).join(' ')
  const location = [member.address_city, member.address_state].filter(Boolean).join(', ')
  const bigBrotherName = bigBrother && !bigBrother.hide_entry
    ? `${bigBrother.first_name ?? ''} ${bigBrother.last_name ?? ''}`.trim()
    : null
  const bigBrotherHidden = bigBrother?.hide_entry ?? false
  const mobilePhone = member.mobile_phone ?? member.phone

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-white">{fullName || '—'}</h2>
          <p className="text-kp-gold text-sm mt-0.5">
            {[member.pledge_class, member.badge_number].filter(Boolean).join(' · ')}
          </p>
          {location && <p className="text-gray-400 text-sm mt-0.5">{location}</p>}
          {member.is_deceased && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">Deceased †</span>
          )}
          {member.is_missing && (
            <span className="inline-block mt-2 ml-1 px-2 py-0.5 bg-yellow-900/40 text-yellow-500 text-xs rounded">Lost Contact</span>
          )}
        </div>
        {isAdmin && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Link
              href={`/admin/members/${member.id}`}
              className="px-3 py-1.5 rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors text-xs no-underline"
            >
              Admin Edit
            </Link>
            {member.hide_entry && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-red-900/40 text-red-400">Hidden from directory</span>
            )}
          </div>
        )}
      </div>

      <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">
        Alumni Information — Contacts
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-1">
        {/* Left: Contact Information */}
        <div className="space-y-1.5">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Contact Information</p>
          <DetailRow label="Address" value={fmt(member.address_street)} />
          <DetailRow label="City, State" value={[member.address_city, member.address_state].filter(Boolean).join(', ') || null} />
          <DetailRow label="Zip Code" value={fmt(member.address_zip)} />
          <div className="pt-1" />
          <DetailRow label="Home Phone" value={fmt(member.home_phone)} />
          <DetailRow label="Primary Mobile" value={fmt(mobilePhone)} />
          <DetailRow label="Alternate Phone" value={fmt(member.alternate_phone)} />
          <DetailRow label="Work Phone" value={fmt(member.work_phone)} />
          <div className="pt-1" />
          <DetailRow label="Primary Email" value={fmt(member.email)} />
          <DetailRow label="Alternate Email" value={fmt(member.alternate_email)} />
          <div className="pt-1" />
          <DetailRow label="Employer" value={fmt(member.employer)} />
          <DetailRow label="Occupation" value={fmt(member.occupation)} />
          {member.updated_at && (
            <>
              <div className="pt-1" />
              <DetailRow label="Last Update" value={fmtDate(member.updated_at)} />
            </>
          )}
        </div>

        {/* Right: Additional Information */}
        <div className="space-y-1.5 mt-6 md:mt-0">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Additional Information</p>
          <DetailRow label="Pledge Class" value={fmt(member.pledge_class)} />
          <DetailRow label="Graduation Year" value={member.graduation_year?.toString()} />
          <DetailRow label="Nickname" value={fmt(member.nickname)} />
          {bigBrotherHidden && isAdmin ? (
            <div className="flex gap-1 text-sm leading-snug">
              <span className="text-kp-gold shrink-0">Big Brother:</span>
              <span className="text-white">{`${bigBrother!.first_name ?? ''} ${bigBrother!.last_name ?? ''}`.trim()}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-red-900/40 text-red-400 self-center">Hidden</span>
            </div>
          ) : (
            <DetailRow label="Big Brother" value={bigBrotherName} />
          )}
          <div className="pt-2" />
          <YNRow label="Current HC Position" value={member.member_kpbc ?? false} />
          <YNRow label="Current Advising Comm" value={member.member_advisory ?? false} />
          <YNRow label="Past Advising Comm" value={member.past_member_advisory ?? false} />
        </div>
      </div>

      {member.badge_number && !member.hide_entry && (
        <div className="mt-6 pt-5 border-t border-kp-border">
          <Link
            href={`/alumni/tree?focus=${member.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-kp-border text-sm text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors no-underline"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 10l5-5 5 5M7 14l5 5 5-5" />
            </svg>
            Show in Family Tree
          </Link>
        </div>
      )}
    </div>
  )
}

// ── Page numbers helper ───────────────────────────────────────────────────────
function pageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages: (number | '…')[] = []
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n) }
  add(0)
  if (current > 2) pages.push('…')
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) add(i)
  if (current < total - 3) pages.push('…')
  add(total - 1)
  return pages
}

// ── Main component ────────────────────────────────────────────────────────────
const PAGE_SIZE = 100

export default function AlumniDirectory({
  members,
  isAdmin,
}: {
  members: DirectoryMember[]
  isAdmin: boolean
}) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<DirectoryMember | null>(null)

  // Members with geocoded coordinates for the map view
  const geoMembers = useMemo(
    () => members.filter((m): m is GeoMember => m.lat != null && m.lng != null),
    [members]
  )

  // Sort by badge number numerically ascending
  const sorted = useMemo(() =>
    [...members].sort((a, b) => badgeNum(a) - badgeNum(b)),
    [members]
  )

  // Filter across name, badge, pledge class, location
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return sorted
    return sorted.filter(m =>
      [m.last_name, m.first_name, m.badge_number, m.pledge_class, m.address_city, m.address_state]
        .join(' ').toLowerCase().includes(q)
    )
  }, [sorted, search])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Build a map for big-brother lookups
  const memberMap = useMemo(() => new Map(members.map(m => [m.id, m])), [members])

  function handleSearch(q: string) {
    setSearch(q)
    setPage(0)
    setSelected(null)
  }

  function selectMember(m: DirectoryMember) {
    setSelected(m)
  }

  const bigBrother = selected?.big_brother_id
    ? (memberMap.get(selected.big_brother_id) ?? null)
    : null

  return (
    <div className="flex h-full">

      {/* ── Left panel: list OR map ──────────────────────────────────────── */}
      <div className={`
        flex flex-col border-r border-kp-border bg-kp-dark
        ${selected ? 'hidden lg:flex lg:w-2/5' : 'flex w-full lg:w-2/5'}
      `}>
        {/* Search + view toggle */}
        <div className="p-4 border-b border-kp-border shrink-0">
          <div className="flex gap-2 mb-2">
            <input
              type="search"
              placeholder="Search name, badge, city…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="flex-1 bg-kp-card border border-kp-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors"
            />
            {/* List / Map toggle */}
            <div className="flex shrink-0 rounded-lg border border-kp-border overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  view === 'list'
                    ? 'bg-kp-gold text-black'
                    : 'bg-kp-card text-gray-400 hover:text-kp-gold'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-3 py-2 text-xs font-semibold border-l border-kp-border transition-colors ${
                  view === 'map'
                    ? 'bg-kp-gold text-black'
                    : 'bg-kp-card text-gray-400 hover:text-kp-gold'
                }`}
              >
                Map
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {view === 'list'
              ? <>
                  {filtered.length} member{filtered.length !== 1 ? 's' : ''}
                  {pageCount > 1 && ` · page ${page + 1} of ${pageCount}`}
                </>
              : <>
                  {geoMembers.length} of {members.length} member{members.length !== 1 ? 's' : ''} on map
                </>
            }
          </p>
        </div>

        {/* Map view */}
        {view === 'map' && (
          <div className="flex-1 min-h-0 relative">
            <AlumniMap
              members={geoMembers}
              selected={selected}
              onSelect={m => setSelected(m)}
            />
          </div>
        )}

        {/* List view — table */}
        {view === 'list' && <div className="overflow-y-auto flex-1 min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-kp-surface z-10">
              <tr className="border-b border-kp-border">
                <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Badge</th>
                <th className="px-4 py-2.5 text-left text-xs text-gray-500 font-semibold uppercase tracking-wider hidden md:table-cell">Location</th>
                {isAdmin && <th className="px-3 py-2.5 w-16" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-kp-border/40">
              {visible.map(m => {
                const isSelected = selected?.id === m.id
                return (
                  <tr
                    key={m.id}
                    onClick={() => selectMember(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-kp-blue/20 border-l-2 border-kp-gold'
                        : 'hover:bg-kp-card'
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <span className="text-white text-sm">
                        {m.last_name}, {m.first_name}
                      </span>
                      {m.is_deceased && <span className="ml-1 text-gray-500 text-xs">†</span>}
                      {m.is_missing && <span className="ml-1 text-yellow-600 text-xs">?</span>}
                      {isAdmin && m.hide_entry && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-red-900/40 text-red-400 align-middle">Hidden</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs hidden sm:table-cell whitespace-nowrap">
                      {[m.pledge_class, m.badge_number].filter(Boolean).join(' - ')}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs hidden md:table-cell whitespace-nowrap">
                      {[m.address_city, m.address_state].filter(Boolean).join(', ')}
                    </td>
                    {isAdmin && (
                      <td className="px-3 py-2.5 text-right">
                        <Link
                          href={`/admin/members/${m.id}`}
                          onClick={e => e.stopPropagation()}
                          className="text-xs text-kp-gold hover:underline no-underline whitespace-nowrap"
                        >
                          Edit
                        </Link>
                      </td>
                    )}
                  </tr>
                )
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 4 : 3} className="px-4 py-10 text-center text-gray-600 text-sm">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>}

        {/* Pagination — list mode only */}
        {view === 'list' && pageCount > 1 && (
          <div className="shrink-0 px-4 py-3 border-t border-kp-border flex items-center justify-between gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-kp-border text-xs text-gray-400 disabled:opacity-30 hover:border-kp-gold hover:text-kp-gold transition-colors"
            >
              ← Prev
            </button>
            <div className="flex gap-1 flex-wrap justify-center">
              {pageRange(page, pageCount).map((p, i) =>
                p === '…'
                  ? <span key={`ellipsis-${i}`} className="px-1 text-gray-600 text-xs self-center">…</span>
                  : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`min-w-[28px] h-7 px-1.5 rounded text-xs font-medium transition-colors ${
                        page === p
                          ? 'bg-kp-gold text-black'
                          : 'border border-kp-border text-gray-400 hover:border-kp-gold hover:text-kp-gold'
                      }`}
                    >
                      {(p as number) + 1}
                    </button>
                  )
              )}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              className="px-3 py-1.5 rounded-lg border border-kp-border text-xs text-gray-400 disabled:opacity-30 hover:border-kp-gold hover:text-kp-gold transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* ── Detail panel ─────────────────────────────────────────────────── */}
      {selected ? (
        <div className={`
          flex-1 overflow-y-auto bg-kp-surface
          ${selected ? 'flex flex-col w-full lg:w-3/5' : 'hidden lg:flex'}
        `}>
          {/* Mobile back button */}
          <div className="lg:hidden border-b border-kp-border px-4 py-3 shrink-0">
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 text-sm hover:text-kp-gold transition-colors"
            >
              ← Back to directory
            </button>
          </div>
          <div className="p-6 lg:p-8">
            <MemberDetail member={selected} bigBrother={bigBrother} isAdmin={isAdmin} />
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-gray-600 text-sm">
          Select a member to view their contact information
        </div>
      )}
    </div>
  )
}

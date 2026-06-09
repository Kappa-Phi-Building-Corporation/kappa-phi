'use client'

import { useState } from 'react'

export type EternalMemberSummary = {
  id: string
  title: string | null
  first_name: string | null
  last_name: string | null
  badge_number: string | null
  pledge_class: string | null
  initiation_date: string | null
  passing_date: string | null
}

export type EternalMember = {
  first_name: string | null
  last_name: string | null
  title: string | null
  badge_number: string | null
  pledge_class: string | null
  initiation_date: string | null
  passing_date: string | null
  memorial_link_url: string | null
  photo_url: string | null
  hide_entry: boolean | null
}

type CreateProps = {
  mode: 'create'
  allMembers: EternalMemberSummary[]
  preselectedId?: string
  action: (fd: FormData) => void | Promise<void>
}

type EditProps = {
  mode: 'edit'
  member: EternalMember
  action: (fd: FormData) => void | Promise<void>
}

type Props = CreateProps | EditProps

const labelCls = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5'
const inputCls = 'w-full bg-kp-dark border border-kp-border rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors'
const dateInputCls = inputCls + ' [color-scheme:dark]'

function fmtDate(d: string | null) {
  if (!d) return null
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function EternalForm(props: Props) {
  const isEdit = props.mode === 'edit'
  const member = isEdit ? props.member : null

  const [previewUrl, setPreviewUrl] = useState<string | null>(member?.photo_url ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  // Split members into those needing entries vs everyone else
  const allMembers = props.mode === 'create' ? props.allMembers : []
  const needsEntry = allMembers.filter(m => !m.passing_date)
  const hasEntry   = allMembers.filter(m =>  m.passing_date)

  return (
    <form action={props.action} className="space-y-6">

      {/* ── Member selector (create mode only) ─── */}
      {!isEdit && (
        <div>
          <label className={labelCls}>Select Member *</label>
          <select
            name="member_id"
            required
            defaultValue={props.mode === 'create' ? (props.preselectedId ?? '') : ''}
            className={inputCls}
          >
            <option value="">— Choose a member —</option>
            {needsEntry.length > 0 && (
              <optgroup label="Needs Chapter Eternal Entry">
                {needsEntry.map(m => (
                  <option key={m.id} value={m.id}>
                    {[m.last_name, m.first_name].filter(Boolean).join(', ')}
                    {m.title ? ` (${m.title})` : ''}
                    {m.badge_number ? ` · Badge #${m.badge_number}` : ''}
                    {m.pledge_class ? ` · ${m.pledge_class}` : ''}
                  </option>
                ))}
              </optgroup>
            )}
            {hasEntry.length > 0 && (
              <optgroup label="Already in Memorial">
                {hasEntry.map(m => (
                  <option key={m.id} value={m.id}>
                    {[m.last_name, m.first_name].filter(Boolean).join(', ')}
                    {m.badge_number ? ` · Badge #${m.badge_number}` : ''}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <p className="text-gray-600 text-xs mt-1">
            Name, badge, pledge class, and initiation date are pulled from the member record automatically.
          </p>
        </div>
      )}

      {/* ── Read-only member info (edit mode only) ─── */}
      {isEdit && member && (
        <div className="bg-kp-dark border border-kp-border rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Member</div>
          <div className="text-white font-semibold text-sm">
            {[member.title, member.first_name, member.last_name].filter(Boolean).join(' ')}
          </div>
          <div className="text-gray-500 text-xs flex flex-wrap gap-x-4 mt-1">
            {member.pledge_class && <span>{member.pledge_class}</span>}
            {member.badge_number && <span>Badge #{member.badge_number}</span>}
            {member.initiation_date && <span>Initiated {fmtDate(member.initiation_date)}</span>}
          </div>
          <p className="text-gray-600 text-xs mt-2">
            To update name or chapter info, edit the{' '}
            <a href="/admin/members" className="text-kp-gold hover:underline">member record</a>.
          </p>
        </div>
      )}

      {/* ── Photo upload ─── */}
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
            <p className="text-gray-600 text-xs">JPEG, PNG, or WebP.</p>
            {member?.photo_url && (
              <p className="text-gray-600 text-xs">Uploading a new file will replace the current photo.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Chapter Eternal date ─── */}
      <div>
        <label className={labelCls}>Chapter Eternal Date *</label>
        <input
          name="passing_date"
          type="date"
          required
          defaultValue={member?.passing_date ?? ''}
          className={dateInputCls}
        />
      </div>

      {/* ── Obituary link ─── */}
      <div>
        <label className={labelCls}>Memorial / Obituary Link <span className="text-gray-600 font-normal">(optional)</span></label>
        <input
          name="memorial_link_url"
          type="url"
          defaultValue={member?.memorial_link_url ?? ''}
          placeholder="https://..."
          className={inputCls}
        />
        <p className="text-gray-600 text-xs mt-1">
          If provided, the member&apos;s name on the memorial page will link to this URL in a new tab.
        </p>
      </div>

      {/* ── Visibility toggle (edit mode only) ─── */}
      {isEdit && (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="show_on_memorial"
            name="show_on_memorial"
            defaultChecked={!member?.hide_entry}
            className="mt-0.5 h-4 w-4 rounded border-kp-border bg-kp-card accent-kp-gold cursor-pointer shrink-0"
          />
          <label htmlFor="show_on_memorial" className="text-sm text-white cursor-pointer leading-snug">
            Show on public memorial page
            <span className="block text-xs text-gray-500 mt-0.5">
              When unchecked, the entry is saved but not visible to visitors.
            </span>
          </label>
        </div>
      )}

      {/* ── Hidden-by-default notice (create mode only) ─── */}
      {!isEdit && (
        <div className="bg-kp-card border border-kp-border rounded-xl px-4 py-3 text-xs text-gray-500">
          New entries are hidden from the public memorial page until you publish them.
          You can toggle visibility after saving.
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-kp-border">
        <button
          type="submit"
          className="bg-kp-gold text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          {isEdit ? 'Save Changes' : 'Add to Memorial'}
        </button>
      </div>
    </form>
  )
}

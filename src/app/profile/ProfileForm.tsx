'use client'

import { useState } from 'react'
import { requestFieldChange, cancelChangeRequest } from './actions'
import { MEMBER_STATUS_OPTIONS } from '@/lib/memberStatus'

// ── Shared types ──────────────────────────────────────────────────────────────
export type MemberRow = {
  id?: string
  title: string | null
  first_name: string | null
  last_name: string | null
  nickname: string | null
  badge_number: string | null
  pledge_class: string | null
  big_brother_id: string | null
  graduation_year: number | null
  completed_undergraduate: boolean | null
  completed_graduate: boolean | null
  email: string | null
  alternate_email: string | null
  phone: string | null
  home_phone: string | null
  mobile_phone: string | null
  alternate_phone: string | null
  work_phone: string | null
  address_street: string | null
  address_city: string | null
  address_state: string | null
  address_zip: string | null
  spouse_title: string | null
  spouse_first_name: string | null
  spouse_last_name: string | null
  marital_status: string | null
  employer: string | null
  occupation: string | null
  bio: string | null
  do_not_mail: boolean | null
  dnm_reason: string | null
  hide_entry: boolean | null
  member_kpbc: boolean | null
  member_advisory: boolean | null
  past_member_kpbc: boolean | null
  past_member_advisory: boolean | null
  is_deceased: boolean | null
  is_missing: boolean | null
  member_status: string | null
  admin_notes: string | null
  initiation_date: string | null
  address_updated_at: string | null
  address_updated_by: string | null
}

export type AccountData = {
  is_approved: boolean
  role: string
  member_id: string | null
}

export type MemberSummary = {
  id: string
  first_name: string | null
  last_name: string | null
  badge_number: string | null
}

export type ChangeRequest = {
  id: string
  badge_number: string | null
  pledge_class: string | null
  big_brother_id: string | null
  note: string | null
}

// ── Styles ────────────────────────────────────────────────────────────────────
const inp = 'w-full bg-kp-card border border-kp-border rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors'
const lbl = 'block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-1.5'

// ── UI helpers ────────────────────────────────────────────────────────────────
function SHead({ title }: { title: string }) {
  return (
    <div className="col-span-2 md:col-span-3 border-b border-kp-border pb-1.5 mt-3 first:mt-0">
      <span className="text-xs font-bold text-kp-gold uppercase tracking-widest">{title}</span>
    </div>
  )
}

function F({ label, name, value, type = 'text', placeholder, full, disabled, forceValue }: {
  label: string; name: string; value?: string | number | null
  type?: string; placeholder?: string; full?: boolean; disabled?: boolean; forceValue?: string
}) {
  const valueProps = disabled && forceValue !== undefined
    ? { value: forceValue }
    : { defaultValue: value ?? '' }
  return (
    <div className={full ? 'col-span-2 md:col-span-3' : ''}>
      <label className={lbl}>{label}</label>
      <input name={name} type={type} {...valueProps} placeholder={placeholder} disabled={disabled}
        className={`${inp} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
    </div>
  )
}

function Sel({ label, name, value, options, full }: {
  label: string; name: string; value?: string | null
  options: { v: string; l: string }[]; full?: boolean
}) {
  return (
    <div className={full ? 'col-span-2 md:col-span-3' : ''}>
      <label className={lbl}>{label}</label>
      <select name={name} defaultValue={value ?? ''} className={inp}>
        <option value="">— None —</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  )
}

function Chk({ label, name, checked, note, full, disabled, forceChecked, onChange }: {
  label: string; name: string; checked?: boolean | null; note?: string; full?: boolean
  disabled?: boolean; forceChecked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const checkedProps = disabled
    ? { checked: forceChecked ?? !!checked }
    : { defaultChecked: !!checked }
  return (
    <div className={`flex items-start gap-3 ${full ? 'col-span-2 md:col-span-3' : ''} ${disabled ? 'opacity-60' : ''}`}>
      <input type="checkbox" id={name} name={name} {...checkedProps} disabled={disabled} onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-kp-border bg-kp-card accent-kp-gold cursor-pointer shrink-0 disabled:cursor-not-allowed" />
      <label htmlFor={name} className="text-sm text-white cursor-pointer leading-snug">
        {label}
        {note && <span className="block text-xs text-gray-500 mt-0.5">{note}</span>}
      </label>
    </div>
  )
}

function ReadRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</dt>
      <dd className="text-white mt-0.5 text-sm">{value ?? <span className="text-gray-600 italic">—</span>}</dd>
    </div>
  )
}

const TITLES  = [{ v:'Mr.',l:'Mr.'},{v:'Mrs.',l:'Mrs.'},{v:'Ms.',l:'Ms.'},{v:'Dr.',l:'Dr.'},{v:'Rev.',l:'Rev.'},{v:'Prof.',l:'Prof.'}]
const MARITAL = [{ v:'Single',l:'Single'},{v:'Married',l:'Married'},{v:'Divorced',l:'Divorced'},{v:'Widowed',l:'Widowed'}]
const ROLES   = [{ v:'member',l:'Member'},{v:'website_admin',l:'Website Admin'},{v:'admin',l:'Admin'}]

// ── Main component ────────────────────────────────────────────────────────────
export default function ProfileForm({
  member,
  accountData,
  members,
  isAdmin = false,
  targetProfileId,
  targetMemberId,
  pendingChangeRequest,
  action,
}: {
  member: MemberRow | null
  accountData?: AccountData
  members: MemberSummary[]
  isAdmin?: boolean
  targetProfileId?: string
  targetMemberId?: string | null
  pendingChangeRequest?: ChangeRequest | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (formData: FormData) => any
}) {
  const [editing, setEditing] = useState(isAdmin || !member?.first_name)
  const [showChangeForm, setShowChangeForm] = useState(false)
  const [memberStatus, setMemberStatus] = useState(member?.member_status ?? 'alumni')
  const [isDeceased, setIsDeceased] = useState(!!member?.is_deceased)

  const forceHidden = memberStatus === 'expelled_other' || isDeceased
  const forcedReason = memberStatus === 'expelled_other' ? 'Expelled / Other' : isDeceased ? 'Deceased' : ''

  const selfMemberId = targetMemberId ?? member?.id
  const bigBrotherOpts = members
    .filter(m => m.id !== selfMemberId)
    .sort((a, b) => (a.last_name ?? '').localeCompare(b.last_name ?? ''))
    .map(m => ({
      v: m.id,
      l: `${m.last_name ?? ''}, ${m.first_name ?? ''}${m.badge_number ? ` (#${m.badge_number})` : ''}`,
    }))

  const bigBrotherName = member?.big_brother_id
    ? members.find(m => m.id === member.big_brother_id)
    : null

  // ── View mode ──────────────────────────────────────────────────────────────
  if (!editing) {
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-kp-gold font-bold text-lg">Member Profile</h2>
          <button
            onClick={() => setEditing(true)}
            className="bg-kp-blue text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-kp-blue-light transition-colors"
          >
            Edit Profile
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
          <ReadRow label="Name" value={[member?.title, member?.first_name, member?.last_name].filter(Boolean).join(' ')} />
          <ReadRow label="Nickname" value={member?.nickname} />
          <ReadRow label="Badge Number" value={member?.badge_number} />
          <ReadRow label="Pledge Class" value={member?.pledge_class} />
          <ReadRow label="Initiation Date" value={
            member?.initiation_date
              ? new Date(member.initiation_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : null
          } />
          <ReadRow label="Big Brother" value={bigBrotherName ? `${bigBrotherName.first_name ?? ''} ${bigBrotherName.last_name ?? ''}`.trim() : null} />
          <ReadRow label="Graduation Year" value={member?.graduation_year} />
          <ReadRow label="Mobile Phone" value={member?.mobile_phone ?? member?.phone} />
          <ReadRow label="Home Phone" value={member?.home_phone} />
          <ReadRow label="Email" value={member?.email} />
          <ReadRow label="Employer" value={member?.employer} />
          <ReadRow label="Occupation" value={member?.occupation} />
          <div className="col-span-2">
            <ReadRow
              label="Address"
              value={[member?.address_street, member?.address_city, member?.address_state, member?.address_zip]
                .filter(Boolean).join(', ') || null}
            />
          </div>
          {member?.bio && (
            <div className="col-span-2"><ReadRow label="Bio / Notes" value={member.bio} /></div>
          )}
        </dl>
      </>
    )
  }

  // ── Edit mode ──────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-kp-gold font-bold text-lg">
          {isAdmin ? 'Edit Member Profile' : 'Member Profile'}
        </h2>
        {!isAdmin && member?.first_name && (
          <button type="button" onClick={() => setEditing(false)}
            className="border border-kp-border text-gray-400 px-4 py-2 rounded-lg text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
            Cancel
          </button>
        )}
      </div>

      {/* ── Locked-fields panel (non-admin only) ──────────────────────────────
          Kept OUTSIDE the main save form to avoid nested <form> elements.     */}
      {!isAdmin && (
        <div className="mb-6 bg-kp-card border border-kp-border rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Chapter Record — Admin Review Required to Change
          </p>
          <dl className="grid grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-gray-500">Badge Number</dt>
              <dd className="text-white text-sm mt-0.5">{member?.badge_number ?? <span className="text-gray-600 italic">—</span>}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Pledge Class</dt>
              <dd className="text-white text-sm mt-0.5">{member?.pledge_class ?? <span className="text-gray-600 italic">—</span>}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Big Brother</dt>
              <dd className="text-white text-sm mt-0.5">
                {bigBrotherName
                  ? `${bigBrotherName.first_name ?? ''} ${bigBrotherName.last_name ?? ''}`.trim()
                  : <span className="text-gray-600 italic">—</span>}
              </dd>
            </div>
          </dl>

          {pendingChangeRequest ? (
            <div className="border-t border-kp-border/50 pt-3 space-y-2">
              <p className="text-xs text-amber-400 font-semibold">Change request pending admin review</p>
              <dl className="grid grid-cols-3 gap-3 text-xs">
                {pendingChangeRequest.badge_number && (
                  <div>
                    <dt className="text-gray-500">Badge →</dt>
                    <dd className="text-white">{pendingChangeRequest.badge_number}</dd>
                  </div>
                )}
                {pendingChangeRequest.pledge_class && (
                  <div>
                    <dt className="text-gray-500">Pledge Class →</dt>
                    <dd className="text-white">{pendingChangeRequest.pledge_class}</dd>
                  </div>
                )}
                {pendingChangeRequest.big_brother_id && (
                  <div>
                    <dt className="text-gray-500">Big Brother →</dt>
                    <dd className="text-white">
                      {(() => {
                        const bb = members.find(m => m.id === pendingChangeRequest.big_brother_id)
                        return bb ? `${bb.first_name ?? ''} ${bb.last_name ?? ''}`.trim() : '—'
                      })()}
                    </dd>
                  </div>
                )}
              </dl>
              {pendingChangeRequest.note && (
                <p className="text-xs text-gray-500 italic">Note: {pendingChangeRequest.note}</p>
              )}
              <form action={cancelChangeRequest}>
                <input type="hidden" name="requestId" value={pendingChangeRequest.id} />
                <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition-colors underline">
                  Cancel request
                </button>
              </form>
            </div>
          ) : showChangeForm ? (
            <div className="border-t border-kp-border/50 pt-3">
              <p className="text-xs font-semibold text-kp-gold mb-3">Request Changes</p>
              <form action={requestFieldChange} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Badge Number</label>
                    <input name="badge_number" type="text" defaultValue={member?.badge_number ?? ''} className={inp} placeholder="e.g. 123" />
                  </div>
                  <div>
                    <label className={lbl}>Pledge Class</label>
                    <input name="pledge_class" type="text" defaultValue={member?.pledge_class ?? ''} className={inp} placeholder="e.g. Fall 2003" />
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>Big Brother</label>
                    <select name="big_brother_id" defaultValue={member?.big_brother_id ?? ''} className={inp}>
                      <option value="">— None —</option>
                      {bigBrotherOpts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>
                      Note / Reason{' '}
                      <span className="text-gray-600 normal-case font-normal">(optional)</span>
                    </label>
                    <textarea name="note" rows={2} className={`${inp} resize-none`}
                      placeholder="Explain what needs correcting…" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit"
                    className="bg-kp-gold text-black font-bold px-4 py-2 rounded-lg text-xs hover:opacity-90 transition-opacity">
                    Submit Request
                  </button>
                  <button type="button" onClick={() => setShowChangeForm(false)}
                    className="border border-kp-border text-gray-400 px-4 py-2 rounded-lg text-xs hover:border-gray-500 hover:text-gray-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border-t border-kp-border/50 pt-3">
              <button type="button" onClick={() => setShowChangeForm(true)}
                className="text-xs text-kp-gold hover:opacity-80 transition-opacity underline">
                Request a change to these fields
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Main save form ──────────────────────────────────────────────────── */}
      <form action={action} className="space-y-6">
        {/* Hidden routing fields */}
        {targetProfileId && <input type="hidden" name="targetProfileId" value={targetProfileId} />}
        {targetMemberId  && <input type="hidden" name="targetMemberId"  value={targetMemberId} />}

        {/* Preserve locked field values so they aren't wiped on save */}
        {!isAdmin && (
          <>
            <input type="hidden" name="badge_number"   value={member?.badge_number   ?? ''} />
            <input type="hidden" name="pledge_class"   value={member?.pledge_class   ?? ''} />
            <input type="hidden" name="big_brother_id" value={member?.big_brother_id ?? ''} />
          </>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">

          <SHead title="Personal Information" />
          <Sel label="Title" name="title" value={member?.title} options={TITLES} />
          <F label="First Name *" name="first_name" value={member?.first_name} />
          <F label="Last Name *"  name="last_name"  value={member?.last_name} />
          <F label="Nickname"     name="nickname"   value={member?.nickname} />

          <SHead title="Spouse / Family" />
          <Sel label="Spouse Title"      name="spouse_title"      value={member?.spouse_title} options={TITLES} />
          <F   label="Spouse First Name" name="spouse_first_name" value={member?.spouse_first_name} />
          <F   label="Spouse Last Name"  name="spouse_last_name"  value={member?.spouse_last_name} />
          <Sel label="Marital Status"    name="marital_status"    value={member?.marital_status} options={MARITAL} />

          <SHead title="Contact" />
          <F label="Home Phone"      name="home_phone"      value={member?.home_phone}      type="tel" />
          <F label="Mobile Phone"    name="mobile_phone"    value={member?.mobile_phone ?? member?.phone} type="tel" />
          <F label="Work Phone"      name="work_phone"      value={member?.work_phone}      type="tel" />
          <F label="Alternate Phone" name="alternate_phone" value={member?.alternate_phone} type="tel" />
          <F label="Primary Email"   name="email"           value={member?.email}           type="email" />
          <F label="Alternate Email" name="alternate_email" value={member?.alternate_email} type="email" />

          <SHead title="Address" />
          <F label="Street" name="address_street" value={member?.address_street} full />
          <F label="City"   name="address_city"   value={member?.address_city} />
          <div className="grid grid-cols-2 gap-3">
            <F label="State" name="address_state" value={member?.address_state} placeholder="MO" />
            <F label="ZIP"   name="address_zip"   value={member?.address_zip} />
          </div>
          {member?.address_updated_at && (
            <p className="text-xs text-gray-500 -mt-2">
              Last updated {new Date(member.address_updated_at).toLocaleDateString()} by {member.address_updated_by}
            </p>
          )}

          <SHead title="Chapter" />
          {isAdmin && (
            <>
              <F   label="Badge Number"    name="badge_number"    value={member?.badge_number} />
              <F   label="Pledge Class"    name="pledge_class"    value={member?.pledge_class} />
              <Sel label="Big Brother"     name="big_brother_id"  value={member?.big_brother_id} options={bigBrotherOpts} />
              <F   label="Initiation Date" name="initiation_date" value={member?.initiation_date} type="date" />
            </>
          )}
          <F label="Graduation Year" name="graduation_year" value={member?.graduation_year} type="number" placeholder="2005" />
          <div className="col-span-2 md:col-span-3 flex flex-wrap gap-x-8 gap-y-2">
            <Chk label="Completed Undergraduate Degree" name="completed_undergraduate" checked={member?.completed_undergraduate} />
            <Chk label="Completed Graduate Degree"      name="completed_graduate"      checked={member?.completed_graduate} />
          </div>

          <SHead title="Professional" />
          <F label="Employer"           name="employer"   value={member?.employer} />
          <F label="Occupation / Title" name="occupation" value={member?.occupation} />
        </div>

        <div>
          <label className={lbl}>Bio / Notes</label>
          <textarea name="bio" rows={4} defaultValue={member?.bio ?? ''}
            className={`${inp} resize-y`}
            placeholder="Share what you've been up to since graduation..." />
        </div>

        {/* Admin-only section */}
        {isAdmin && (
          <div className="border border-amber-800/50 rounded-xl p-5 space-y-5 bg-amber-950/20">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Administration</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
              <SHead title="Member Status" />
              <div className="col-span-2 md:col-span-3 flex flex-wrap gap-x-8 gap-y-2">
                {MEMBER_STATUS_OPTIONS.map(o => (
                  <label key={o.v} htmlFor={`member_status_${o.v}`} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input
                      type="radio"
                      id={`member_status_${o.v}`}
                      name="member_status"
                      value={o.v}
                      defaultChecked={(member?.member_status ?? 'alumni') === o.v}
                      onChange={() => setMemberStatus(o.v)}
                      className="h-4 w-4 accent-kp-gold cursor-pointer"
                    />
                    {o.l}
                  </label>
                ))}
              </div>
              <div className="col-span-2 md:col-span-3 flex flex-wrap gap-x-8 gap-y-2">
                <Chk label="Deceased" name="is_deceased" checked={member?.is_deceased}
                  onChange={e => setIsDeceased(e.target.checked)} />
                <Chk label="Missing / Lost Contact" name="is_missing" checked={member?.is_missing} />
              </div>
              <p className="col-span-2 md:col-span-3 text-xs text-gray-500">
                Members marked Expelled / Other will not appear in the Alumni Directory or Big Brother Tree.
              </p>

              <SHead title="Mailing" />
              <Chk label="Do Not Mail" name="do_not_mail" checked={member?.do_not_mail}
                disabled={forceHidden} forceChecked />
              <Chk label="Hide Entry"  name="hide_entry"  checked={member?.hide_entry}
                note="Hides member from alumni directory" disabled={forceHidden} forceChecked />
              <F label="DNM Reason" name="dnm_reason" value={member?.dnm_reason} full
                disabled={forceHidden} forceValue={forcedReason} />

              <SHead title="Chapter Involvement" />
              <Chk label="Member of Kappa Phi Building Corp"  name="member_kpbc"        checked={member?.member_kpbc} />
              <Chk label="Member of Advisory Committee"       name="member_advisory"     checked={member?.member_advisory} />
              <Chk label="Past Member of KPBC"               name="past_member_kpbc"    checked={member?.past_member_kpbc} />
              <Chk label="Past Member of Advisory Committee" name="past_member_advisory" checked={member?.past_member_advisory} />

              <SHead title="Admin Notes" />
              <div className="col-span-2 md:col-span-3">
                <textarea name="admin_notes" rows={3} defaultValue={member?.admin_notes ?? ''}
                  className={`${inp} resize-y`}
                  placeholder="Internal notes for admins — not visible to the member..." />
              </div>

              {accountData !== undefined && (
                <>
                  <SHead title="Account" />
                  <Chk label="Approved" name="is_approved" checked={accountData.is_approved} />
                  <Sel label="Role"     name="role"        value={accountData.role} options={ROLES} />
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit"
            className="bg-kp-gold text-black font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
            Save Changes
          </button>
          {!isAdmin && member?.first_name && (
            <button type="button" onClick={() => setEditing(false)}
              className="border border-kp-border text-gray-400 px-7 py-3 rounded-xl text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  )
}

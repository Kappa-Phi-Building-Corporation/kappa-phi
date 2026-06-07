'use client'

import { useActionState, useState } from 'react'
import ProfileForm from './ProfileForm'
import MemberLinkRequest from './MemberLinkRequest'
import { updateProfile, syncMemberToAccount, cancelLinkRequest } from './actions'
import type { MemberSyncState } from './actions'
import type { MemberRow, MemberSummary, ChangeRequest } from './ProfileForm'

function SyncModal({ state }: { state: Extract<MemberSyncState, { type: 'syncToAccount' }> }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-2">Update User Account?</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your member profile was saved. Your user account still shows:
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 mb-5 text-sm">
          <dt className="text-gray-500">Name</dt>
          <dd className="text-white">{[state.authFirstName, state.authLastName].filter(Boolean).join(' ') || '—'}</dd>
          <dt className="text-gray-500">Email</dt>
          <dd className="text-white">{state.authEmail || '—'}</dd>
        </dl>
        <p className="text-gray-400 text-sm mb-5">Update your user account to match?</p>
        <div className="flex gap-3">
          <form action={syncMemberToAccount}>
            <input type="hidden" name="firstName" value={state.firstName} />
            <input type="hidden" name="lastName"  value={state.lastName} />
            <input type="hidden" name="email"     value={state.email} />
            <button type="submit"
              className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Yes, Update Account
            </button>
          </form>
          <a href="/profile?saved=1"
            className="px-5 py-2.5 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors no-underline">
            No, Keep Separate
          </a>
        </div>
      </div>
    </div>
  )
}

type Mode = 'choose' | 'search' | 'manual'

export default function MemberProfileSection({
  member,
  allMembers,
  targetMemberId,
  linkRequestStatus,
  requestedMember,
  linkedMemberIds,
  pendingChangeRequest,
}: {
  member: MemberRow | null
  allMembers: MemberSummary[]
  targetMemberId: string | null
  linkRequestStatus: string | null
  requestedMember: MemberSummary | null
  linkedMemberIds: string[]
  pendingChangeRequest?: ChangeRequest | null
}) {
  const [state, formAction] = useActionState<MemberSyncState, FormData>(updateProfile, null)
  const [mode, setMode] = useState<Mode>('choose')

  // ── Has a linked member → normal edit form ─────────────────────────────────
  if (member) {
    return (
      <>
        <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
          {state?.type === 'error' && (
            <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
              <span>⚠</span> {state.message}
            </div>
          )}
          <ProfileForm
            member={member}
            members={allMembers}
            targetMemberId={targetMemberId}
            pendingChangeRequest={pendingChangeRequest}
            action={formAction as (formData: FormData) => void}
          />
        </div>
        {state?.type === 'syncToAccount' && <SyncModal state={state} />}
      </>
    )
  }

  // ── Pending or conflict request ────────────────────────────────────────────
  if (linkRequestStatus === 'pending' || linkRequestStatus === 'conflict') {
    return (
      <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
        <h2 className="text-kp-gold font-bold text-lg mb-4">Member Profile</h2>
        <div className={`rounded-xl border px-5 py-4 mb-5 ${
          linkRequestStatus === 'conflict'
            ? 'bg-amber-900/20 border-amber-700/50'
            : 'bg-kp-blue/10 border-kp-blue/40'
        }`}>
          <p className={`font-semibold text-sm mb-1 ${
            linkRequestStatus === 'conflict' ? 'text-amber-300' : 'text-blue-300'
          }`}>
            {linkRequestStatus === 'conflict'
              ? 'Conflict detected — pending admin review'
              : 'Link request pending admin review'}
          </p>
          <p className="text-gray-400 text-sm">
            {linkRequestStatus === 'conflict'
              ? 'The member record you selected appears to be linked to another account. An admin will review and resolve the conflict.'
              : 'Your request to link your account to a member record is being reviewed by an admin.'}
          </p>
          {requestedMember && (
            <p className="text-gray-300 text-sm mt-2">
              Requested member:{' '}
              <strong>{requestedMember.first_name} {requestedMember.last_name}</strong>
              {requestedMember.badge_number && (
                <span className="text-gray-500 ml-1">#{requestedMember.badge_number}</span>
              )}
            </p>
          )}
        </div>
        <form action={cancelLinkRequest}>
          <button type="submit"
            className="px-4 py-2 rounded-lg border border-kp-border text-gray-400 text-sm hover:border-red-700 hover:text-red-400 transition-colors">
            Cancel Request
          </button>
        </form>
      </div>
    )
  }

  // ── Request was denied ─────────────────────────────────────────────────────
  if (linkRequestStatus === 'denied') {
    return (
      <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
        <h2 className="text-kp-gold font-bold text-lg mb-4">Member Profile</h2>
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl px-5 py-4 mb-5">
          <p className="font-semibold text-red-300 text-sm mb-1">Link request denied</p>
          <p className="text-gray-400 text-sm">
            Your request was not approved. You can search again or enter your information manually below.
          </p>
        </div>
        <div className="flex gap-3">
          <form action={cancelLinkRequest}>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-kp-blue text-white text-sm hover:bg-kp-blue-light transition-colors">
              Try Again
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── No member, no pending request → choice UI ──────────────────────────────
  return (
    <>
      <div className="bg-kp-surface border border-kp-border rounded-2xl p-8">
        {mode === 'choose' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-kp-gold font-bold text-lg mb-1">Member Profile</h2>
              <p className="text-gray-400 text-sm">
                Are you already listed in the member directory?
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('search')}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-kp-border hover:border-kp-gold bg-kp-card hover:bg-kp-gold/5 transition-colors text-left"
              >
                <span className="text-kp-gold font-semibold text-sm group-hover:underline">
                  Yes — find my record
                </span>
                <span className="text-gray-500 text-xs leading-snug">
                  Search the member directory and request to link your account to an existing record.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-kp-border hover:border-kp-blue bg-kp-card hover:bg-kp-blue/5 transition-colors text-left"
              >
                <span className="text-blue-300 font-semibold text-sm group-hover:underline">
                  No — enter my info
                </span>
                <span className="text-gray-500 text-xs leading-snug">
                  You're not in the directory yet. Fill in your details to create your member profile.
                </span>
              </button>
            </div>
          </div>
        )}

        {mode === 'search' && (
          <MemberLinkRequest
            allMembers={allMembers}
            linkedMemberIds={linkedMemberIds}
            onBack={() => setMode('choose')}
          />
        )}

        {mode === 'manual' && (
          <>
            {state?.type === 'error' && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm flex gap-2">
                <span>⚠</span> {state.message}
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <button type="button" onClick={() => setMode('choose')}
                className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                ← Back
              </button>
            </div>
            <ProfileForm
              member={null}
              members={allMembers}
              targetMemberId={null}
              action={formAction as (formData: FormData) => void}
            />
          </>
        )}
      </div>

      {state?.type === 'syncToAccount' && <SyncModal state={state} />}
    </>
  )
}

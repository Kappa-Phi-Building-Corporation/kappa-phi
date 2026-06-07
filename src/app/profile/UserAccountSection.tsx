'use client'

import { useActionState, useState } from 'react'
import { updateUserAccount, updatePassword, syncAccountToMember } from './actions'
import type { AccountSyncState, PasswordState } from './actions'

const inp = 'w-full bg-kp-card border border-kp-border rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors'
const lbl = 'block text-xs font-semibold text-kp-gold uppercase tracking-wider mb-1.5'

function SyncModal({ state }: { state: Extract<AccountSyncState, { type: 'syncToMember' }> }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-2">Update Member Profile?</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your account info was saved. Your linked member profile still shows:
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 mb-5 text-sm">
          <dt className="text-gray-500">Name</dt>
          <dd className="text-white">
            {[state.memberFirstName, state.memberLastName].filter(Boolean).join(' ') || '—'}
          </dd>
          <dt className="text-gray-500">Email</dt>
          <dd className="text-white">{state.memberEmail || '—'}</dd>
        </dl>
        <p className="text-gray-400 text-sm mb-5">Update your member profile to match?</p>
        <div className="flex gap-3">
          <form action={syncAccountToMember}>
            <input type="hidden" name="memberId"  value={state.memberId} />
            <input type="hidden" name="firstName" value={state.firstName} />
            <input type="hidden" name="lastName"  value={state.lastName} />
            <input type="hidden" name="email"     value={state.email} />
            <button type="submit"
              className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Yes, Update Member Profile
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

export default function UserAccountSection({
  authEmail,
  authFirstName,
  authLastName,
  memberId,
  memberFirstName,
  memberLastName,
  memberEmail,
}: {
  authEmail: string
  authFirstName: string
  authLastName: string
  memberId: string | null
  memberFirstName: string | null
  memberLastName: string | null
  memberEmail: string | null
}) {
  const [view, setView] = useState<'idle' | 'editInfo' | 'editPassword'>('idle')
  const [accountState, accountAction, accountPending] = useActionState<AccountSyncState, FormData>(updateUserAccount, null)
  const [passwordState, passwordAction, passwordPending] = useActionState<PasswordState, FormData>(updatePassword, null)

  const displayName = [authFirstName, authLastName].filter(Boolean).join(' ')

  return (
    <>
      <div className="bg-kp-surface border border-kp-border rounded-2xl p-6">
        <div className="flex justify-between items-start mb-5">
          <h2 className="text-kp-gold font-bold text-lg">User Account</h2>
          {view === 'idle' && (
            <div className="flex gap-2">
              <button onClick={() => setView('editInfo')}
                className="px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-gold hover:text-kp-gold transition-colors">
                Update Info
              </button>
              <button onClick={() => setView('editPassword')}
                className="px-3 py-1.5 text-xs rounded-lg border border-kp-border text-gray-300 hover:border-kp-blue hover:text-blue-300 transition-colors">
                Change Password
              </button>
            </div>
          )}
        </div>

        {view === 'idle' && (
          <div className="space-y-0.5">
            <p className="text-white font-medium">{displayName || '—'}</p>
            <p className="text-gray-400 text-sm">{authEmail}</p>
          </div>
        )}

        {view === 'editInfo' && (
          <form action={accountAction} className="space-y-4">
            {accountState?.type === 'error' && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
                {accountState.message}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>First Name</label>
                <input name="firstName" type="text" defaultValue={authFirstName} className={inp} required />
              </div>
              <div>
                <label className={lbl}>Last Name</label>
                <input name="lastName" type="text" defaultValue={authLastName} className={inp} required />
              </div>
              <div className="col-span-2">
                <label className={lbl}>Email Address</label>
                <input name="email" type="email" defaultValue={authEmail} className={inp} required />
                <p className="text-xs text-gray-600 mt-1">Changing your email will require re-confirmation at the new address.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={accountPending}
                className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {accountPending ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={() => setView('idle')}
                className="px-5 py-2.5 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}

        {view === 'editPassword' && (
          <form action={passwordAction} className="space-y-4">
            {passwordState?.type === 'error' && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 rounded-xl text-sm">
                {passwordState.message}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>New Password</label>
                <input name="password" type="password" className={inp} required minLength={8} placeholder="At least 8 characters" />
              </div>
              <div>
                <label className={lbl}>Confirm Password</label>
                <input name="confirm" type="password" className={inp} required minLength={8} placeholder="Repeat new password" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={passwordPending}
                className="bg-kp-gold text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {passwordPending ? 'Updating…' : 'Update Password'}
              </button>
              <button type="button" onClick={() => setView('idle')}
                className="px-5 py-2.5 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {accountState?.type === 'syncToMember' && <SyncModal state={accountState} />}
    </>
  )
}

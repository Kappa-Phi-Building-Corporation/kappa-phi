'use client'

import { useState } from 'react'
import { approveLinkRequest, approveWithMember, denyLinkRequest } from './actions'
import type { MemberSummary } from '@/app/profile/ProfileForm'

export default function LinkRequestActions({
  profileId,
  requestedMemberId,
  allMembers,
}: {
  profileId: string
  requestedMemberId: string
  allMembers: MemberSummary[]
}) {
  const [showApprove, setShowApprove] = useState(false)
  const [showSwap,    setShowSwap]    = useState(false)
  const [showDeny,    setShowDeny]    = useState(false)
  const [swapSearch,  setSwapSearch]  = useState('')
  const [swapId,      setSwapId]      = useState('')

  const filteredMembers = allMembers
    .filter(m => {
      if (!swapSearch) return true
      const q = swapSearch.toLowerCase()
      return (
        m.first_name?.toLowerCase().includes(q) ||
        m.last_name?.toLowerCase().includes(q) ||
        m.badge_number?.includes(q)
      )
    })
    .sort((a, b) => (a.last_name ?? '').localeCompare(b.last_name ?? ''))

  const inp = 'w-full bg-kp-card border border-kp-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue focus:ring-1 focus:ring-kp-blue transition-colors'

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => setShowApprove(true)}
          className="px-3 py-1.5 rounded-lg bg-green-800/60 text-green-300 text-xs font-semibold hover:bg-green-700/60 transition-colors">
          Approve
        </button>
        <button type="button" onClick={() => setShowSwap(true)}
          className="px-3 py-1.5 rounded-lg bg-kp-blue/30 text-blue-300 text-xs font-semibold hover:bg-kp-blue/50 transition-colors">
          Link Different
        </button>
        <button type="button" onClick={() => setShowDeny(true)}
          className="px-3 py-1.5 rounded-lg bg-red-900/40 text-red-400 text-xs font-semibold hover:bg-red-800/40 transition-colors">
          Deny
        </button>
      </div>

      {/* Approve confirm */}
      {showApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-2">Approve Link Request?</h3>
            <p className="text-gray-400 text-sm mb-5">
              This will link this account to the requested member record. Any existing link for that member will be removed.
            </p>
            <div className="flex gap-3">
              <form action={approveLinkRequest}>
                <input type="hidden" name="profileId"  value={profileId} />
                <input type="hidden" name="memberId"   value={requestedMemberId} />
                <button type="submit"
                  className="bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-green-600 transition-colors">
                  Approve
                </button>
              </form>
              <button type="button" onClick={() => setShowApprove(false)}
                className="px-4 py-2 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Different modal */}
      {showSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-2">Link to a Different Member</h3>
            <p className="text-gray-400 text-sm mb-4">
              Override the user's request and link their account to a different member record.
            </p>
            <input
              type="text"
              placeholder="Search by name or badge number…"
              value={swapSearch}
              onChange={e => setSwapSearch(e.target.value)}
              className={`${inp} mb-3`}
            />
            <div className="border border-kp-border rounded-xl overflow-hidden max-h-52 overflow-y-auto bg-kp-card mb-4">
              {filteredMembers.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-600 text-sm">No members found.</div>
              )}
              {filteredMembers.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSwapId(m.id)}
                  className={`w-full px-4 py-2.5 text-left border-b border-kp-border/40 last:border-0 flex items-center gap-3 transition-colors ${
                    swapId === m.id ? 'bg-kp-gold/10 border-l-2 border-kp-gold' : 'hover:bg-kp-surface'
                  }`}
                >
                  <span className={`text-sm font-medium ${swapId === m.id ? 'text-kp-gold' : 'text-white'}`}>
                    {m.last_name}, {m.first_name}
                  </span>
                  {m.badge_number && (
                    <span className="text-gray-500 text-xs">#{m.badge_number}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <form action={approveWithMember}>
                <input type="hidden" name="profileId"   value={profileId} />
                <input type="hidden" name="newMemberId" value={swapId} />
                <button type="submit" disabled={!swapId}
                  className="bg-kp-gold text-black font-bold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-30">
                  Approve & Link
                </button>
              </form>
              <button type="button" onClick={() => setShowSwap(false)}
                className="px-4 py-2 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny confirm */}
      {showDeny && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-2">Deny Link Request?</h3>
            <p className="text-gray-400 text-sm mb-5">
              The user will be notified that their request was denied and can try again.
            </p>
            <div className="flex gap-3">
              <form action={denyLinkRequest}>
                <input type="hidden" name="profileId" value={profileId} />
                <button type="submit"
                  className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition-colors">
                  Deny
                </button>
              </form>
              <button type="button" onClick={() => setShowDeny(false)}
                className="px-4 py-2 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState } from 'react'
import { approveUser, approveLinkUser, denyUser } from './actions'

type Member = {
  id: string
  first_name: string | null
  last_name: string | null
  badge_number: string | null
}

export function ApproveActions({
  userId,
  allMembers,
}: {
  userId: string
  allMembers: Member[]
}) {
  const [showConfirm, setShowConfirm]   = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [search, setSearch]               = useState('')

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

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="px-3 py-1 text-xs rounded-lg bg-green-700 hover:bg-green-600 text-white font-medium transition-colors"
        >
          Approve
        </button>

        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="px-3 py-1 text-xs rounded-lg bg-kp-blue hover:bg-kp-blue-light text-white font-medium transition-colors"
        >
          Approve &amp; Link
        </button>

        <form action={denyUser.bind(null, userId)}>
          <button className="px-3 py-1 text-xs rounded-lg bg-red-800 hover:bg-red-700 text-white font-medium transition-colors">
            Deny &amp; Delete
          </button>
        </form>
      </div>

      {/* Confirm approve without link */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false) }}
        >
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Approve without linking?</h3>
            <p className="text-gray-400 text-sm mb-5">
              This user will be approved but not linked to any member record. You can link them to a member later from their account edit page.
            </p>
            <div className="flex gap-3">
              <form action={approveUser.bind(null, userId)}>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Yes, Approve
                </button>
              </form>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve & Link modal */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={e => { if (e.target === e.currentTarget) setShowLinkModal(false) }}
        >
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold text-lg">Link to Member Record</h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-gray-500 hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Select the existing member record to associate with this account, then approve.
            </p>

            <form action={approveLinkUser} onSubmit={() => setShowLinkModal(false)}>
              <input type="hidden" name="userId" value={userId} />

              <input
                type="text"
                placeholder="Search by name or badge…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-kp-card border border-kp-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-blue mb-3"
              />

              <select
                name="memberId"
                required
                size={8}
                className="w-full bg-kp-card border border-kp-border rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-kp-blue mb-4"
              >
                {filtered.length === 0 && (
                  <option disabled value="">No members match</option>
                )}
                {filtered.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.last_name ?? ''}, {m.first_name ?? ''}{m.badge_number ? ` — #${m.badge_number}` : ''}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-kp-gold text-black font-bold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  Approve &amp; Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-kp-border text-gray-400 text-sm hover:border-gray-500 hover:text-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

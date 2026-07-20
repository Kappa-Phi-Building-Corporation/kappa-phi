import Link from 'next/link'
import { addMemory, deleteMemory } from './actions'

export type Memory = {
  id: string
  author_name: string
  author_profile_id: string | null
  message: string
  created_at: string
}

export default function MemoryPanel({
  memberId,
  memberName,
  memories,
  currentUserId,
  isAdmin,
}: {
  memberId: string
  memberName: string
  memories: Memory[]
  currentUserId: string
  isAdmin: boolean
}) {
  return (
    <div id="memories" className="fixed inset-0 z-50">
      {/* Backdrop — a full-screen link back to the base page closes the panel with no JS needed */}
      <Link href="/alumni/chapter-eternal" aria-label="Close" className="absolute inset-0 bg-black/70" />

      {/* Panel */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-kp-surface border-l border-kp-border shadow-2xl flex flex-col">
        <div className="px-6 py-5 border-b border-kp-border flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-1">Memories &amp; Messages</div>
            <h2 className="text-white font-bold text-lg leading-tight">{memberName}</h2>
          </div>
          <Link
            href="/alumni/chapter-eternal"
            className="text-gray-500 hover:text-white transition-colors text-2xl leading-none no-underline shrink-0"
          >
            ×
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {memories.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No memories shared yet — be the first.</p>
          ) : (
            memories.map(m => (
              <div key={m.id} className="bg-kp-card border border-kp-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="text-kp-gold text-sm font-semibold">{m.author_name}</span>
                  <span className="text-gray-600 text-xs shrink-0 whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{m.message}</p>
                {(isAdmin || m.author_profile_id === currentUserId) && (
                  <form action={deleteMemory} className="mt-2">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="member_id" value={memberId} />
                    <button type="submit" className="text-red-400 text-xs hover:underline">Delete</button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>

        <form action={addMemory} className="px-6 py-5 border-t border-kp-border space-y-3 shrink-0">
          <input type="hidden" name="member_id" value={memberId} />
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Share a memory
          </label>
          <textarea
            name="message"
            required
            rows={3}
            placeholder={`Share a memory of ${memberName}…`}
            className="w-full bg-kp-dark border border-kp-border rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-kp-gold transition-colors resize-y"
          />
          <button
            type="submit"
            className="w-full bg-kp-gold text-black font-bold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Post Memory
          </button>
        </form>
      </div>
    </div>
  )
}

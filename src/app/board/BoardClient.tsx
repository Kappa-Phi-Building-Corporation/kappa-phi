'use client'

import { useState, useEffect, useCallback } from 'react'

export type BoardMember = {
  id: string
  name: string
  role: string
  email?: string | null
  bio: string[]       // pre-split paragraphs
  goals: string[]     // pre-split paragraphs
  goals_bulleted: boolean
  photo_url?: string | null
}

// ─── Helpers ──────────────────────────────────────────────────────

function initials(name: string) {
  return name.replace(/^Dr\.\s+/, '').split(' ').map(n => n[0]).slice(0, 2).join('')
}

// ─── Card ─────────────────────────────────────────────────────────

function MemberCard({
  member,
  onClick,
  variant = 'director',
}: {
  member: BoardMember
  onClick: () => void
  variant?: 'officer' | 'director'
}) {
  const lg = variant === 'officer'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-kp-surface border border-kp-border hover:border-kp-gold rounded-2xl overflow-hidden transition-colors duration-200 w-full text-center cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-kp-gold ${lg ? 'p-7' : 'p-5'}`}
    >
      <div className={`rounded-2xl mx-auto relative overflow-hidden bg-kp-blue group-hover:ring-2 group-hover:ring-kp-gold transition-all ${lg ? 'w-28 h-32 mb-4' : 'w-20 h-24 mb-3'}`}>
        <span className={`absolute inset-0 flex items-center justify-center text-kp-gold font-black ${lg ? 'text-2xl' : 'text-base'}`}>
          {initials(member.name)}
        </span>
        {member.photo_url && (
          <img
            src={member.photo_url}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        )}
      </div>

      <div className={`text-white font-semibold leading-tight ${lg ? 'text-base' : 'text-sm'}`}>
        {member.name}
      </div>
      <div className={`text-kp-gold font-medium mt-1 ${lg ? 'text-sm' : 'text-xs'}`}>
        {member.role}
      </div>

      <div className="flex items-center justify-center gap-1 mt-3 text-gray-600 group-hover:text-gray-400 transition-colors text-xs">
        <span>View profile</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────

function Drawer({ member, onClose }: { member: BoardMember | null; onClose: () => void }) {
  const isOpen = member !== null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={member ? `${member.name} profile` : 'Member profile'}
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-kp-surface border-l border-kp-border z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {member && (
          <div className="p-8">
            {/* Close */}
            <div className="flex justify-end mb-6">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-kp-gold"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Identity */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-24 rounded-2xl relative overflow-hidden bg-kp-blue shrink-0">
                <span className="absolute inset-0 flex items-center justify-center text-kp-gold font-black text-xl">
                  {initials(member.name)}
                </span>
                {member.photo_url && (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}
              </div>
              <div>
                <div className="text-white text-xl font-bold leading-tight">{member.name}</div>
                <div className="text-kp-gold text-sm font-medium mt-1">{member.role}</div>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-kp-gold transition-colors mt-2 no-underline"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {member.email}
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {member.bio.length > 0 && (
                <section>
                  <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Biography</div>
                  <div className="space-y-3">
                    {member.bio.map((p, i) => (
                      <p key={i} className="text-gray-300 text-sm leading-relaxed">{p}</p>
                    ))}
                  </div>
                </section>
              )}

              {member.goals.length > 0 && (
                <section>
                  <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Goals &amp; Updates</div>
                  {member.goals_bulleted ? (
                    <ul className="space-y-2">
                      {member.goals.map((g, i) => (
                        <li key={i} className="flex gap-2 text-gray-300 text-sm leading-relaxed">
                          <span className="text-kp-gold mt-0.5 shrink-0">◆</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-3">
                      {member.goals.map((g, i) => (
                        <p key={i} className="text-gray-300 text-sm leading-relaxed">{g}</p>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Main export ──────────────────────────────────────────────────

export default function BoardClient({
  officers,
  directors,
}: {
  officers: BoardMember[]
  directors: BoardMember[]
}) {
  const [activeMember, setActiveMember] = useState<BoardMember | null>(null)
  const close = useCallback(() => setActiveMember(null), [])

  return (
    <>
      {/* Officers */}
      {officers.length > 0 && (
        <div className="mb-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Officers</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {officers.map(m => (
              <MemberCard key={m.id} member={m} onClick={() => setActiveMember(m)} variant="officer" />
            ))}
          </div>
        </div>
      )}

      {/* Directors */}
      {directors.length > 0 && (
        <div>
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Directors</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {directors.map(m => (
              <MemberCard key={m.id} member={m} onClick={() => setActiveMember(m)} variant="director" />
            ))}
          </div>
        </div>
      )}

      {/* General contact */}
      <div className="mt-10 bg-kp-blue rounded-2xl p-6 text-center">
        <p className="text-blue-100 text-sm">
          To reach the board, email us at{' '}
          <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold font-semibold">
            kappaphi@kappa-phi.org
          </a>{' '}
          or call <span className="text-white font-semibold">(314) 640-5875</span>.
        </p>
      </div>

      <Drawer member={activeMember} onClose={close} />
    </>
  )
}

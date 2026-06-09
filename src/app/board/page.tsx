import { createAdminClient } from '@/lib/supabase/admin'
import BoardClient, { type BoardMember } from './BoardClient'

export const metadata = { title: 'Board Members' }

// Revalidate hourly; admin saves call revalidatePath('/board') for on-demand bust
export const revalidate = 3600

function toMember(row: {
  id: string
  name: string
  role: string
  email: string | null
  bio: string | null
  goals: string | null
  goals_bulleted: boolean | null
  photo_url: string | null
}): BoardMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    bio: row.bio?.split('\n\n').filter(Boolean) ?? [],
    goals: row.goals?.split('\n\n').filter(Boolean) ?? [],
    goals_bulleted: row.goals_bulleted ?? false,
    photo_url: row.photo_url,
  }
}

export default async function BoardPage() {
  const admin = createAdminClient()

  const { data: rows } = await admin
    .from('board_members')
    .select('id, name, role, category, email, bio, goals, goals_bulleted, photo_url, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const all = rows ?? []
  const officers = all.filter(r => r.category === 'officer').map(toMember)
  const directors = all.filter(r => r.category === 'director').map(toMember)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">Leadership</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Board Members</h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            The officers and directors of the Kappa Phi Building Corporation, committed to supporting Epsilon Nu.
            Click any member to view their full biography and goals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <BoardClient officers={officers} directors={directors} />
      </div>
    </div>
  )
}

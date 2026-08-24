import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Administration' }

type SectionItem = {
  title: string
  href: string
  description: string
  pending: number
  pendingLabel: string
  total?: number
  totalLabel?: string
  icon: React.ReactNode
}

function SectionCard({ section }: { section: SectionItem }) {
  const hasPending = section.pending > 0
  return (
    <Link
      href={section.href}
      className={`group relative bg-kp-surface rounded-xl border p-4 no-underline flex flex-col gap-3 transition-all hover:shadow-lg hover:shadow-black/30 ${
        hasPending
          ? 'border-amber-500/50 hover:border-amber-400'
          : 'border-kp-border hover:border-kp-gold/40'
      }`}
    >
      {/* Icon + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          hasPending ? 'bg-amber-500/20 text-amber-400' : 'bg-kp-card text-gray-400 group-hover:text-kp-gold'
        } transition-colors`}>
          {section.icon}
        </div>
        {hasPending && (
          <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-500/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {section.pending} {section.pendingLabel}
          </span>
        )}
        {section.total !== undefined && !hasPending && (
          <span className="text-gray-500 text-[10px] font-medium px-2 py-1 rounded-full border border-kp-border shrink-0">
            {section.total} {section.totalLabel ?? 'records'}
          </span>
        )}
      </div>

      {/* Text */}
      <div>
        <h2 className={`text-sm font-bold mb-0.5 transition-colors ${
          hasPending ? 'text-amber-300' : 'text-white group-hover:text-kp-gold'
        }`}>
          {section.title}
        </h2>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{section.description}</p>
      </div>
    </Link>
  )
}

function GroupNav({ isFullAdmin }: { isFullAdmin: boolean }) {
  const groups = [
    ...(isFullAdmin ? [{ id: 'member-admin', label: 'Member Administration' }] : []),
    { id: 'website-content', label: 'Website Content' },
    ...(isFullAdmin ? [{ id: 'system', label: 'System & Communications' }] : []),
  ]
  if (groups.length < 2) return null
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {groups.map(g => (
        <a
          key={g.id}
          href={`#${g.id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-kp-surface border border-kp-border text-gray-400 hover:text-kp-gold hover:border-kp-gold/40 no-underline transition-colors"
        >
          {g.label}
        </a>
      ))}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: currentProfile } = await admin
    .from('profiles').select('role').eq('id', user.id).single()
  if (currentProfile?.role !== 'admin' && currentProfile?.role !== 'website_admin') redirect('/portal')
  const isFullAdmin = currentProfile?.role === 'admin'

  const today = new Date().toISOString().split('T')[0]

  const [
    { count: pendingUsers },
    { count: pendingLinks },
    { count: pendingChanges },
    { count: totalMembers },
    { count: upcomingEvents },
    { count: eternalCount },
    { count: eternalPending },
    { count: boardCount },
    { count: propertyCount },
    { count: portalResourceCount },
    { count: honorCount },
    { count: mascotCount },
    { count: missingBigBrother },
    { count: milestoneCount },
  ] = await Promise.all([
    admin.from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', false),
    admin.from('profiles')
      .select('*', { count: 'exact', head: true })
      .in('link_request_status', ['pending', 'conflict']),
    admin.from('member_change_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    admin.from('members')
      .select('*', { count: 'exact', head: true }),
    admin.from('events')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .gte('start_date', today),
    // Deceased members who have a chapter eternal entry
    admin.from('members')
      .select('*', { count: 'exact', head: true })
      .eq('is_deceased', true)
      .not('passing_date', 'is', null),
    // Deceased members who still need a chapter eternal entry
    admin.from('members')
      .select('*', { count: 'exact', head: true })
      .eq('is_deceased', true)
      .is('passing_date', null),
    admin.from('board_members')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
    admin.from('property_projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    admin.from('portal_resources')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    admin.from('chapter_honors')
      .select('*', { count: 'exact', head: true }),
    admin.from('chapter_mascots')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    admin.from('members')
      .select('*', { count: 'exact', head: true })
      .not('badge_number', 'is', null)
      .is('big_brother_id', null),
    admin.from('chapter_milestones')
      .select('*', { count: 'exact', head: true }),
  ])

  const memberSections = [
    {
      title: 'User Accounts',
      href: '/admin/users',
      description: 'Review registrations, approve accounts, and manage roles.',
      pending: pendingUsers ?? 0,
      pendingLabel: 'awaiting approval',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a4 4 0 00-5.477-3.693M9 20H4v-2a4 4 0 015.477-3.693M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Member Records',
      href: '/admin/members',
      description: 'Add, edit, and manage the full fraternity member directory.',
      pending: 0,
      pendingLabel: '',
      total: totalMembers ?? 0,
      totalLabel: 'records',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: 'Big Brother Maintenance',
      href: '/admin/big-brother',
      description: 'Review members missing a recorded big brother and assign one.',
      pending: 0,
      pendingLabel: '',
      total: missingBigBrother ?? 0,
      totalLabel: 'missing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 20h5v-2a4 4 0 00-5.477-3.693M9 20H4v-2a4 4 0 015.477-3.693M15 7a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 11-6 0 3 3 0 016 0zM12 4v4m-2-2h4" />
        </svg>
      ),
    },
    {
      title: 'Member Link Requests',
      href: '/admin/link-requests',
      description: 'Connect registered accounts to their member records.',
      pending: pendingLinks ?? 0,
      pendingLabel: 'awaiting review',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      title: 'Change Requests',
      href: '/admin/change-requests',
      description: 'Review member requests to update badge number, pledge class, or big brother.',
      pending: pendingChanges ?? 0,
      pendingLabel: 'awaiting review',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'Member Reports',
      href: '/admin/reports',
      description: 'Mailing lists, email lists, and other exports.',
      pending: 0,
      pendingLabel: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m-6 0H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
        </svg>
      ),
    },
  ]

  const contentSections = [
    {
      title: 'Homepage & About',
      href: '/admin/content',
      description: 'Hero text, stats, mission statement, and the site announcement banner.',
      pending: 0,
      pendingLabel: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0V16h4v5" />
        </svg>
      ),
    },
    {
      title: 'Chapter Milestones',
      href: '/admin/milestones',
      description: 'The Key Milestones timeline on the About page.',
      pending: 0,
      pendingLabel: '',
      total: milestoneCount ?? 0,
      totalLabel: 'entries',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 16h6" />
        </svg>
      ),
    },
    {
      title: 'Honor Rolls',
      href: '/admin/honors',
      description: 'Student Knights, Highest GPA, IFC Reps, St. Pat\'s Board, Chapter Presidents.',
      pending: 0,
      pendingLabel: '',
      total: honorCount ?? 0,
      totalLabel: 'entries',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 15a4 4 0 100-8 4 4 0 000 8zm-7 6l2.879-5.757M19 21l-2.879-5.757M8.5 11.5L5 21l4-1.5 3 2.5 3-2.5 4 1.5-3.5-9.5" />
        </svg>
      ),
    },
    {
      title: 'Chapter Mascots',
      href: '/admin/mascots',
      description: 'Chapter mascots with names, years, and optional photos.',
      pending: 0,
      pendingLabel: '',
      total: mascotCount ?? 0,
      totalLabel: 'mascots',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 16a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
      ),
    },
    {
      title: 'Board Members',
      href: '/admin/board',
      description: 'Officers and directors shown on the public board page.',
      pending: 0,
      pendingLabel: '',
      total: boardCount ?? 0,
      totalLabel: 'active',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Chapter Eternal',
      href: '/admin/chapter-eternal',
      description: 'Memorial page for brothers who have passed.',
      pending: eternalPending ?? 0,
      pendingLabel: 'need entry',
      total: eternalCount ?? 0,
      totalLabel: 'entries',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Property Management',
      href: '/admin/property',
      description: 'Planned and completed shelter improvement projects.',
      pending: 0,
      pendingLabel: '',
      total: propertyCount ?? 0,
      totalLabel: 'projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      title: 'Events',
      href: '/admin/events',
      description: 'Events shown on the public events & calendar page.',
      pending: 0,
      pendingLabel: '',
      total: upcomingEvents ?? 0,
      totalLabel: 'upcoming',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Portal Resources',
      href: '/admin/portal',
      description: 'Resource links shown on the Chapter Portal page.',
      pending: 0,
      pendingLabel: '',
      total: portalResourceCount ?? 0,
      totalLabel: 'links',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      title: "Booth's Guide to Pats",
      href: '/admin/portal/pats-guide',
      description: 'In-house St. Pat\'s survival guide text and photo gallery.',
      pending: 0,
      pendingLabel: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
  ]

  const systemSections = [
    {
      title: 'Activity Log',
      href: '/admin/activity',
      description: 'Who changed what across member and content records.',
      pending: 0,
      pendingLabel: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Login Log',
      href: '/admin/login-log',
      description: 'Sign-ins and ongoing site access, day by day.',
      pending: 0,
      pendingLabel: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
    },
    {
      title: 'Email Templates',
      href: '/admin/email-templates',
      description: 'Edit the subject and body of system emails.',
      pending: 0,
      pendingLabel: '',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  const totalPending = isFullAdmin
    ? (pendingUsers ?? 0) + (pendingLinks ?? 0) + (pendingChanges ?? 0) + (eternalPending ?? 0)
    : (eternalPending ?? 0)

  return (
    <div className="bg-kp-dark min-h-screen">
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-2">Administration</div>
          <h1 className="text-4xl font-black text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2 text-sm">
            {totalPending > 0
              ? `${totalPending} item${totalPending !== 1 ? 's' : ''} require your attention.`
              : 'No pending actions — everything is up to date.'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <GroupNav isFullAdmin={isFullAdmin} />

        {isFullAdmin && (
          <section id="member-admin" className="scroll-mt-6">
            <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Member Administration</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {memberSections.map(section => <SectionCard key={section.href} section={section} />)}
            </div>
          </section>
        )}

        <section id="website-content" className="scroll-mt-6">
          <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">Website Content</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {contentSections.map(section => <SectionCard key={section.href} section={section} />)}
          </div>
        </section>

        {isFullAdmin && (
          <section id="system" className="scroll-mt-6">
            <h2 className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-4">System &amp; Communications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {systemSections.map(section => <SectionCard key={section.href} section={section} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

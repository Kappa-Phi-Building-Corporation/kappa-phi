import { createAdminClient } from '@/lib/supabase/admin'

export const metadata = { title: 'Property Management' }
export const revalidate = 3600

type Photo = { id: string; photo_url: string; caption: string | null }

type Project = {
  id: string
  name: string
  status: string
  description: string | null
  scheduled_date: string | null
  completed_date: string | null
  cost: string | null
  contractor: string | null
  photos: Photo[]
}

// ─── Photo strip ──────────────────────────────────────────────────

function PhotoStrip({ photos, alt }: { photos: Photo[]; alt: string }) {
  if (photos.length === 0) return null
  if (photos.length === 1) {
    return (
      <img
        src={photos[0].photo_url}
        alt={photos[0].caption ?? alt}
        className="w-full h-44 object-cover"
      />
    )
  }
  return (
    <div className="flex overflow-x-auto gap-1 snap-x snap-mandatory" style={{ height: '11rem' }}>
      {photos.map(p => (
        <img
          key={p.id}
          src={p.photo_url}
          alt={p.caption ?? alt}
          className="h-full w-auto min-w-[10rem] max-w-[16rem] object-cover snap-start shrink-0"
        />
      ))}
    </div>
  )
}

// ─── Chevron ──────────────────────────────────────────────────────

function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ─── Cards ────────────────────────────────────────────────────────

function PlannedCard({ p }: { p: Project }) {
  return (
    <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden flex flex-col">
      <div className="bg-kp-blue px-5 py-3 flex items-center justify-between gap-2">
        <h3 className="text-white font-bold text-sm">{p.name}</h3>
        <span className="text-kp-gold text-xs font-semibold shrink-0 bg-kp-blue-dark px-2 py-0.5 rounded-full">
          {p.scheduled_date === 'TBD' || !p.scheduled_date ? 'Planned' : p.scheduled_date}
        </span>
      </div>

      <PhotoStrip photos={p.photos} alt={p.name} />

      <div className="p-5 flex-1 flex flex-col gap-3">
        {p.cost && (
          <div className="text-xs text-gray-500">
            Est. Cost: <span className="text-gray-300 font-medium">{p.cost}</span>
          </div>
        )}
        {p.description && <p className="text-gray-300 text-sm leading-relaxed">{p.description}</p>}
      </div>
    </div>
  )
}

function RecentCard({ p }: { p: Project }) {
  return (
    <div className="bg-kp-surface border border-kp-border rounded-2xl overflow-hidden flex flex-col">
      <PhotoStrip photos={p.photos} alt={p.name} />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-white font-bold text-sm leading-snug">{p.name}</h3>
          <span className="text-kp-gold text-xs font-semibold shrink-0 tabular-nums">{p.completed_date}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
          {p.cost && <span>Cost: <span className="text-gray-400">{p.cost}</span></span>}
          {p.contractor && (
            <span className="truncate max-w-[220px]">
              Contractor: <span className="text-gray-400">{p.contractor}</span>
            </span>
          )}
        </div>

        {p.description && <p className="text-gray-300 text-sm leading-relaxed">{p.description}</p>}
      </div>
    </div>
  )
}

function ArchiveRow({ p }: { p: Project }) {
  return (
    <details className="group border-b border-kp-border last:border-0">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-kp-card transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <Chevron className="w-4 h-4 text-gray-600 group-open:rotate-180 transition-transform shrink-0" />
          <span className="text-gray-200 text-sm font-medium truncate">{p.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0 text-xs">
          {p.cost && <span className="text-gray-500">{p.cost}</span>}
          <span className="text-kp-gold font-semibold tabular-nums">{p.completed_date}</span>
        </div>
      </summary>

      <div className="px-5 pb-5 pt-1">
        {p.photos.length > 0 && (
          <div className={`mb-4 rounded-xl overflow-hidden ${p.photos.length === 1 ? '' : 'flex gap-1 overflow-x-auto'}`}>
            {p.photos.length === 1 ? (
              <img src={p.photos[0].photo_url} alt={p.photos[0].caption ?? p.name} className="w-full h-48 object-cover rounded-xl" />
            ) : (
              p.photos.map(ph => (
                <img key={ph.id} src={ph.photo_url} alt={ph.caption ?? p.name} className="h-40 w-auto min-w-[10rem] object-cover shrink-0" />
              ))
            )}
          </div>
        )}
        <div className="space-y-2 pl-7">
          {p.contractor && (
            <p className="text-xs text-gray-500">
              Contractor: <span className="text-gray-400">{p.contractor}</span>
            </p>
          )}
          {p.description && <p className="text-gray-400 text-sm leading-relaxed">{p.description}</p>}
        </div>
      </div>
    </details>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default async function PropertyPage() {
  const admin = createAdminClient()

  // Planned/recent ordered by sort_order; archive ordered by updated_at DESC (most recently archived first)
  const [{ data: activeRows }, { data: archiveRows }, { data: photoRows }] = await Promise.all([
    admin
      .from('property_projects')
      .select('id, name, status, description, scheduled_date, completed_date, cost, contractor, sort_order')
      .eq('is_published', true)
      .in('status', ['planned', 'recent'])
      .order('sort_order', { ascending: true }),
    admin
      .from('property_projects')
      .select('id, name, status, description, scheduled_date, completed_date, cost, contractor, sort_order')
      .eq('is_published', true)
      .eq('status', 'archive')
      .order('updated_at', { ascending: false }),
    admin
      .from('property_project_photos')
      .select('id, project_id, photo_url, caption, sort_order')
      .order('sort_order', { ascending: true }),
  ])


  // Group photos by project_id
  const photosByProject: Record<string, Photo[]> = {}
  for (const ph of photoRows ?? []) {
    if (!photosByProject[ph.project_id]) photosByProject[ph.project_id] = []
    photosByProject[ph.project_id].push({ id: ph.id, photo_url: ph.photo_url, caption: ph.caption })
  }

  const toProject = (r: NonNullable<typeof activeRows>[0]): Project => ({
    ...r, photos: photosByProject[r.id] ?? [],
  })

  const planned = (activeRows ?? []).filter(r => r.status === 'planned').map(toProject)
  const recent  = (activeRows ?? []).filter(r => r.status === 'recent').map(toProject)
  const archive = (archiveRows ?? []).map(toProject)

  return (
    <div className="bg-kp-dark min-h-screen">
      {/* Hero */}
      <div className="bg-kp-crimson-dark border-b border-kp-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-3">The Shelter</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Property Management</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            Since 1999, the Building Corporation has made substantial improvements to the Chapter House,
            keeping Epsilon Nu among the most modern fraternities on the MS&T campus.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">

        {/* Intro + awards photo */}
        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          <div className="bg-kp-surface border border-kp-border rounded-2xl p-6 md:p-8 flex-1">
            <p className="text-gray-300 text-sm leading-relaxed">
              The amenities we provide the men of Epsilon Nu allow them to concentrate on the fundamentals
              of the Fraternity — as demonstrated by the 5 Court of Honor and 3 Hugh Shields Awards won in the
              last 15 years. This page summarizes major projects the Building Corporation has undertaken and
              showcases what is planned next.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Questions about property management? Contact our{' '}
              <a href="mailto:kappaphi@kappa-phi.org" className="text-kp-gold">VP of Property Management</a>.
            </p>
          </div>
          <div
            className="w-full md:w-72 min-h-48 rounded-2xl bg-kp-card shrink-0"
            style={{ backgroundImage: "url('/images/awards-wall.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </div>

        {/* Planned */}
        {planned.length > 0 && (
          <section>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Planned Projects</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {planned.map(p => <PlannedCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <section>
            <div className="text-kp-gold text-xs font-bold uppercase tracking-widest mb-6">Recent Projects</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recent.map(p => <RecentCard key={p.id} p={p} />)}
            </div>
          </section>
        )}

        {/* Archive */}
        {archive.length > 0 && (
          <section>
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none mb-0">
                <div className="text-kp-gold text-xs font-bold uppercase tracking-widest">Project Archive</div>
                <Chevron className="w-4 h-4 text-kp-gold group-open:rotate-180 transition-transform" />
                <span className="text-gray-600 text-xs ml-auto">{archive.length} project{archive.length !== 1 ? 's' : ''}</span>
              </summary>

              <div className="mt-5 bg-kp-surface border border-kp-border rounded-2xl overflow-hidden">
                {archive.map(p => <ArchiveRow key={p.id} p={p} />)}
              </div>
            </details>
          </section>
        )}
      </div>
    </div>
  )
}

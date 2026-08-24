import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildIcs } from '@/lib/ics'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: event } = await admin
    .from('events')
    .select('id, title, description, start_date, end_date, start_time, end_time, location, link_url')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!event) return new NextResponse('Not found', { status: 404 })

  const ics = buildIcs({
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.start_date,
    endDate: event.end_date,
    startTime: event.start_time,
    endTime: event.end_time,
    url: event.link_url,
  })

  const filename = event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60) || 'event'

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.ics"`,
    },
  })
}

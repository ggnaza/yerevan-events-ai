import { createClient } from '@/lib/supabase/server'
import EventCard from '@/components/events/EventCard'
import EventFilters from '@/components/events/EventFilters'
import { Suspense } from 'react'
import type { Event } from '@/lib/types'
import { addDays, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

export const revalidate = 30

interface SearchParams {
  q?: string
  category?: string
  date?: string
  featured?: string
}

async function getEvents(searchParams: SearchParams): Promise<Event[]> {
  const supabase = createClient()
  let query = supabase.from('events').select('*').order('event_date', { ascending: true })

  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.featured === 'true') {
    query = query.eq('is_featured', true)
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  if (searchParams.date === 'today') {
    query = query.eq('event_date', today)
  } else if (searchParams.date === 'this-week') {
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    query = query.gte('event_date', weekStart).lte('event_date', weekEnd)
  } else if (searchParams.date === 'this-month') {
    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')
    query = query.gte('event_date', monthStart).lte('event_date', monthEnd)
  } else {
    // Default: upcoming only
    query = query.gte('event_date', today)
  }

  const { data } = await query.limit(60)
  return data ?? []
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const events = await getEvents(searchParams)

  const hasActiveFilters = searchParams.q || searchParams.category || searchParams.date

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-stone-900">Events in Yerevan</h1>
          <p className="text-stone-500 mt-1 text-sm">
            {events.length} event{events.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <EventFilters />
          </Suspense>
        </div>

        {/* Results */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} featured={event.is_featured} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">No events found</h3>
            <p className="text-stone-500 text-sm">
              {hasActiveFilters
                ? "Try removing some filters to see more results."
                : "No upcoming events at the moment. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

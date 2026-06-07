import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/homepage/Hero'
import CategoryNav from '@/components/homepage/CategoryNav'
import EventCard from '@/components/events/EventCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Event } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]

  const [featuredResult, upcomingResult] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('is_featured', true)
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(4),
    supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(8),
  ])

  const featuredEvents: Event[] = featuredResult.data ?? []
  const upcomingEvents: Event[] = upcomingResult.data ?? []

  return (
    <>
      <Hero />
      <CategoryNav />

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">Featured Events</h2>
                <p className="text-stone-500 text-sm mt-1">Hand-picked highlights</p>
              </div>
              <Link
                href="/events?featured=true"
                className="hidden sm:flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Upcoming Events</h2>
              <p className="text-stone-500 text-sm mt-1">Don&apos;t miss what&apos;s coming up</p>
            </div>
            <Link
              href="/events"
              className="hidden sm:flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900 font-medium transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-stone-500">No upcoming events yet. Check back soon.</p>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-amber-700 font-medium"
            >
              View all events <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

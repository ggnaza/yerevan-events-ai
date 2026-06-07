import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import type { Event } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import DeleteEventButton from './DeleteEventButton'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  const allEvents: Event[] = events ?? []

  const today = new Date().toISOString().split('T')[0]
  const upcoming = allEvents.filter(e => e.event_date >= today)
  const past = allEvents.filter(e => e.event_date < today)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Event Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">{allEvents.length} total events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white font-medium px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          <Plus size={16} />
          Add event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Events" value={allEvents.length} />
        <StatCard label="Upcoming" value={upcoming.length} highlight />
        <StatCard label="Past" value={past.length} />
        <StatCard label="Featured" value={allEvents.filter(e => e.is_featured).length} />
      </div>

      {/* Events table */}
      {allEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-stone-500 mb-4">No events yet.</p>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-5 py-2.5 rounded-full"
          >
            <Plus size={16} /> Add your first event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3">Event</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3 hidden lg:table-cell">Location</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {allEvents.map((event) => {
                  const isPast = event.event_date < today
                  const categoryLabel = CATEGORIES.find(c => c.value === event.category)?.label ?? event.category
                  const formattedDate = (() => {
                    try { return format(parseISO(event.event_date), 'MMM d, yyyy') }
                    catch { return event.event_date }
                  })()

                  return (
                    <tr key={event.id} className={`hover:bg-stone-50 transition-colors ${isPast ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {event.is_featured && <Star size={13} className="text-amber-500 shrink-0" fill="currentColor" />}
                          <div>
                            <p className="font-medium text-stone-900 text-sm leading-snug">{event.title}</p>
                            {isPast && <span className="text-xs text-stone-400">Past event</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-stone-600">{formattedDate}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs font-medium bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                          {categoryLabel}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-sm text-stone-500 truncate max-w-[160px] block">{event.location_name}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${event.id}`}
                            className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 rounded transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition-colors"
                          >
                            <Pencil size={11} /> Edit
                          </Link>
                          <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200'}`}>
      <p className={`text-2xl font-bold ${highlight ? 'text-amber-800' : 'text-stone-900'}`}>{value}</p>
      <p className={`text-xs mt-1 ${highlight ? 'text-amber-600' : 'text-stone-500'}`}>{label}</p>
    </div>
  )
}

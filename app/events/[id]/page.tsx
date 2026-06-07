import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  Globe,
  Banknote,
  Users,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/types'

export const revalidate = 60

interface Props {
  params: { id: string }
}

export default async function EventDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!event) notFound()

  const categoryLabel = CATEGORIES.find(c => c.value === event.category)?.label ?? event.category

  const formattedDate = (() => {
    try { return format(parseISO(event.event_date), 'EEEE, MMMM d, yyyy') }
    catch { return event.event_date }
  })()

  const timeRange = event.end_time
    ? `${event.start_time.slice(0, 5)} – ${event.end_time.slice(0, 5)}`
    : event.start_time.slice(0, 5)

  return (
    <div className="min-h-screen bg-white">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to events
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero image */}
        {event.image_url && (
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden mb-8 bg-stone-100">
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        )}

        {/* Category + title */}
        <div className="mb-6">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">
            {categoryLabel}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
            {event.title}
          </h1>
          {event.is_featured && (
            <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
              Featured Event
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="md:col-span-2 space-y-6">
            {event.description && (
              <div>
                <h2 className="text-base font-semibold text-stone-900 mb-3">About this event</h2>
                <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>
              </div>
            )}

            {event.external_link && (
              <a
                href={event.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                <ExternalLink size={16} />
                More info / Get tickets
              </a>
            )}
          </div>

          {/* Details sidebar */}
          <div className="space-y-1">
            <div className="bg-stone-50 rounded-2xl p-5 space-y-4">
              <DetailRow icon={<Calendar size={16} />} label="Date" value={formattedDate} />
              <DetailRow icon={<Clock size={16} />} label="Time" value={timeRange} />
              <DetailRow icon={<MapPin size={16} />} label="Location" value={event.location_name} sub={event.address ?? undefined} />
              {event.price_info && (
                <DetailRow icon={<Banknote size={16} />} label="Price" value={event.price_info} />
              )}
              {event.organizer_name && (
                <DetailRow icon={<User size={16} />} label="Organiser" value={event.organizer_name} />
              )}
              {event.event_language && (
                <DetailRow icon={<Globe size={16} />} label="Language" value={event.event_language} />
              )}
              {event.age_restriction && (
                <DetailRow icon={<Users size={16} />} label="Age" value={event.age_restriction} />
              )}
              <DetailRow icon={<Tag size={16} />} label="Category" value={categoryLabel} />
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 text-stone-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-stone-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-stone-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

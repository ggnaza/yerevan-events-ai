import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { MapPin, Clock } from 'lucide-react'
import type { Event } from '@/lib/types'
import { CATEGORIES } from '@/lib/types'
import clsx from 'clsx'

interface EventCardProps {
  event: Event
  featured?: boolean
}

export default function EventCard({ event, featured = false }: EventCardProps) {
  const categoryLabel = CATEGORIES.find(c => c.value === event.category)?.label ?? event.category

  const formattedDate = (() => {
    try {
      return format(parseISO(event.event_date), 'EEE, MMM d')
    } catch {
      return event.event_date
    }
  })()

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className={clsx(
        'bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-stone-300 hover:shadow-md transition-all duration-200',
        featured && 'ring-1 ring-amber-200'
      )}>
        {/* Image */}
        <div className={clsx(
          'relative bg-stone-100 overflow-hidden',
          featured ? 'aspect-[16/9]' : 'aspect-[4/3]'
        )}>
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
              <span className="text-4xl opacity-30">📅</span>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-stone-700 shadow-sm">
              {categoryLabel}
            </span>
          </div>
          {featured && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-700 text-white">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
            {formattedDate}
          </p>
          <h3 className="font-semibold text-stone-900 leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-500">
              <MapPin size={13} className="shrink-0" />
              <span className="text-xs truncate">{event.location_name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <Clock size={13} className="shrink-0" />
              <span className="text-xs">{event.start_time.slice(0, 5)}</span>
            </div>
          </div>

          {event.price_info && (
            <div className="mt-3">
              <span className="inline-block text-xs font-medium text-stone-600 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full">
                {event.price_info}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-stone-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Yerevan, Armenia
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            What&apos;s happening<br />
            <span className="text-amber-400">in Yerevan</span>
          </h1>
          <p className="mt-6 text-lg text-stone-300 leading-relaxed max-w-lg">
            Discover concerts, exhibitions, tech meetups, theater, workshops, and
            more — all in one place.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              Browse all events
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/events?date=today"
              className="inline-flex items-center justify-center gap-2 border border-stone-600 hover:border-stone-400 text-stone-200 font-medium px-6 py-3 rounded-full transition-colors"
            >
              Happening today
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

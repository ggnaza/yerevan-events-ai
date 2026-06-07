import Link from 'next/link'
import { CATEGORIES } from '@/lib/types'

const CATEGORY_ICONS: Record<string, string> = {
  concerts: '🎵',
  theater: '🎭',
  exhibitions: '🎨',
  'tech-meetups': '💻',
  education: '📚',
  kids: '🧸',
  nightlife: '🌙',
  sports: '⚽',
  charity: '🤝',
  workshops: '🛠️',
  other: '✨',
}

export default function CategoryNav() {
  return (
    <section className="py-10 border-b border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-400 mb-5">
          Browse by category
        </h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/events?category=${cat.value}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-stone-200 bg-white hover:border-amber-400 hover:bg-amber-50 text-stone-700 hover:text-amber-800 text-sm font-medium transition-all group"
            >
              <span className="text-base">{CATEGORY_ICONS[cat.value]}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

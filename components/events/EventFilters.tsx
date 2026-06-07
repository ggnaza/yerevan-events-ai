'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/lib/types'
import { Search, X } from 'lucide-react'
import { useCallback } from 'react'
import clsx from 'clsx'

export default function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') ?? ''
  const currentSearch = searchParams.get('q') ?? ''
  const currentDate = searchParams.get('date') ?? ''

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/events?${params.toString()}`)
  }, [router, searchParams])

  const clearAll = () => {
    router.push('/events')
  }

  const hasFilters = currentCategory || currentSearch || currentDate

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search events..."
          defaultValue={currentSearch}
          onChange={(e) => updateParam('q', e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-colors placeholder:text-stone-400"
        />
      </div>

      {/* Date filter */}
      <div className="flex gap-2">
        {['upcoming', 'today', 'this-week', 'this-month'].map((d) => (
          <button
            key={d}
            onClick={() => updateParam('date', currentDate === d ? '' : d)}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize',
              currentDate === d
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            )}
          >
            {d.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam('category', '')}
          className={clsx(
            'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
            !currentCategory
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateParam('category', currentCategory === cat.value ? '' : cat.value)}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
              currentCategory === cat.value
                ? 'bg-amber-700 text-white border-amber-700'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          <X size={12} />
          Clear all filters
        </button>
      )}
    </div>
  )
}

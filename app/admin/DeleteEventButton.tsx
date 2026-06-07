'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

interface Props {
  eventId: string
  eventTitle: string
}

export default function DeleteEventButton({ eventId, eventTitle }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from('events').delete().eq('id', eventId)
    if (!error) {
      router.refresh()
    } else {
      alert('Failed to delete event. Please try again.')
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-stone-500 hidden sm:inline">Delete &quot;{eventTitle.slice(0, 20)}…&quot;?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-full transition-colors disabled:opacity-60"
        >
          {loading ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1.5 rounded-full transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors"
    >
      <Trash2 size={11} /> Delete
    </button>
  )
}

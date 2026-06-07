import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventForm from '../../../EventForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function EditEventPage({ params }: Props) {
  const supabase = createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!event) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-stone-900">Edit Event</h1>
        <p className="text-stone-500 text-sm mt-1 truncate">{event.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <EventForm mode="edit" event={event} />
      </div>
    </div>
  )
}

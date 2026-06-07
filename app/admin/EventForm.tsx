'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, type Event } from '@/lib/types'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface EventFormProps {
  event?: Event
  mode: 'create' | 'edit'
}

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(event?.image_url ?? null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    category: event?.category ?? 'other',
    event_date: event?.event_date ?? '',
    start_time: event?.start_time ?? '',
    end_time: event?.end_time ?? '',
    location_name: event?.location_name ?? '',
    address: event?.address ?? '',
    price_info: event?.price_info ?? '',
    organizer_name: event?.organizer_name ?? '',
    external_link: event?.external_link ?? '',
    event_language: event?.event_language ?? 'English',
    age_restriction: event?.age_restriction ?? '',
    is_featured: event?.is_featured ?? false,
    image_url: event?.image_url ?? '',
  })

  const set = (key: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return form.image_url || null
    setUploadingImage(true)
    const ext = imageFile.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('event-images')
      .upload(filename, imageFile, { upsert: false })
    if (uploadError) {
      setError('Failed to upload image. Please try again.')
      setUploadingImage(false)
      return null
    }
    const { data } = supabase.storage.from('event-images').getPublicUrl(filename)
    setUploadingImage(false)
    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const imageUrl = await uploadImage()
    if (uploadingImage) return

    const payload = {
      ...form,
      image_url: imageUrl,
      end_time: form.end_time || null,
      description: form.description || null,
      address: form.address || null,
      price_info: form.price_info || null,
      organizer_name: form.organizer_name || null,
      external_link: form.external_link || null,
      event_language: form.event_language || null,
      age_restriction: form.age_restriction || null,
    }

    if (mode === 'create') {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('events').insert({
        ...payload,
        created_by: user?.id,
      })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase
        .from('events')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', event!.id)
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Title */}
      <Field label="Event Title *">
        <input
          type="text"
          required
          value={form.title}
          onChange={e => set('title', e.target.value)}
          className={inputClass}
          placeholder="e.g. Jazz Night at Jazzve"
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={5}
          className={inputClass}
          placeholder="Tell people what this event is about..."
        />
      </Field>

      {/* Category */}
      <Field label="Category *">
        <select
          required
          value={form.category}
          onChange={e => set('category', e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </Field>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Event Date *">
          <input
            type="date"
            required
            value={form.event_date}
            onChange={e => set('event_date', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Start Time *">
          <input
            type="time"
            required
            value={form.start_time}
            onChange={e => set('start_time', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="End Time (optional)">
          <input
            type="time"
            value={form.end_time}
            onChange={e => set('end_time', e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Venue / Location Name *">
          <input
            type="text"
            required
            value={form.location_name}
            onChange={e => set('location_name', e.target.value)}
            className={inputClass}
            placeholder="e.g. Cafesjian Center for the Arts"
          />
        </Field>
        <Field label="Address (optional)">
          <input
            type="text"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            className={inputClass}
            placeholder="e.g. 1 Tamanyan St, Yerevan"
          />
        </Field>
      </div>

      {/* Price & Organizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Price Info">
          <input
            type="text"
            value={form.price_info}
            onChange={e => set('price_info', e.target.value)}
            className={inputClass}
            placeholder='e.g. Free, AMD 5,000, Check link'
          />
        </Field>
        <Field label="Organizer Name">
          <input
            type="text"
            value={form.organizer_name}
            onChange={e => set('organizer_name', e.target.value)}
            className={inputClass}
            placeholder="e.g. Yerevan Jazz Club"
          />
        </Field>
      </div>

      {/* Language & Age */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Event Language">
          <input
            type="text"
            value={form.event_language}
            onChange={e => set('event_language', e.target.value)}
            className={inputClass}
            placeholder="e.g. English, Armenian, Russian"
          />
        </Field>
        <Field label="Age Restriction">
          <input
            type="text"
            value={form.age_restriction}
            onChange={e => set('age_restriction', e.target.value)}
            className={inputClass}
            placeholder="e.g. 18+, All ages, 12+"
          />
        </Field>
      </div>

      {/* External link */}
      <Field label="External Link (Instagram, ticket page, website...)">
        <input
          type="url"
          value={form.external_link}
          onChange={e => set('external_link', e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      </Field>

      {/* Image upload */}
      <Field label="Event Image">
        <div className="space-y-3">
          {imagePreview && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageFile(null); set('image_url', '') }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-600 hover:border-stone-400 bg-white transition-colors">
              <Upload size={14} />
              {imagePreview ? 'Change image' : 'Upload image'}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-xs text-stone-400">JPG, PNG, WebP — max 5MB</p>
        </div>
      </Field>

      {/* Featured */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <input
          type="checkbox"
          id="is_featured"
          checked={form.is_featured}
          onChange={e => set('is_featured', e.target.checked)}
          className="w-4 h-4 accent-amber-700"
        />
        <label htmlFor="is_featured" className="text-sm font-medium text-amber-900 cursor-pointer">
          Feature this event on the homepage
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="bg-stone-900 hover:bg-stone-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
        >
          {loading || uploadingImage
            ? (uploadingImage ? 'Uploading image…' : 'Saving…')
            : (mode === 'create' ? 'Publish event' : 'Save changes')}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-sm text-stone-500 hover:text-stone-900 px-4 py-2.5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-colors placeholder:text-stone-400'

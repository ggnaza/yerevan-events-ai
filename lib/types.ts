export type Category =
  | 'concerts'
  | 'theater'
  | 'exhibitions'
  | 'tech-meetups'
  | 'education'
  | 'kids'
  | 'nightlife'
  | 'sports'
  | 'charity'
  | 'workshops'
  | 'other'

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'concerts', label: 'Concerts' },
  { value: 'theater', label: 'Theater' },
  { value: 'exhibitions', label: 'Exhibitions' },
  { value: 'tech-meetups', label: 'Tech Meetups' },
  { value: 'education', label: 'Education' },
  { value: 'kids', label: 'Kids' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'sports', label: 'Sports' },
  { value: 'charity', label: 'Charity' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'other', label: 'Other' },
]

export interface Event {
  id: string
  title: string
  description: string | null
  category: Category
  event_date: string
  start_time: string
  end_time: string | null
  location_name: string
  address: string | null
  price_info: string | null
  organizer_name: string | null
  image_url: string | null
  external_link: string | null
  event_language: string | null
  age_restriction: string | null
  is_featured: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string | null
  role: 'user' | 'admin'
  created_at: string
}

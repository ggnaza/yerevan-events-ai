import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Plus, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin top bar */}
      <div className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Admin</span>
            <span className="text-stone-700">|</span>
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-stone-300 hover:text-white transition-colors">
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
            <Link href="/admin/events/new" className="flex items-center gap-1.5 text-sm text-stone-300 hover:text-white transition-colors">
              <Plus size={14} />
              Add Event
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">{user.email}</span>
            <Link href="/" className="text-xs text-stone-400 hover:text-white flex items-center gap-1">
              <LogOut size={12} /> Exit
            </Link>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}

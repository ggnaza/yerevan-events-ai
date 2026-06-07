'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.role === 'admin')
          })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setIsAdmin(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-stone-900">
              Yerevan <span className="text-amber-700">Events</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              Browse Events
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-amber-700 hover:text-amber-800 font-medium transition-colors">
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
              >
                Sign out
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 py-4 space-y-3">
            <Link
              href="/events"
              className="block text-sm text-stone-600 hover:text-stone-900 py-1"
              onClick={() => setMenuOpen(false)}
            >
              Browse Events
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block text-sm text-amber-700 font-medium py-1"
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false) }}
                className="block text-sm text-stone-500 py-1"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" className="block text-sm text-stone-600 py-1" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="block text-sm text-stone-600 py-1" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-200 bg-stone-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <span className="text-base font-semibold text-stone-900">
              Yerevan <span className="text-amber-700">Events</span>
            </span>
            <p className="mt-2 text-sm text-stone-500 max-w-xs">
              Discover what&apos;s happening in Yerevan — concerts, exhibitions,
              meetups, and more.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Discover</p>
              <ul className="space-y-2">
                <li><Link href="/events" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">All Events</Link></li>
                <li><Link href="/events?category=concerts" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Concerts</Link></li>
                <li><Link href="/events?category=exhibitions" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Exhibitions</Link></li>
                <li><Link href="/events?category=tech-meetups" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Tech Meetups</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Account</p>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Log in</Link></li>
                <li><Link href="/register" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Sign up</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-200">
          <p className="text-xs text-stone-400">© {year} Yerevan Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

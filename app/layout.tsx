import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Yerevan Events — What\'s On in Yerevan',
  description: 'Discover concerts, exhibitions, tech meetups, theater, and more happening in Yerevan, Armenia.',
  keywords: 'Yerevan events, Armenia, concerts, exhibitions, things to do in Yerevan',
  openGraph: {
    title: 'Yerevan Events',
    description: 'Discover what\'s happening in Yerevan',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

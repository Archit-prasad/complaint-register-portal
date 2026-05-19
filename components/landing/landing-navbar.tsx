'use client'

import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_LINKS = [
  { label: 'Dashboard',   href: '/feed' },
  { label: 'Public Feed', href: '/feed' },
  { label: 'Guidelines',  href: '#' },
  { label: 'Statistics',  href: '#' },
]

export function LandingNavbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 lg:px-16 pt-6">
      <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-tight text-white select-none">
          CIVIC REPORT
        </Link>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Theme toggle + Official Support */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="text-white hover:bg-white/10 hover:text-white" />
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors duration-200 border border-white/20"
          >
            Official Support
          </Link>
        </div>
      </nav>
    </header>
  )
}

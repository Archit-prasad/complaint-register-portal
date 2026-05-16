import Link from 'next/link'
import { Building2 } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Building2 className="h-5 w-5" />
          CivicReport
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">Feed</Link>
          <Link href="/complaint/create" className="opacity-90 hover:opacity-100 transition-opacity">Report Issue</Link>
          <Link href="/notifications" className="opacity-90 hover:opacity-100 transition-opacity">Notifications</Link>
          <Link href="/profile" className="opacity-90 hover:opacity-100 transition-opacity">Profile</Link>
        </nav>
      </div>
    </header>
  )
}

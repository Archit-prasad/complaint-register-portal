import Link from 'next/link'
import { Building2, Bell, PlusCircle } from 'lucide-react'
import { UserMenu } from './user-menu'
import { cn } from '@/lib/utils'

type NavbarProps = {
  user: { name: string; email: string; avatarUrl: string | null }
  notificationCount?: number
}

export function Navbar({ user, notificationCount = 0 }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-primary shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/feed" className="flex items-center gap-2 text-primary-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">CivicReport</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/feed"
            className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            Feed
          </Link>
          <Link
            href="/complaint/create"
            className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            Report Issue
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/complaint/create"
            className={cn(
              'hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            )}
          >
            <PlusCircle className="h-4 w-4" />
            Report
          </Link>

          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Link>

          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}

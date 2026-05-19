import Link from 'next/link'
import { Building2, LayoutDashboard } from 'lucide-react'
import { AdminLogoutButton } from './admin-logout-button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
]

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen flex flex-col shrink-0 border-r border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none">
          <p className="font-bold text-sm text-foreground">CivicReport</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50">
        <AdminLogoutButton />
      </div>
    </aside>
  )
}

import Link from 'next/link'
import { Building2, LayoutDashboard } from 'lucide-react'
import { AdminLogoutButton } from './admin-logout-button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
]

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col shrink-0">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary/20">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="leading-none">
          <p className="font-bold text-sm">CivicReport</p>
          <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <AdminLogoutButton />
      </div>
    </aside>
  )
}

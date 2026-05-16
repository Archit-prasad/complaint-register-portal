import Link from 'next/link'
import { Building2, LayoutDashboard, FileText, LogOut } from 'lucide-react'

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <Building2 className="h-5 w-5" />
        <span className="font-bold text-lg">CivicReport Admin</span>
      </div>
      <nav className="flex flex-col gap-1 p-4 flex-1">
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/admin"
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <FileText className="h-4 w-4" />
          All Complaints
        </Link>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

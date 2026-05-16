'use client'

import { logout } from '@/actions/auth'
import { LogOut } from 'lucide-react'

export function AdminLogoutButton() {
  return (
    <form action={logout} className="w-full">
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </form>
  )
}

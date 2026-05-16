import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { verifyAdminSession } from '@/lib/dal'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await verifyAdminSession()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}

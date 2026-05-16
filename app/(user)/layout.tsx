import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { getUser } from '@/lib/dal'
import { getUnreadNotificationCount } from '@/lib/queries'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/login')

  const unreadCount = await getUnreadNotificationCount(user.id)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} notificationCount={unreadCount} />
      <main className="flex-1">{children}</main>
    </div>
  )
}

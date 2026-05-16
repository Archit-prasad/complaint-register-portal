import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, CheckCheck, MessageCircle, ThumbsUp, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getUser } from '@/lib/dal'
import { getNotifications } from '@/lib/queries'
import { markAllRead } from '@/actions/notifications'
import { cn } from '@/lib/utils'
import type { NotificationType } from '@/types'

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

const typeIcon: Record<NotificationType, React.ReactNode> = {
  status_change: <RefreshCw className="h-4 w-4 text-primary" />,
  comment: <MessageCircle className="h-4 w-4 text-secondary" />,
  like: <ThumbsUp className="h-4 w-4 text-accent" />,
}

export default async function NotificationsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const notificationList = await getNotifications(user.id)
  const unreadCount = notificationList.filter((n) => !n.isRead).length

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          </form>
        )}
      </div>

      {notificationList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bell className="h-10 w-10 mb-3 opacity-30" />
          <p className="font-medium">No notifications yet</p>
          <p className="text-sm">You'll be notified when someone likes or comments on your complaints.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notificationList.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors',
                n.isRead ? 'bg-card' : 'bg-primary/5 border-primary/20',
              )}
            >
              <div className="mt-0.5 shrink-0">
                {typeIcon[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm', !n.isRead && 'font-medium text-foreground')}>
                  {n.message}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                  {n.complaintId && (
                    <Link
                      href={`/complaint/${n.complaintId}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View complaint
                    </Link>
                  )}
                </div>
              </div>
              {!n.isRead && (
                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

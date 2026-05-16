import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MapPin, Clock, MessageCircle, ThumbsUp } from 'lucide-react'
import { getUser } from '@/lib/dal'
import { getUserComplaints } from '@/lib/queries'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-accent text-accent-foreground' },
  in_review: { label: 'In Review', className: 'bg-primary text-primary-foreground' },
  resolved:  { label: 'Resolved',  className: 'bg-secondary text-secondary-foreground' },
} as const

export default async function ProfilePage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const myComplaints = await getUserComplaints(user.id)
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Profile card */}
      <div className="flex items-center gap-4 mb-8 p-6 rounded-2xl border bg-card shadow-sm">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {myComplaints.length} complaint{myComplaints.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
      </div>

      {/* Complaint history */}
      <h2 className="text-lg font-semibold text-foreground mb-4">My Complaints</h2>

      {myComplaints.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-medium">No complaints yet</p>
          <p className="text-sm mt-1">
            <Link href="/complaint/create" className="text-primary underline">Report an issue</Link> to get started.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myComplaints.map((c) => {
            const status = statusConfig[c.status]
            return (
              <Link
                key={c.id}
                href={`/complaint/${c.id}`}
                className="block rounded-xl border bg-card p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-foreground leading-tight">{c.title}</span>
                  <Badge className={status.className}>{status.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />{c.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{new Date(c.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />{c.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />{c.commentCount}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

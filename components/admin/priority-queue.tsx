import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowUp, MapPin, MessageSquare, User } from 'lucide-react'
import type { FeedComplaint } from '@/types'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700' },
  in_review: { label: 'In Review', className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700' },
  resolved:  { label: 'Resolved',  className: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700' },
} as const

export function PriorityQueue({ complaints }: { complaints: FeedComplaint[] }) {
  if (complaints.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center text-sm text-muted-foreground shadow-sm">
        No complaints in the queue.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {complaints.map((c, idx) => {
        const s = statusConfig[c.status]
        return (
          <div
            key={c.id}
            className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex items-start gap-4"
          >
            {/* Priority rank */}
            <div className="flex flex-col items-center gap-1 min-w-[48px]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                #{idx + 1}
              </div>
              <div className="flex items-center gap-0.5 text-sm font-semibold text-primary">
                <ArrowUp className="h-3.5 w-3.5" />
                {c.priorityLikes}
              </div>
            </div>

            {/* Complaint info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <Link
                  href={`/admin/complaints/${c.id}`}
                  className="font-semibold text-foreground hover:text-primary hover:underline line-clamp-1"
                >
                  {c.title}
                </Link>
                <Badge variant="outline" className={`shrink-0 text-xs ${s.className}`}>
                  {s.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{c.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {c.userName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {c.location}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> {c.commentCount} comments
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

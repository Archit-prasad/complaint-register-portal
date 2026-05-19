import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { LikeButton } from './like-button'
import { ComplaintImage } from './complaint-image'
import type { FeedComplaint } from '@/types'

const statusConfig = {
  pending: {
    label: 'Pending',
    className:
      'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/60 font-semibold',
  },
  in_review: {
    label: 'In Review',
    className:
      'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/60 font-semibold',
  },
  resolved: {
    label: 'Resolved',
    className:
      'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700/60 font-semibold',
  },
} as const

export function ComplaintCard({ complaint }: { complaint: FeedComplaint }) {
  const status = statusConfig[complaint.status]
  const initials = complaint.userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <article className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 dark:shadow-black/30 dark:hover:shadow-black/50">
      {/* Image or fallback */}
      <Link href={`/complaint/${complaint.id}`} className="block">
        <ComplaintImage
          src={complaint.imageUrl}
          alt={complaint.title}
          title={complaint.title}
        />
      </Link>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/complaint/${complaint.id}`} className="hover:underline flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
              {complaint.title}
            </h3>
          </Link>
          <Badge variant="outline" className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${status.className}`}>
            {status.label}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {complaint.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {complaint.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(complaint.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-3 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            {complaint.userAvatar && (
              <AvatarImage src={complaint.userAvatar} alt={complaint.userName} />
            )}
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{complaint.userName}</span>
        </div>

        <div className="flex items-center gap-1">
          <LikeButton
            complaintId={complaint.id}
            initialLiked={complaint.liked}
            initialCount={complaint.likeCount}
          />
          <Link
            href={`/complaint/${complaint.id}#comments`}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{complaint.commentCount}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, MapPin, Clock } from 'lucide-react'
import { LikeButton } from './like-button'
import type { FeedComplaint } from '@/types'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-accent text-accent-foreground' },
  in_review: { label: 'In Review', className: 'bg-primary text-primary-foreground' },
  resolved:  { label: 'Resolved',  className: 'bg-secondary text-secondary-foreground' },
} as const

export function ComplaintCard({ complaint }: { complaint: FeedComplaint }) {
  const status = statusConfig[complaint.status]
  const initials = complaint.userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {complaint.imageUrl && (
        <Link href={`/complaint/${complaint.id}`}>
          <div className="aspect-video overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={complaint.imageUrl}
              alt={complaint.title}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/complaint/${complaint.id}`} className="hover:underline">
            <h3 className="font-semibold text-foreground leading-tight">{complaint.title}</h3>
          </Link>
          <Badge className={status.className}>{status.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{complaint.description}</p>
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
      </CardContent>
      <CardFooter className="border-t px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            {complaint.userAvatar && <AvatarImage src={complaint.userAvatar} alt={complaint.userName} />}
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{complaint.userName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LikeButton
            complaintId={complaint.id}
            initialLiked={complaint.liked}
            initialCount={complaint.likeCount}
          />
          <Link
            href={`/complaint/${complaint.id}#comments`}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{complaint.commentCount}</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

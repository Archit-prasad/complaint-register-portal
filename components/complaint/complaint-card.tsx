import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThumbsUp, MessageCircle, MapPin, Clock } from 'lucide-react'
import type { Complaint } from '@/types'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-accent text-accent-foreground' },
  in_review: { label: 'In Review', className: 'bg-primary text-primary-foreground' },
  resolved:  { label: 'Resolved',  className: 'bg-secondary text-secondary-foreground' },
} as const

export function ComplaintCard({ complaint }: { complaint: Complaint }) {
  const status = statusConfig[complaint.status]

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {complaint.imageUrl && (
        <div className="aspect-video overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={complaint.imageUrl}
            alt={complaint.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground leading-tight">{complaint.title}</h3>
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
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {complaint.user?.name?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{complaint.user?.name ?? 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <ThumbsUp className="h-4 w-4" />
            <span>{complaint._count?.likes ?? 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>{complaint._count?.comments ?? 0}</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}

import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { LikeButton } from '@/components/complaint/like-button'
import { CommentSection } from '@/components/complaint/comment-section'
import { getUser } from '@/lib/dal'
import { getComplaint, getComments } from '@/lib/queries'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-accent text-accent-foreground' },
  in_review: { label: 'In Review', className: 'bg-primary text-primary-foreground' },
  resolved:  { label: 'Resolved',  className: 'bg-secondary text-secondary-foreground' },
} as const

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getUser()
  const [complaint, commentList] = await Promise.all([
    getComplaint(id, user?.id),
    getComments(id),
  ])

  if (!complaint) notFound()

  const status = statusConfig[complaint.status]
  const initials = complaint.userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-foreground leading-tight">{complaint.title}</h1>
        <Badge className={status.className}>{status.label}</Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            {complaint.userAvatar && <AvatarImage src={complaint.userAvatar} alt={complaint.userName} />}
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <span>{complaint.userName}</span>
        </div>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />{complaint.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />{new Date(complaint.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Complaint image */}
      {complaint.imageUrl && (
        <div className="mb-6 rounded-xl overflow-hidden border aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={complaint.imageUrl} alt={complaint.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Description */}
      <p className="text-foreground leading-relaxed mb-6">{complaint.description}</p>

      {/* Result proof (resolved) */}
      {complaint.resultImageUrl && (
        <div className="mb-6 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
          <div className="flex items-center gap-2 mb-3 text-secondary font-semibold">
            <CheckCircle2 className="h-5 w-5" />
            Issue Resolved — Result Photo
          </div>
          <div className="rounded-lg overflow-hidden aspect-video bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={complaint.resultImageUrl} alt="Resolution proof" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mb-8 border-t pt-4">
        <LikeButton
          complaintId={complaint.id}
          initialLiked={complaint.liked}
          initialCount={complaint.likeCount}
        />
        <span className="text-sm text-muted-foreground">
          {complaint.commentCount} {complaint.commentCount === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      {/* Comments */}
      <CommentSection complaintId={complaint.id} commentList={commentList} />
    </div>
  )
}

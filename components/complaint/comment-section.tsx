import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddCommentForm } from './add-comment-form'
import type { CommentWithUser } from '@/types'

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

type Props = {
  complaintId: string
  commentList: CommentWithUser[]
}

export function CommentSection({ complaintId, commentList }: Props) {
  return (
    <section id="comments" className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Comments ({commentList.length})
      </h2>

      <div className="mb-6">
        <AddCommentForm complaintId={complaintId} />
      </div>

      {commentList.length === 0 ? (
        <p className="text-center py-8 text-sm text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {commentList.map((c) => {
            const initials = c.userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            return (
              <div key={c.id} className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  {c.userAvatar && <AvatarImage src={c.userAvatar} alt={c.userName} />}
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 rounded-2xl bg-muted px-4 py-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">{c.userName}</span>
                    <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{c.content}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { toggleLike } from '@/actions/complaints'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  complaintId: string
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({ complaintId, initialLiked, initialCount }: Props) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    const next = !liked
    setLiked(next)
    setCount((c) => (next ? c + 1 : Math.max(0, c - 1)))
    startTransition(async () => { await toggleLike(complaintId) })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      title={liked ? 'Unlike' : 'Like'}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200',
        liked
          ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20'
          : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10',
      )}
    >
      <Heart className={cn('h-4 w-4 transition-transform duration-200', liked && 'fill-rose-500 scale-110')} />
      <span>{count}</span>
    </button>
  )
}

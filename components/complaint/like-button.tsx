'use client'

import { useState, useTransition } from 'react'
import { toggleLike } from '@/actions/complaints'
import { ThumbsUp } from 'lucide-react'
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
    setCount((c) => (next ? c + 1 : c - 1))

    startTransition(async () => {
      await toggleLike(complaintId)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors',
        liked
          ? 'text-primary bg-primary/10 hover:bg-primary/15'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/10',
      )}
    >
      <ThumbsUp className={cn('h-4 w-4', liked && 'fill-primary')} />
      <span>{count}</span>
    </button>
  )
}

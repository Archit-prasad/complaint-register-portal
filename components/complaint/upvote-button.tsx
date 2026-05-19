'use client'

import { useState, useTransition } from 'react'
import { toggleUpvote } from '@/actions/complaints'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  complaintId: string
  initialUpvoted: boolean
  initialCount: number
}

export function UpvoteButton({ complaintId, initialUpvoted, initialCount }: Props) {
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [count, setCount]     = useState(initialCount)
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    const next = !upvoted
    setUpvoted(next)
    setCount((c) => (next ? c + 1 : Math.max(0, c - 1)))
    startTransition(async () => { await toggleUpvote(complaintId) })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      title={upvoted ? 'Remove priority upvote' : 'Upvote — raises admin priority'}
      className={cn(
        'flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold transition-all duration-200',
        upvoted
          ? 'text-primary bg-primary/10 hover:bg-primary/20 scale-105'
          : 'text-muted-foreground hover:text-primary hover:bg-primary/10',
      )}
    >
      <ArrowUp
        className={cn(
          'h-4 w-4 transition-transform duration-200',
          upvoted && 'fill-primary -translate-y-0.5',
        )}
      />
      <span>{count}</span>
    </button>
  )
}

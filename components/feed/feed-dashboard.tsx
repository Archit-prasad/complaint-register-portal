'use client'

import { useState, useMemo } from 'react'
import { LeftSidebar } from './left-sidebar'
import { RightSidebar } from './right-sidebar'
import { ComplaintFeed } from '@/components/complaint/complaint-feed'
import type { FeedComplaint } from '@/types'
import type { FeedStats } from '@/actions/feed'

export type ActiveFilter = 'all' | 'upvoted' | 'resolved'

type Props = {
  complaints: FeedComplaint[]
  initialStats: FeedStats
}

export function FeedDashboard({ complaints, initialStats }: Props) {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all')

  const filtered = useMemo(() => {
    if (activeFilter === 'resolved') {
      return complaints.filter((c) => c.status === 'resolved')
    }
    if (activeFilter === 'upvoted') {
      return [...complaints].sort((a, b) => b.upvoteCount - a.upvoteCount)
    }
    return complaints
  }, [complaints, activeFilter])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 py-6">
      <div className="lg:col-span-3">
        <LeftSidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          stats={initialStats}
        />
      </div>

      <div className="lg:col-span-6">
        <ComplaintFeed complaints={filtered} />
      </div>

      <div className="lg:col-span-3">
        <RightSidebar initialStats={initialStats} />
      </div>
    </div>
  )
}

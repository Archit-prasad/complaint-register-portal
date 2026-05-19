'use client'

import Link from 'next/link'
import { PlusCircle, LayoutList, TrendingUp, CheckCircle2, Clock, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActiveFilter } from './feed-dashboard'
import type { FeedStats } from '@/actions/feed'

type Props = {
  activeFilter: ActiveFilter
  setActiveFilter: (f: ActiveFilter) => void
  stats: FeedStats
}

const FILTERS: { id: ActiveFilter; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'all',      label: 'All Feeds',       icon: LayoutList,   description: 'Newest first' },
  { id: 'upvoted',  label: 'Highly Upvoted',  icon: TrendingUp,   description: 'Sorted by priority' },
  { id: 'resolved', label: 'Resolved Issues', icon: CheckCircle2, description: 'Confirmed fixes' },
]

export function LeftSidebar({ activeFilter, setActiveFilter, stats }: Props) {
  const countForFilter = (id: ActiveFilter) => {
    if (id === 'all')      return stats.total
    if (id === 'resolved') return stats.resolved
    // "upvoted" = any complaint with at least one priority upvote — use total as upper bound
    return stats.total
  }

  return (
    <aside className="space-y-4">
      {/* New Report CTA */}
      <Link
        href="/complaint/create"
        className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm"
      >
        <PlusCircle className="h-4 w-4" />
        Report New Issue
      </Link>

      {/* Filter navigation */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Filter Feed
          </h2>
        </div>
        <nav className="p-2 flex flex-col gap-1">
          {FILTERS.map(({ id, label, icon: Icon, description }) => {
            const isActive = activeFilter === id
            return (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-muted/60',
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium leading-none', isActive ? 'text-primary-foreground' : 'text-foreground')}>
                    {label}
                  </p>
                  <p className={cn('text-xs mt-0.5', isActive ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {description}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-xs font-bold rounded-full px-1.5 py-0.5 tabular-nums',
                    isActive
                      ? 'bg-white/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {countForFilter(id)}
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Quick status breakdown */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-4 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Status Overview
        </h2>
        {[
          { label: 'Pending',   count: stats.pending,  icon: Clock,       color: 'text-amber-500' },
          { label: 'In Review', count: stats.inReview, icon: Eye,         color: 'text-blue-500'  },
          { label: 'Resolved',  count: stats.resolved, icon: CheckCircle2, color: 'text-emerald-500' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={cn('h-3.5 w-3.5', color)} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{count}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

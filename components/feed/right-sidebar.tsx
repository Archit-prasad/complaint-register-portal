'use client'

import { useState, useTransition } from 'react'
import { refreshStats } from '@/actions/feed'
import { RefreshCw, BarChart3, CheckCircle2, Clock, Eye, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FeedStats } from '@/actions/feed'

type Props = {
  initialStats: FeedStats
}

export function RightSidebar({ initialStats }: Props) {
  const [stats, setStats] = useState(initialStats)
  const [pending, startTransition] = useTransition()
  const [justRefreshed, setJustRefreshed] = useState(false)

  function handleRefresh() {
    startTransition(async () => {
      const fresh = await refreshStats()
      setStats(fresh)
      setJustRefreshed(true)
      setTimeout(() => setJustRefreshed(false), 2000)
    })
  }

  const resolvedPct = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0
  const inReviewPct = stats.total > 0 ? Math.round((stats.inReview / stats.total) * 100) : 0
  const pendingPct  = stats.total > 0 ? Math.round((stats.pending  / stats.total) * 100) : 0

  return (
    <aside className="space-y-4">
      {/* Live Analytics card */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Analytics
            </h2>
          </div>
          <button
            onClick={handleRefresh}
            disabled={pending}
            title="Refresh statistics"
            className={cn(
              'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-200',
              justRefreshed
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            )}
          >
            <RefreshCw className={cn('h-3 w-3', pending && 'animate-spin')} />
            {justRefreshed ? 'Updated!' : 'Refresh'}
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Total */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Reports</span>
            </div>
            <span className="text-sm font-bold text-foreground tabular-nums">{stats.total}</span>
          </div>

          <div className="h-px bg-border/50" />

          {/* Breakdown with progress bars */}
          {[
            { label: 'Resolved',  count: stats.resolved, pct: resolvedPct, icon: CheckCircle2, color: 'text-emerald-500', bar: 'bg-emerald-500' },
            { label: 'In Review', count: stats.inReview, pct: inReviewPct, icon: Eye,          color: 'text-blue-500',    bar: 'bg-blue-500'    },
            { label: 'Pending',   count: stats.pending,  pct: pendingPct,  icon: Clock,        color: 'text-amber-500',   bar: 'bg-amber-500'   },
          ].map(({ label, count, pct, icon: Icon, color, bar }) => (
            <div key={label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-3.5 w-3.5', color)} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <div className="flex items-center gap-1.5 tabular-nums">
                  <span className="text-xs font-semibold text-foreground">{count}</span>
                  <span className="text-xs text-muted-foreground">({pct}%)</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolution rate highlight */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Resolution Rate
        </p>
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {resolvedPct}
          <span className="text-lg font-medium text-muted-foreground">%</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {stats.resolved} of {stats.total} issues resolved
        </p>
      </div>

      {/* Tip card */}
      <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1.5">
        <p className="text-xs font-semibold text-foreground">How priority works</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upvoting a report raises its priority score, pushing it to the top of the admin queue so critical issues get faster attention.
        </p>
      </div>
    </aside>
  )
}

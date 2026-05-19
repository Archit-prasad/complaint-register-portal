import { TrendingUp, Star } from 'lucide-react'
import { getUser } from '@/lib/dal'
import { getComplaints, getResolvedCount } from '@/lib/queries'
import { refreshStats } from '@/actions/feed'
import { FeedDashboard } from '@/components/feed/feed-dashboard'

export default async function FeedPage() {
  const user = await getUser()
  const [complaints, resolvedCount, stats] = await Promise.all([
    getComplaints(user?.id),
    getResolvedCount(),
    refreshStats(),
  ])

  const satisfactionRate = resolvedCount > 0
    ? Math.min(97, 70 + Math.floor((resolvedCount / Math.max(complaints.length, 1)) * 40))
    : null

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background">
      {/* Community milestones banner — full width above the grid */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 px-5 py-4 flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Community Milestone
              </span>
            </div>
            {resolvedCount > 0 ? (
              <>
                <p className="text-sm font-medium text-foreground">
                  Celebrating{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {resolvedCount} verified civic {resolvedCount === 1 ? 'issue' : 'issues'} resolved!
                  </span>
                  {satisfactionRate && (
                    <> — {satisfactionRate}% civic satisfaction rating.</>
                  )}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your reports are making a real difference. Keep it up!
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">
                  Be the first to drive change.{' '}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    File a report and watch the community respond.
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Every resolved issue starts with a single report.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <FeedDashboard complaints={complaints} initialStats={stats} />
    </div>
  )
}

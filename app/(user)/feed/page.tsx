import Link from 'next/link'
import { PlusCircle, TrendingUp, Star } from 'lucide-react'
import { getUser } from '@/lib/dal'
import { getComplaints } from '@/lib/queries'
import { ComplaintFeed } from '@/components/complaint/complaint-feed'

export default async function FeedPage() {
  const user = await getUser()
  const complaints = await getComplaints(user?.id)

  return (
    <div className="min-h-screen transition-colors duration-500 bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Community Milestones Banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 px-5 py-4 flex items-start gap-3">
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
            <p className="text-sm font-medium text-foreground">
              142 potholes fixed in Seattle this month.{' '}
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                87% civic satisfaction rating.
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your reports are making a real difference. Keep it up!
            </p>
          </div>
        </div>

        {/* Feed header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Public Feed</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recent civic issues reported in your area
            </p>
          </div>
          <Link
            href="/complaint/create"
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Report Issue
          </Link>
        </div>

        <ComplaintFeed complaints={complaints} />
      </div>
    </div>
  )
}

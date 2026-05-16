import { FileText, Clock, Eye, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsCard } from '@/components/admin/stats-card'
import { ComplaintsTable } from '@/components/admin/complaints-table'
import { ComplaintsChart } from '@/components/admin/complaints-chart'
import { getAdminStats, getAdminComplaints } from '@/lib/queries'

export default async function AdminDashboardPage() {
  const [stats, complaints] = await Promise.all([
    getAdminStats(),
    getAdminComplaints(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of all civic complaints</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Complaints"
          value={stats.total}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          variant="accent"
          description="Awaiting review"
        />
        <StatsCard
          title="In Review"
          value={stats.inReview}
          icon={Eye}
          variant="primary"
          description="Being processed"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle2}
          variant="secondary"
          description="Issues closed"
        />
      </div>

      {/* Chart + quick summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Complaint Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplaintsChart
              pending={stats.pending}
              inReview={stats.inReview}
              resolved={stats.resolved}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">
            {stats.total > 0 ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Resolved</span>
                    <span className="font-semibold text-secondary">
                      {Math.round((stats.resolved / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">In Review</span>
                    <span className="font-semibold text-primary">
                      {Math.round((stats.inReview / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(stats.inReview / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-semibold text-accent">
                      {Math.round((stats.pending / stats.total) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${(stats.pending / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No complaints yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All complaints table */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">All Complaints</h2>
        <span className="text-sm text-muted-foreground">{complaints.length} total</span>
      </div>
      <ComplaintsTable complaints={complaints} />
    </div>
  )
}

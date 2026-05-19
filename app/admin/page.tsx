import { FileText, Clock, Eye, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatsCard } from '@/components/admin/stats-card'
import { ComplaintsTable } from '@/components/admin/complaints-table'
import { ComplaintsChart } from '@/components/admin/complaints-chart'
import { UserDirectory } from '@/components/admin/user-directory'
import { PriorityQueue } from '@/components/admin/priority-queue'
import { getAdminStats, getAdminComplaints, getPriorityQueue, getAdminUsers } from '@/lib/queries'

export default async function AdminDashboardPage() {
  const [stats, complaints, queue, adminUsers] = await Promise.all([
    getAdminStats(),
    getAdminComplaints(),
    getPriorityQueue(),
    getAdminUsers(),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage complaints, users, and platform moderation</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="queue">Priority Queue</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard title="Total Complaints" value={stats.total}    icon={FileText}    variant="default" />
            <StatsCard title="Pending"          value={stats.pending}  icon={Clock}       variant="accent"   description="Awaiting review" />
            <StatsCard title="In Review"        value={stats.inReview} icon={Eye}         variant="primary"  description="Being processed" />
            <StatsCard title="Resolved"         value={stats.resolved} icon={CheckCircle2} variant="secondary" description="Issues closed" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Complaint Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ComplaintsChart pending={stats.pending} inReview={stats.inReview} resolved={stats.resolved} />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pt-2">
                {stats.total > 0 ? (
                  <>
                    {[
                      { label: 'Resolved', count: stats.resolved, cls: 'bg-secondary text-secondary' },
                      { label: 'In Review', count: stats.inReview, cls: 'bg-primary text-primary' },
                      { label: 'Pending', count: stats.pending, cls: 'bg-accent text-accent' },
                    ].map(({ label, count, cls }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{label}</span>
                          <span className={`font-semibold ${cls.split(' ')[1]}`}>
                            {Math.round((count / stats.total) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cls.split(' ')[0]}`}
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No complaints yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">All Complaints</h2>
              <span className="text-sm text-muted-foreground">{complaints.length} total</span>
            </div>
            <ComplaintsTable complaints={complaints} />
          </div>
        </TabsContent>

        {/* ── User Directory ── */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">User Directory</h2>
              <p className="text-sm text-muted-foreground">{adminUsers.length} registered users</p>
            </div>
          </div>
          <UserDirectory users={adminUsers} />
        </TabsContent>

        {/* ── Priority Queue ── */}
        <TabsContent value="queue" className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Global Priority Queue</h2>
            <p className="text-sm text-muted-foreground">
              Complaints ranked by community upvotes — highest priority at the top.
            </p>
          </div>
          <PriorityQueue complaints={queue} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

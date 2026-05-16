import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusUpdateForm } from '@/components/admin/status-update-form'
import { ResultImageForm } from '@/components/admin/result-image-form'
import { getComplaint } from '@/lib/queries'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-accent text-accent-foreground' },
  in_review: { label: 'In Review', className: 'bg-primary text-primary-foreground' },
  resolved:  { label: 'Resolved',  className: 'bg-secondary text-secondary-foreground' },
} as const

export default async function AdminComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const complaint = await getComplaint(id)
  if (!complaint) notFound()

  const status = statusConfig[complaint.status]

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground leading-tight">{complaint.title}</h1>
        <Badge className={status.className}>{status.label}</Badge>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />{complaint.userName}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />{complaint.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {new Date(complaint.createdAt).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — complaint content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {complaint.imageUrl && (
            <div className="rounded-xl overflow-hidden border aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={complaint.imageUrl} alt={complaint.title} className="h-full w-full object-cover" />
            </div>
          )}

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed text-sm">{complaint.description}</p>
            </CardContent>
          </Card>

          {complaint.resultImageUrl && (
            <Card className="shadow-sm border-secondary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-secondary uppercase tracking-wide">
                  Resolution Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden border aspect-video bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={complaint.resultImageUrl}
                    alt="Resolution proof"
                    className="h-full w-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — admin actions */}
        <div className="flex flex-col gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Manage Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatusUpdateForm
                complaintId={complaint.id}
                currentStatus={complaint.status}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Result Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResultImageForm
                complaintId={complaint.id}
                existingUrl={complaint.resultImageUrl}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Likes</span>
              <span className="font-medium text-foreground">{complaint.likeCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Comments</span>
              <span className="font-medium text-foreground">{complaint.commentCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Last updated</span>
              <span className="font-medium text-foreground">
                {new Date(complaint.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { ComplaintCard } from './complaint-card'
import type { Complaint } from '@/types'

export function ComplaintFeed({ complaints }: { complaints: Complaint[] }) {
  if (complaints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">No complaints yet</p>
        <p className="text-sm">Be the first to report a public issue.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {complaints.map((c) => (
        <ComplaintCard key={c.id} complaint={c} />
      ))}
    </div>
  )
}

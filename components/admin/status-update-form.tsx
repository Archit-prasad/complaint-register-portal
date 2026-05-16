'use client'

import { useActionState } from 'react'
import { updateComplaintStatus } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { ComplaintStatus } from '@/types'

const statuses: { value: ComplaintStatus; label: string }[] = [
  { value: 'pending',   label: 'Pending' },
  { value: 'in_review', label: 'In Review' },
  { value: 'resolved',  label: 'Resolved' },
]

export function StatusUpdateForm({
  complaintId,
  currentStatus,
}: {
  complaintId: string
  currentStatus: ComplaintStatus
}) {
  const [state, action, pending] = useActionState(updateComplaintStatus, undefined)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="complaintId" value={complaintId} />

      <label htmlFor="status" className="text-sm font-medium text-foreground">
        Update Status
      </label>
      <div className="flex items-center gap-2">
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={pending} className="h-10">
          {pending ? 'Saving…' : 'Update'}
        </Button>
      </div>

      {state?.success && (
        <p className="flex items-center gap-1.5 text-sm text-secondary">
          <CheckCircle2 className="h-4 w-4" />
          Status updated successfully.
        </p>
      )}
      {state?.message && !state.success && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {state.message}
        </p>
      )}
    </form>
  )
}

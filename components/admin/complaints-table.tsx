'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { FeedComplaint } from '@/types'

const statusConfig = {
  pending:   { label: 'Pending',   className: 'bg-accent/20 text-accent-foreground border-accent' },
  in_review: { label: 'In Review', className: 'bg-primary/20 text-primary border-primary' },
  resolved:  { label: 'Resolved',  className: 'bg-secondary/20 text-secondary border-secondary' },
} as const

export function ComplaintsTable({ complaints }: { complaints: FeedComplaint[] }) {
  if (complaints.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center text-sm text-muted-foreground shadow-sm">
        No complaints to display.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Reported by</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.map((c) => {
            const s = statusConfig[c.status]
            return (
              <TableRow key={c.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link
                    href={`/admin/complaints/${c.id}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {c.title}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.location}</TableCell>
                <TableCell className="text-muted-foreground">{c.userName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={s.className}>{s.label}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(c.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

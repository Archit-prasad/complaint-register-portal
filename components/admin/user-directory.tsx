'use client'

import { useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { banUser, unbanUser } from '@/actions/admin'
import type { AdminUser } from '@/types'
import { ShieldBan, ShieldCheck } from 'lucide-react'

export function UserDirectory({ users }: { users: AdminUser[] }) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center text-sm text-muted-foreground shadow-sm">
        No users found.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Complaints</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function UserRow({ user }: { user: AdminUser }) {
  const [pending, startTransition] = useTransition()

  const handleBan = () =>
    startTransition(async () => {
      await banUser(user.id)
    })

  const handleUnban = () =>
    startTransition(async () => {
      await unbanUser(user.id)
    })

  const isBanned = user.status === 'banned'
  const isAdmin = user.role === 'admin'

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            isAdmin
              ? 'bg-primary/15 text-primary border-primary/40'
              : 'bg-muted text-muted-foreground border-border'
          }
        >
          {isAdmin ? 'Admin' : 'User'}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            isBanned
              ? 'bg-destructive/15 text-destructive border-destructive/40'
              : 'bg-secondary/15 text-secondary border-secondary/40'
          }
        >
          {isBanned ? 'Banned' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell className="text-right text-muted-foreground">{user.complaintCount}</TableCell>
      <TableCell className="text-right">
        {isAdmin ? (
          <span className="text-xs text-muted-foreground italic">Protected</span>
        ) : isBanned ? (
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={handleUnban}
            className="gap-1.5 text-secondary border-secondary/40 hover:bg-secondary/10"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {pending ? 'Unbanning…' : 'Unban'}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={handleBan}
            className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
          >
            <ShieldBan className="h-3.5 w-3.5" />
            {pending ? 'Banning…' : 'Ban User'}
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

'use server'

import { db } from '@/lib/db'
import { complaints } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export type FeedStats = {
  total: number
  resolved: number
  inReview: number
  pending: number
}

// Not wrapped in React.cache — always executes a fresh DB round-trip so
// the "Refresh Statistics" button returns up-to-date counts.
export async function refreshStats(): Promise<FeedStats> {
  const [result] = await db
    .select({
      total:    sql<number>`cast(count(*) as integer)`,
      resolved: sql<number>`cast(count(*) filter (where ${complaints.status} = 'resolved')  as integer)`,
      inReview: sql<number>`cast(count(*) filter (where ${complaints.status} = 'in_review') as integer)`,
      pending:  sql<number>`cast(count(*) filter (where ${complaints.status} = 'pending')   as integer)`,
    })
    .from(complaints)
  return result ?? { total: 0, resolved: 0, inReview: 0, pending: 0 }
}

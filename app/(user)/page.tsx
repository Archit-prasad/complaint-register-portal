import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { getUser } from '@/lib/dal'
import { getComplaints } from '@/lib/queries'
import { ComplaintFeed } from '@/components/complaint/complaint-feed'

export default async function FeedPage() {
  const user = await getUser()
  const complaints = await getComplaints(user?.id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Public Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">Recent civic issues reported in your area</p>
        </div>
        <Link
          href="/complaint/create"
          className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Report Issue
        </Link>
      </div>

      <ComplaintFeed complaints={complaints} />
    </div>
  )
}

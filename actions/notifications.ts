'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { verifySession } from '@/lib/dal'
import { eq, and } from 'drizzle-orm'

export async function markNotificationRead(notificationId: string) {
  const session = await verifySession()

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, session.userId)))

  revalidatePath('/notifications')
}

export async function markAllRead() {
  const session = await verifySession()

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, session.userId))

  revalidatePath('/notifications')
}

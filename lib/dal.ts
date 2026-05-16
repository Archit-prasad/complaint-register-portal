import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { users } from '@/lib/db/schema'

export const verifySession = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/login')
  return session
})

export const verifyAdminSession = cache(async () => {
  const session = await getSession()
  if (!session?.userId) redirect('/login')
  if (session.role !== 'admin') redirect('/')
  return session
})

export const getUser = cache(async () => {
  const session = await getSession()
  if (!session?.userId) return null

  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, session.userId))

  return user ?? null
})

import 'server-only'
import { cache } from 'react'
import { db } from '@/lib/db'
import { complaints, users, likes, comments, notifications } from '@/lib/db/schema'
import { eq, desc, sql, and } from 'drizzle-orm'
import type { FeedComplaint, CommentWithUser, Notification } from '@/types'

export const getComplaints = cache(async (currentUserId?: string): Promise<FeedComplaint[]> => {
  const rows = await db
    .select({
      id: complaints.id,
      userId: complaints.userId,
      title: complaints.title,
      description: complaints.description,
      location: complaints.location,
      imageUrl: complaints.imageUrl,
      resultImageUrl: complaints.resultImageUrl,
      status: complaints.status,
      createdAt: complaints.createdAt,
      updatedAt: complaints.updatedAt,
      userName: users.name,
      userAvatar: users.avatarUrl,
      likeCount: sql<number>`cast(count(distinct ${likes.id}) as integer)`,
      commentCount: sql<number>`cast(count(distinct ${comments.id}) as integer)`,
    })
    .from(complaints)
    .innerJoin(users, eq(complaints.userId, users.id))
    .leftJoin(likes, eq(likes.complaintId, complaints.id))
    .leftJoin(comments, eq(comments.complaintId, complaints.id))
    .groupBy(complaints.id, users.id)
    .orderBy(desc(complaints.createdAt))

  const likedSet = new Set<string>()
  if (currentUserId) {
    const userLikes = await db
      .select({ complaintId: likes.complaintId })
      .from(likes)
      .where(eq(likes.userId, currentUserId))
    userLikes.forEach((l) => likedSet.add(l.complaintId))
  }

  return rows.map((r) => ({ ...r, liked: likedSet.has(r.id) }))
})

export const getComplaint = cache(async (id: string, currentUserId?: string): Promise<FeedComplaint | null> => {
  const [row] = await db
    .select({
      id: complaints.id,
      userId: complaints.userId,
      title: complaints.title,
      description: complaints.description,
      location: complaints.location,
      imageUrl: complaints.imageUrl,
      resultImageUrl: complaints.resultImageUrl,
      status: complaints.status,
      createdAt: complaints.createdAt,
      updatedAt: complaints.updatedAt,
      userName: users.name,
      userAvatar: users.avatarUrl,
      likeCount: sql<number>`cast(count(distinct ${likes.id}) as integer)`,
      commentCount: sql<number>`cast(count(distinct ${comments.id}) as integer)`,
    })
    .from(complaints)
    .innerJoin(users, eq(complaints.userId, users.id))
    .leftJoin(likes, eq(likes.complaintId, complaints.id))
    .leftJoin(comments, eq(comments.complaintId, complaints.id))
    .where(eq(complaints.id, id))
    .groupBy(complaints.id, users.id)

  if (!row) return null

  let liked = false
  if (currentUserId) {
    const [likedRow] = await db
      .select({ id: likes.id })
      .from(likes)
      .where(and(eq(likes.complaintId, id), eq(likes.userId, currentUserId)))
    liked = !!likedRow
  }

  return { ...row, liked }
})

export const getComments = cache(async (complaintId: string): Promise<CommentWithUser[]> => {
  return db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userId: comments.userId,
      userName: users.name,
      userAvatar: users.avatarUrl,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.complaintId, complaintId))
    .orderBy(desc(comments.createdAt))
})

export const getUserComplaints = cache(async (userId: string): Promise<FeedComplaint[]> => {
  const rows = await db
    .select({
      id: complaints.id,
      userId: complaints.userId,
      title: complaints.title,
      description: complaints.description,
      location: complaints.location,
      imageUrl: complaints.imageUrl,
      resultImageUrl: complaints.resultImageUrl,
      status: complaints.status,
      createdAt: complaints.createdAt,
      updatedAt: complaints.updatedAt,
      userName: users.name,
      userAvatar: users.avatarUrl,
      likeCount: sql<number>`cast(count(distinct ${likes.id}) as integer)`,
      commentCount: sql<number>`cast(count(distinct ${comments.id}) as integer)`,
    })
    .from(complaints)
    .innerJoin(users, eq(complaints.userId, users.id))
    .leftJoin(likes, eq(likes.complaintId, complaints.id))
    .leftJoin(comments, eq(comments.complaintId, complaints.id))
    .where(eq(complaints.userId, userId))
    .groupBy(complaints.id, users.id)
    .orderBy(desc(complaints.createdAt))

  return rows.map((r) => ({ ...r, liked: false }))
})

export const getNotifications = cache(async (userId: string): Promise<Notification[]> => {
  return db
    .select({
      id: notifications.id,
      userId: notifications.userId,
      complaintId: notifications.complaintId,
      type: notifications.type,
      message: notifications.message,
      isRead: notifications.isRead,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
})

export const getUnreadNotificationCount = cache(async (userId: string): Promise<number> => {
  const [result] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
  return result?.count ?? 0
})

export type AdminStats = {
  total: number
  pending: number
  inReview: number
  resolved: number
}

export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const [result] = await db
    .select({
      total:    sql<number>`cast(count(*) as integer)`,
      pending:  sql<number>`cast(count(*) filter (where ${complaints.status} = 'pending') as integer)`,
      inReview: sql<number>`cast(count(*) filter (where ${complaints.status} = 'in_review') as integer)`,
      resolved: sql<number>`cast(count(*) filter (where ${complaints.status} = 'resolved') as integer)`,
    })
    .from(complaints)
  return result ?? { total: 0, pending: 0, inReview: 0, resolved: 0 }
})

export const getAdminComplaints = cache(async (status?: string): Promise<FeedComplaint[]> => {
  const rows = await db
    .select({
      id:             complaints.id,
      userId:         complaints.userId,
      title:          complaints.title,
      description:    complaints.description,
      location:       complaints.location,
      imageUrl:       complaints.imageUrl,
      resultImageUrl: complaints.resultImageUrl,
      status:         complaints.status,
      createdAt:      complaints.createdAt,
      updatedAt:      complaints.updatedAt,
      userName:       users.name,
      userAvatar:     users.avatarUrl,
      likeCount:      sql<number>`cast(count(distinct ${likes.id}) as integer)`,
      commentCount:   sql<number>`cast(count(distinct ${comments.id}) as integer)`,
    })
    .from(complaints)
    .innerJoin(users, eq(complaints.userId, users.id))
    .leftJoin(likes, eq(likes.complaintId, complaints.id))
    .leftJoin(comments, eq(comments.complaintId, complaints.id))
    .where(status ? eq(complaints.status, status as 'pending' | 'in_review' | 'resolved') : undefined)
    .groupBy(complaints.id, users.id)
    .orderBy(desc(complaints.createdAt))

  return rows.map((r) => ({ ...r, liked: false }))
})

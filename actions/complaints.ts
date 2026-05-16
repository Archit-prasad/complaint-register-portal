'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { complaints, likes, comments, notifications } from '@/lib/db/schema'
import { verifySession } from '@/lib/dal'
import { eq, and } from 'drizzle-orm'
import type { FormState } from '@/types'

const ComplaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(2, 'Location is required'),
})

export async function createComplaint(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await verifySession()

  const validated = ComplaintSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    location: formData.get('location'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { title, description, location } = validated.data
  const imageFile = formData.get('image') as File | null

  let imageUrl: string | undefined
  if (imageFile && imageFile.size > 0) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(imageFile.type)) {
      return { errors: { image: ['Only JPEG, PNG, WebP, or GIF images are allowed'] } }
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return { errors: { image: ['Image must be under 5 MB'] } }
    }
    const ext = imageFile.name.split('.').pop() ?? 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(path.join(uploadsDir, filename), Buffer.from(await imageFile.arrayBuffer()))
    imageUrl = `/uploads/${filename}`
  }

  const [complaint] = await db
    .insert(complaints)
    .values({ userId: session.userId, title, description, location, imageUrl })
    .returning({ id: complaints.id })

  if (!complaint) return { message: 'Failed to submit complaint. Please try again.' }

  revalidatePath('/')
  redirect('/')
}

export async function toggleLike(complaintId: string) {
  const session = await verifySession()

  const [existing] = await db
    .select({ id: likes.id })
    .from(likes)
    .where(and(eq(likes.complaintId, complaintId), eq(likes.userId, session.userId)))

  if (existing) {
    await db.delete(likes).where(eq(likes.id, existing.id))
  } else {
    await db.insert(likes).values({ complaintId, userId: session.userId })

    const [complaint] = await db
      .select({ userId: complaints.userId })
      .from(complaints)
      .where(eq(complaints.id, complaintId))

    if (complaint && complaint.userId !== session.userId) {
      await db.insert(notifications).values({
        userId: complaint.userId,
        complaintId,
        type: 'like',
        message: 'Someone liked your complaint.',
      })
    }
  }

  revalidatePath('/')
  revalidatePath(`/complaint/${complaintId}`)
}

export async function addComment(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await verifySession()

  const complaintId = formData.get('complaintId') as string
  const content = (formData.get('content') as string)?.trim()

  if (!content || content.length < 2) {
    return { errors: { content: ['Comment must be at least 2 characters'] } }
  }
  if (content.length > 1000) {
    return { errors: { content: ['Comment must be under 1,000 characters'] } }
  }

  await db.insert(comments).values({ complaintId, userId: session.userId, content })

  const [complaint] = await db
    .select({ userId: complaints.userId })
    .from(complaints)
    .where(eq(complaints.id, complaintId))

  if (complaint && complaint.userId !== session.userId) {
    await db.insert(notifications).values({
      userId: complaint.userId,
      complaintId,
      type: 'comment',
      message: 'Someone commented on your complaint.',
    })
  }

  revalidatePath(`/complaint/${complaintId}`)
  return { success: true }
}

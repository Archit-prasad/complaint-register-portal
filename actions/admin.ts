'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { complaints, notifications } from '@/lib/db/schema'
import { verifyAdminSession } from '@/lib/dal'
import { eq } from 'drizzle-orm'
import type { FormState, ComplaintStatus } from '@/types'

const StatusSchema = z.enum(['pending', 'in_review', 'resolved'])

const statusLabels: Record<ComplaintStatus, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  resolved: 'Resolved',
}

export async function updateComplaintStatus(prevState: FormState, formData: FormData): Promise<FormState> {
  await verifyAdminSession()

  const complaintId = formData.get('complaintId') as string
  const parsed = StatusSchema.safeParse(formData.get('status'))
  if (!parsed.success) return { message: 'Invalid status value.' }

  const status = parsed.data

  const [updated] = await db
    .update(complaints)
    .set({ status, updatedAt: new Date() })
    .where(eq(complaints.id, complaintId))
    .returning({ id: complaints.id, userId: complaints.userId, title: complaints.title })

  if (!updated) return { message: 'Complaint not found.' }

  await db.insert(notifications).values({
    userId: updated.userId,
    complaintId: updated.id,
    type: 'status_change',
    message: `Your complaint "${updated.title}" status was updated to ${statusLabels[status]}.`,
  })

  revalidatePath('/admin')
  revalidatePath(`/admin/complaints/${complaintId}`)
  revalidatePath('/feed')
  revalidatePath(`/complaint/${complaintId}`)

  return { success: true }
}

export async function uploadResultImage(prevState: FormState, formData: FormData): Promise<FormState> {
  await verifyAdminSession()

  const complaintId = formData.get('complaintId') as string
  const imageFile = formData.get('resultImage') as File | null

  if (!imageFile || imageFile.size === 0) {
    return { errors: { resultImage: ['Please select an image to upload.'] } }
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(imageFile.type)) {
    return { errors: { resultImage: ['Only JPEG, PNG, WebP, or GIF images are allowed.'] } }
  }
  if (imageFile.size > 5 * 1024 * 1024) {
    return { errors: { resultImage: ['Image must be under 5 MB.'] } }
  }

  const ext = imageFile.name.split('.').pop() ?? 'jpg'
  const filename = `result-${randomUUID()}.${ext}`
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })
  await writeFile(path.join(uploadsDir, filename), Buffer.from(await imageFile.arrayBuffer()))

  await db
    .update(complaints)
    .set({ resultImageUrl: `/uploads/${filename}`, updatedAt: new Date() })
    .where(eq(complaints.id, complaintId))

  revalidatePath('/admin')
  revalidatePath(`/admin/complaints/${complaintId}`)
  revalidatePath('/feed')
  revalidatePath(`/complaint/${complaintId}`)

  return { success: true }
}

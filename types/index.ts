export type UserRole = 'user' | 'admin'
export type ComplaintStatus = 'pending' | 'in_review' | 'resolved'
export type NotificationType = 'status_change' | 'comment' | 'like'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string | null
  createdAt: Date
}

export type Complaint = {
  id: string
  userId: string
  title: string
  description: string
  location: string
  imageUrl: string | null
  resultImageUrl: string | null
  status: ComplaintStatus
  createdAt: Date
  updatedAt: Date
  user?: Pick<User, 'id' | 'name' | 'avatarUrl'>
  _count?: { likes: number; comments: number }
  liked?: boolean
}

export type Comment = {
  id: string
  complaintId: string
  userId: string
  content: string
  createdAt: Date
  user?: Pick<User, 'id' | 'name' | 'avatarUrl'>
}

export type Notification = {
  id: string
  userId: string
  complaintId: string | null
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: Date
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

export type FormState = {
  errors?: Record<string, string[]>
  message?: string
} | undefined

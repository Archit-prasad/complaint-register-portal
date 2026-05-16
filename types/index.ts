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

/** Shape returned by feed / detail queries */
export type FeedComplaint = {
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
  userName: string
  userAvatar: string | null
  likeCount: number
  commentCount: number
  liked: boolean
}

export type CommentWithUser = {
  id: string
  content: string
  createdAt: Date
  userId: string
  userName: string
  userAvatar: string | null
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

export type FormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
} | undefined

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

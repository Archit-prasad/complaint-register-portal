export type UserRole = 'user' | 'admin'
export type UserStatus = 'active' | 'banned'
export type ComplaintStatus = 'pending' | 'in_review' | 'resolved'
export type NotificationType = 'status_change' | 'comment' | 'like'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatarUrl: string | null
  createdAt: Date
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  complaintCount: number
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
  priorityLikes: number
  createdAt: Date
  updatedAt: Date
  userName: string
  userAvatar: string | null
  likeCount: number
  upvoteCount: number
  commentCount: number
  liked: boolean
  upvoted: boolean
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

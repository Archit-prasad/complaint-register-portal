import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])
export const userStatusEnum = pgEnum('user_status', ['active', 'banned'])
export const complaintStatusEnum = pgEnum('complaint_status', [
  'pending',
  'in_review',
  'resolved',
])
export const notificationTypeEnum = pgEnum('notification_type', [
  'status_change',
  'comment',
  'like',
])

export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),
  email:     text('email').notNull().unique(),
  password:  text('password').notNull(),
  role:      userRoleEnum('role').default('user').notNull(),
  status:    userStatusEnum('status').default('active').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const complaints = pgTable('complaints', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title:          text('title').notNull(),
  description:    text('description').notNull(),
  location:       text('location').notNull(),
  imageUrl:       text('image_url'),
  resultImageUrl: text('result_image_url'),
  status:         complaintStatusEnum('status').default('pending').notNull(),
  priorityLikes:  integer('priority_likes').default(0).notNull(),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().notNull(),
})

export const comments = pgTable('comments', {
  id:          uuid('id').primaryKey().defaultRandom(),
  complaintId: uuid('complaint_id').notNull().references(() => complaints.id, { onDelete: 'cascade' }),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content:     text('content').notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

export const likes = pgTable(
  'likes',
  {
    id:          uuid('id').primaryKey().defaultRandom(),
    complaintId: uuid('complaint_id').notNull().references(() => complaints.id, { onDelete: 'cascade' }),
    userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt:   timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqueLike: uniqueIndex('unique_like_idx').on(table.complaintId, table.userId),
  }),
)

export const notifications = pgTable('notifications', {
  id:          uuid('id').primaryKey().defaultRandom(),
  userId:      uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  complaintId: uuid('complaint_id').references(() => complaints.id, { onDelete: 'cascade' }),
  type:        notificationTypeEnum('type').notNull(),
  message:     text('message').notNull(),
  isRead:      boolean('is_read').default(false).notNull(),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

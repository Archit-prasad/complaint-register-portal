# ARCHITECTURE.md

> **Source of Truth — Civic Complaint Register Portal (v2)**
> Last updated: 2026-05-19 · Branch: `v2`

---

## Table of Contents

1. [System Tech Stack Overview](#1-system-tech-stack-overview)
2. [Project Directory & Component Structure](#2-project-directory--component-structure)
3. [End-to-End Data Lifecycle & Database Architecture](#3-end-to-end-data-lifecycle--database-architecture)
4. [Authentication, Middleware & Security Guardrails](#4-authentication-middleware--security-guardrails)
5. [Interactive Theme Engine & Design Framework](#5-interactive-theme-engine--design-framework)
6. [Core User Workflows](#6-core-user-workflows)

---

## 1. System Tech Stack Overview

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js (App Router) | 16.2.6 | SSR, routing, server actions, API routes |
| **UI Runtime** | React | 19.2.4 | Component model, concurrent features, `useTransition` |
| **Language** | TypeScript | ~5 | Static typing across all source files |
| **Database** | Neon (PostgreSQL, serverless) | — | Hosted Postgres with WebSocket-based serverless driver |
| **ORM** | Drizzle ORM | 0.45.2 | Type-safe schema, queries, and migrations |
| **DB Driver** | @neondatabase/serverless | 1.1.0 | Neon-native async PostgreSQL driver |
| **Auth** | Custom JWT (jose) | 6.2.3 | Signed HS256 sessions in secure httpOnly cookies |
| **Password Hashing** | bcryptjs | 3.0.3 | Salted bcrypt hashing for user passwords |
| **Styling** | Tailwind CSS v4 | ~4 | Utility-first CSS with `@theme inline` tokens |
| **Component Library** | shadcn/ui | 4.7.0 | Accessible, composable UI primitives |
| **Icons** | lucide-react | 1.16.0 | Consistent SVG icon set |
| **Charting** | Recharts | 3.8.0 | Pie/donut chart on admin dashboard |
| **Theme Switching** | next-themes | 0.4.6 | Client-side dark/light mode with `ThemeProvider` |
| **Toast Notifications** | Sonner | 2.0.7 | Rich toast UI (`top-right`, `richColors`) |
| **Validation** | Zod | 4.4.3 | Schema validation in server actions |
| **Animation** | CSS transitions + inline style stagger | — | Character-level heading animation, FadeIn utility |
| **Fonts** | Inter (next/font/google) | — | Loaded with `--font-inter` CSS variable |
| **File Uploads** | Node.js `fs/promises` | — | Writes to `/public/uploads/`, returns `/uploads/<uuid>.<ext>` |
| **Migration CLI** | drizzle-kit | 0.31.10 | `db:push`, `db:generate`, `db:migrate`, `db:studio` |

---

## 2. Project Directory & Component Structure

```
complaint-register-portal/
│
├── app/                           # Next.js App Router root
│   ├── globals.css                # Tailwind v4 base + civic design tokens + .liquid-glass
│   ├── layout.tsx                 # Root layout: Inter font, ThemeProvider, Toaster
│   ├── page.tsx                   # Landing page (/ route) — video background + motion hero
│   ├── favicon.ico
│   │
│   ├── (auth)/                    # Public auth routes (no layout wrapper)
│   │   ├── login/page.tsx         # /login — LoginForm, Intellect Studio attribution
│   │   └── register/page.tsx      # /register — RegisterForm, Intellect Studio attribution
│   │
│   ├── (user)/                    # Authenticated user routes
│   │   ├── layout.tsx             # Protects with verifySession(); renders Navbar
│   │   ├── page.tsx               # Redirects /  →  /feed
│   │   ├── feed/page.tsx          # /feed — milestones banner + ComplaintFeed
│   │   ├── complaint/
│   │   │   ├── create/page.tsx    # /complaint/create — CreateComplaintForm
│   │   │   └── [id]/page.tsx      # /complaint/:id — detail + LikeButton + CommentSection
│   │   ├── notifications/page.tsx # /notifications — notification list with mark-all-read
│   │   └── profile/page.tsx       # /profile — user's own complaints
│   │
│   ├── admin/                     # Admin-only routes
│   │   ├── layout.tsx             # Protects with verifyAdminSession(); AdminSidebar + main
│   │   ├── page.tsx               # /admin — tabbed: Overview | Users | Priority Queue
│   │   └── complaints/[id]/page.tsx  # /admin/complaints/:id — status + result image
│   │
│   └── api/
│       ├── me/route.ts            # GET /api/me — returns current user JSON (401 if unauth)
│       └── upload/route.ts        # POST /api/upload — validates + stores image, returns URL
│
├── actions/                       # React 19 Server Actions ('use server')
│   ├── auth.ts                    # login(), register(), logout()
│   ├── complaints.ts              # createComplaint(), toggleLike(), addComment()
│   ├── admin.ts                   # updateComplaintStatus(), banUser(), unbanUser(), uploadResultImage()
│   └── notifications.ts          # markNotificationRead(), markAllRead()
│
├── lib/
│   ├── db/
│   │   ├── index.ts              # Neon singleton db instance (drizzle + schema)
│   │   ├── schema.ts             # Drizzle table definitions (see §3)
│   │   ├── seed.ts               # Seeds admin user from env vars
│   │   └── migrations/           # Auto-generated SQL migration files
│   ├── session.ts                # createSession(), getSession(), deleteSession() — JWT/cookie
│   ├── dal.ts                    # verifySession(), verifyAdminSession(), getUser() — server-only
│   ├── queries.ts                # All read queries: getComplaints, getPriorityQueue, getAdminUsers…
│   └── utils.ts                  # cn() — clsx + tailwind-merge helper
│
├── components/
│   ├── theme-provider.tsx         # ThemeProvider wrapper (next-themes)
│   ├── theme-toggle.tsx           # Sun/Moon button — calls useTheme() to toggle
│   │
│   ├── landing/                   # Landing page–specific components
│   │   ├── video-background.tsx   # Client — theme-aware video src swap
│   │   ├── animated-heading.tsx   # Client — per-character stagger animation
│   │   ├── fade-in.tsx            # Client — generic delayed FadeIn wrapper
│   │   └── landing-navbar.tsx     # Client — liquid-glass navbar with ThemeToggle
│   │
│   ├── auth/
│   │   ├── login-form.tsx         # Controlled form with useFormState + login action
│   │   └── register-form.tsx      # Controlled form with live password requirements
│   │
│   ├── complaint/
│   │   ├── complaint-feed.tsx     # Maps FeedComplaint[] → ComplaintCard list
│   │   ├── complaint-card.tsx     # rounded-2xl card with hover lift, vibrant status badges
│   │   ├── complaint-image.tsx    # Client — image with category-inferred SVG fallback
│   │   ├── like-button.tsx        # Client — ArrowUp upvote, syncs priorityLikes in DB
│   │   ├── create-complaint-form.tsx
│   │   ├── comment-section.tsx
│   │   └── add-comment-form.tsx
│   │
│   ├── admin/
│   │   ├── complaints-table.tsx   # Tabular complaint list with status badges
│   │   ├── complaints-chart.tsx   # Recharts donut chart (pending/in_review/resolved)
│   │   ├── stats-card.tsx         # KPI card with icon + description
│   │   ├── status-update-form.tsx # Admin status selector form
│   │   ├── result-image-form.tsx  # Admin resolution image upload
│   │   ├── user-directory.tsx     # Client — User table with Ban/Unban (useTransition)
│   │   └── priority-queue.tsx     # Server — complaints ranked by priorityLikes desc
│   │
│   ├── layout/
│   │   ├── navbar.tsx             # User-facing top nav with notification bell
│   │   ├── user-menu.tsx          # Dropdown: profile, logout
│   │   ├── admin-sidebar.tsx      # Left sidebar nav for admin routes
│   │   └── admin-logout-button.tsx
│   │
│   └── ui/                        # shadcn/ui primitives
│       └── (button, input, label, card, badge, avatar, dialog, dropdown-menu,
│           select, separator, sheet, tabs, textarea, table, chart, skeleton, sonner)
│
├── hooks/
│   └── use-current-user.ts        # Client hook — fetches /api/me
│
├── types/
│   └── index.ts                   # Shared TypeScript types (User, FeedComplaint, AdminUser…)
│
├── public/
│   └── uploads/                   # User/admin uploaded images (UUID-named)
│
├── drizzle.config.ts              # dialect=postgresql, schema=./lib/db/schema.ts
├── next.config.ts                 # Server action body limit 6 MB, allowedDevOrigins
├── CLAUDE.md → AGENTS.md          # Codebase instructions for AI agents
└── .env.local                     # DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
```

---

## 3. End-to-End Data Lifecycle & Database Architecture

### 3.1 Drizzle Schema (lib/db/schema.ts)

#### `users`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default random | |
| `name` | `text` | NOT NULL | Display name |
| `email` | `text` | NOT NULL, UNIQUE | Login credential |
| `password` | `text` | NOT NULL | bcrypt hash (10 rounds) |
| `role` | `user_role` enum | NOT NULL, default `'user'` | `'user'` or `'admin'` |
| `status` | `user_status` enum | NOT NULL, default `'active'` | `'active'` or `'banned'` — checked at login |
| `avatarUrl` | `text` | nullable | Optional profile picture URL |
| `createdAt` | `timestamp` | NOT NULL, defaultNow | |

#### `complaints`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK, default random | |
| `userId` | `uuid` | NOT NULL, FK → users(id) CASCADE | Author |
| `title` | `text` | NOT NULL | Min 5 chars (validated in action) |
| `description` | `text` | NOT NULL | Min 20 chars |
| `location` | `text` | NOT NULL | Free-text address/landmark |
| `imageUrl` | `text` | nullable | `/uploads/<uuid>.<ext>` |
| `resultImageUrl` | `text` | nullable | Admin-uploaded resolution proof |
| `status` | `complaint_status` enum | NOT NULL, default `'pending'` | `pending` / `in_review` / `resolved` |
| `priorityLikes` | `integer` | NOT NULL, default `0` | Cached upvote count; drives admin priority queue order |
| `createdAt` | `timestamp` | NOT NULL, defaultNow | |
| `updatedAt` | `timestamp` | NOT NULL, defaultNow | Updated on status change or result image upload |

#### `likes`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `complaintId` | `uuid` | NOT NULL, FK → complaints(id) CASCADE | |
| `userId` | `uuid` | NOT NULL, FK → users(id) CASCADE | |
| `createdAt` | `timestamp` | NOT NULL, defaultNow | |
| — | — | UNIQUE INDEX on (`complaintId`, `userId`) | Prevents double-voting |

#### `comments`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `complaintId` | `uuid` | NOT NULL, FK → complaints(id) CASCADE | |
| `userId` | `uuid` | NOT NULL, FK → users(id) CASCADE | |
| `content` | `text` | NOT NULL | 2–1000 chars (validated in action) |
| `createdAt` | `timestamp` | NOT NULL, defaultNow | |

#### `notifications`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `userId` | `uuid` | NOT NULL, FK → users(id) CASCADE | Recipient |
| `complaintId` | `uuid` | nullable, FK → complaints(id) CASCADE | Source complaint |
| `type` | `notification_type` enum | NOT NULL | `status_change` / `comment` / `like` |
| `message` | `text` | NOT NULL | Human-readable text |
| `isRead` | `boolean` | NOT NULL, default `false` | |
| `createdAt` | `timestamp` | NOT NULL, defaultNow | |

---

### 3.2 Query Flows (lib/queries.ts)

All queries use `React.cache()` for request-level deduplication (one DB call per render pass per unique argument set).

**Creating a complaint (`createComplaint` action):**
1. `verifySession()` — asserts authenticated user
2. Zod validates title, description, location
3. If image file present: validate type/size → write to `/public/uploads/<uuid>.<ext>` via `fs/promises`
4. `db.insert(complaints).values(…)` with `userId`, fields, optional `imageUrl`
5. `revalidatePath('/feed')` — invalidates Next.js cache for feed

**Upvoting (`toggleLike` action):**
1. `verifySession()` — asserts authenticated user
2. Query `likes` table for existing row matching `(complaintId, userId)`
3. **If exists (unlike):** `db.delete(likes)` + SQL `GREATEST(priorityLikes - 1, 0)` update on complaint row
4. **If absent (like):** `db.insert(likes)` + SQL `priorityLikes + 1` update on complaint row; if not self-like, insert notification
5. `revalidatePath('/feed')` + `revalidatePath('/complaint/:id')`

**Admin priority queue (`getPriorityQueue` query):**
```sql
SELECT complaints.*, users.name, users.avatar_url,
       COUNT(DISTINCT likes.id) AS like_count,
       COUNT(DISTINCT comments.id) AS comment_count
FROM complaints
INNER JOIN users ON complaints.user_id = users.id
LEFT JOIN likes ON likes.complaint_id = complaints.id
LEFT JOIN comments ON comments.complaint_id = complaints.id
GROUP BY complaints.id, users.id
ORDER BY complaints.priority_likes DESC, complaints.created_at DESC
```
The `priority_likes` column is the sort key — it climbs as the community upvotes, guaranteeing the most urgent civic issues rise to the top of the moderation queue.

**Admin user directory (`getAdminUsers` query):**
```sql
SELECT users.*, COUNT(DISTINCT complaints.id) AS complaint_count
FROM users
LEFT JOIN complaints ON complaints.user_id = users.id
GROUP BY users.id
ORDER BY users.created_at DESC
```

---

## 4. Authentication, Middleware & Security Guardrails

### 4.1 Session Architecture

Sessions are **JWT-signed cookies**, not server-stored sessions:

```
lib/session.ts
  createSession(userId, role)
    → SignJWT({ userId, role, expiresAt: +7d }, HS256, SESSION_SECRET)
    → Set-Cookie: session=<token>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

  getSession()
    → Read cookie → jwtVerify(token, SESSION_SECRET) → { userId, role, expiresAt }

  deleteSession()
    → Set-Cookie: session=; Max-Age=0   (logout)
```

The `SESSION_SECRET` environment variable must be a high-entropy string (≥ 32 chars). It is used as the symmetric HMAC-SHA256 key.

### 4.2 Data Access Layer (lib/dal.ts)

Three memoized server-side guards — all marked `'server-only'` and wrapped in `React.cache()`:

| Guard | Behaviour | Used in |
|---|---|---|
| `verifySession()` | Reads cookie → redirects `/login` if missing/invalid | All `(user)` layouts + server actions |
| `verifyAdminSession()` | Reads cookie + checks `role === 'admin'` → redirects `/` | Admin layout, admin server actions |
| `getUser()` | Returns full user row or `null` | Navbar, profile page, feed page |

### 4.3 Banned User Enforcement

When a user with `status = 'banned'` attempts login:

```
actions/auth.ts → login()
  1. Find user by email
  2. bcrypt.compare(password, hash) — password verified
  3. if (user.status === 'banned')
       → return { message: 'Your account has been suspended for violating platform guidelines.' }
  4. (blocked — session never created)
```

The block happens **after** password verification to prevent email enumeration attacks (attackers cannot distinguish "banned" from "wrong password" if you reverse the order). However, the current implementation returns a distinct banned message, which is an intentional design decision to give clear UX feedback.

### 4.4 Admin Route Guard

```
app/admin/layout.tsx
  → await verifyAdminSession()   (throws redirect if not admin)
  → render AdminSidebar + {children}

app/admin/page.tsx
  (inherits protection from layout)
```

All admin server actions also independently call `await verifyAdminSession()`, providing defence-in-depth — a direct POST to an action endpoint without a valid admin session is rejected.

---

## 5. Interactive Theme Engine & Design Framework

### 5.1 ThemeProvider Architecture

```
app/layout.tsx
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    {children}
  </ThemeProvider>
```

- `attribute="class"` — next-themes toggles `class="dark"` on `<html>`
- `defaultTheme="dark"` — new visitors see dark mode first
- `enableSystem={false}` — OS preference ignored; user controls theme explicitly
- `suppressHydrationWarning` on `<html>` prevents React hydration mismatch from server-rendered dark class

### 5.2 ThemeToggle Component

```tsx
// components/theme-toggle.tsx
const { theme, setTheme } = useTheme()
// Renders Sun icon (dark mode) or Moon icon (light mode)
// Calls setTheme('light' | 'dark') on click
// Defers mount (mounted state) to prevent SSR hydration flash
```

### 5.3 Conditional Video Background (Landing Page)

```tsx
// components/landing/video-background.tsx
const { theme } = useTheme()
const src = mounted && theme === 'light' ? LIGHT_VIDEO : DARK_VIDEO

<video key={src} autoPlay muted loop playsInline className="absolute inset-0 object-cover z-0">
  <source src={src} type="video/mp4" />
</video>
```

- `key={src}` forces React to unmount/remount the `<video>` element when the URL changes, triggering autoplay on the new source
- **Dark mode URL:** CloudFront-hosted cinematic atmospheric video
- **Light mode URL:** Mixkit bright-sky clouds video
- No overlays or gradient overlays are applied — raw video fills the viewport

### 5.4 The `.liquid-glass` Design Utility (app/globals.css)

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.15);
  background-blend-mode: luminosity;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  /* Pseudo-element creates a 1.4px gradient border that fades in/out
     vertically — giving the glass panel a rim-lit edge highlight */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.4) 0%,   /* bright top rim */
    rgba(255,255,255,0.1) 20%,
    rgba(255,255,255,0)   40%,  /* transparent mid */
    rgba(255,255,255,0)   60%,
    rgba(255,255,255,0.1) 80%,
    rgba(255,255,255,0.4) 100%  /* bright bottom rim */
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;    /* shows only the border padding strip */
  mask-composite: exclude;
  pointer-events: none;
}
```

**How it works:** The `padding: 1.4px` + mask XOR technique renders only the 1.4 px "padding ring" of the element, making it appear as a glowing, rim-lit border without any extra DOM elements affecting layout.

### 5.5 Typography

- **Font:** Inter loaded via `next/font/google` → CSS variable `--font-inter`
- Applied at `<html>` level via `className={inter.variable}`
- Global Tailwind token: `--font-sans: var(--font-inter)` in `@theme inline`
- **Anti-aliasing:** `style={{ WebkitFontSmoothing: 'antialiased' }}` on `<body>`

### 5.6 Design Tokens (Civic Design System)

Colors follow the OKLCh colour space for perceptual uniformity:

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--primary` | Deep Blue `#1E3A8A` | Lighter blue | Buttons, links, active states |
| `--secondary` | Emerald `#10B981` | Same | Resolved status, success |
| `--accent` | Amber `#F59E0B` | Same | Pending status, warnings |
| `--destructive` | Red | Red | Banned, errors |
| `--background` | Soft grey-white | Near-black | Page backgrounds |
| `--card` | White | Dark grey | Card surfaces |

---

## 6. Core User Workflows

### 6.1 Citizen: Register & Authenticate

```
/ (landing page)
  ↓ User clicks "Register"
/register
  → RegisterForm collects name + email + password
  → register() action:
      1. Zod validates fields
      2. Checks for duplicate email (returns error if exists)
      3. bcrypt.hash(password, 10)
      4. db.insert(users) → returns { id, role }
      5. createSession(id, 'user') → httpOnly JWT cookie
      6. redirect('/feed')

/login (or embedded on landing)
  → LoginForm
  → login() action:
      1. Find user by email
      2. bcrypt.compare(password, hash)
      3. Check user.status !== 'banned' (else: suspend message)
      4. createSession(id, role)
      5. redirect('/admin' if admin, else '/feed')
```

### 6.2 Citizen: File a Complaint

```
/feed → "Report Issue" button
  ↓
/complaint/create
  → CreateComplaintForm (title, description, location, optional image)
  → createComplaint() action:
      1. verifySession() — must be logged in
      2. Zod validates title (≥5), description (≥20), location (≥2)
      3. If image: validate type (jpeg/png/webp/gif) + size (≤5MB)
         → write to /public/uploads/<uuid>.<ext>
      4. db.insert(complaints) → stores all fields
      5. revalidatePath('/feed') → clears Next.js cache
      6. redirect('/feed')
```

### 6.3 Citizen: Upvote a Complaint

```
/feed or /complaint/:id
  → Click ArrowUp upvote button (LikeButton component)
  → Optimistic update: count +1, icon fills
  → toggleLike(complaintId) action (useTransition):
      1. verifySession()
      2. Query likes table for (complaintId, userId)
      3a. If existing (unlike):
            db.delete(likes)
            UPDATE complaints SET priority_likes = GREATEST(priority_likes - 1, 0)
      3b. If new (like):
            db.insert(likes)
            UPDATE complaints SET priority_likes = priority_likes + 1
            If not self-like: db.insert(notifications, type='like')
      4. revalidatePath('/feed') + revalidatePath('/complaint/:id')

Effect: priority_likes on the complaint row increases/decreases, immediately
shifting its position in the admin priority queue at next render.
```

### 6.4 Citizen: Track Complaints & Notifications

```
/feed
  → All complaints sorted by createdAt DESC, each card shows status badge

/complaint/:id
  → Full detail view: image, description, status, like count, comments
  → LikeButton + AddCommentForm

/notifications
  → 50 most-recent notifications (status_change / comment / like)
  → "Mark all read" bulk action
  → Each notification links back to the relevant complaint
```

### 6.5 Admin Supervisor: Manage Complaints

```
Login as admin → createSession with role='admin' → redirect('/admin')

/admin (tabbed dashboard)
  Tab 1 — Overview:
    → StatsCard grid: total, pending, in_review, resolved
    → Recharts donut breakdown by status
    → Resolution rate progress bars
    → Full complaints table

  Tab 2 — Users:
    → UserDirectory table: Name, Email, Role, Status, Complaint Count
    → Ban User button (status 'active') → calls banUser(userId) server action
        → db.update(users).set({ status: 'banned' })
        → revalidatePath('/admin')
    → Unban User button (status 'banned') → calls unbanUser(userId)
    → Admin accounts show "Protected" — cannot be banned via UI

  Tab 3 — Priority Queue:
    → All complaints ordered by priority_likes DESC
    → Each entry shows rank #, upvote count, title, status badge, author, location
    → Highest-priority civic issues surface at top for immediate action

/admin/complaints/:id
  → Left: complaint image, description, result image (if uploaded)
  → Right: StatusUpdateForm — changes status → triggers notification to citizen
           ResultImageForm — admin uploads resolution proof photo
```

### 6.6 Admin Supervisor: Enforce Platform Safety

```
Ban flow:
  /admin → Users tab → "Ban User" (UserRow component)
    → handleBan() → startTransition(async () => await banUser(userId))
    → Server action: verifyAdminSession() → db.update(users).set({ status: 'banned' })
    → revalidatePath('/admin') → UI refreshes with "Banned" badge in red

Effect on banned user:
  Next login attempt → login() action → if (user.status === 'banned')
    → return message: "Your account has been suspended for violating platform guidelines."
  Existing sessions: remain valid until expiry (7 days). For immediate revocation,
  implement server-side session store (current implementation is stateless JWT).

Unban flow:
  /admin → Users tab → "Unban User"
    → unbanUser(userId) → db.update(users).set({ status: 'active' })
```

---

*This document covers the complete v2 implementation of the Civic Complaint Register Portal. Any future developer should be able to understand, extend, or debug any part of the system from this reference alone.*

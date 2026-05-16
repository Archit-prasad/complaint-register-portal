import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

async function seed() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@civicportal.gov'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@12345'
  const adminName = 'Portal Administrator'

  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.email, adminEmail))

  if (existing) {
    console.log(`Admin already exists: ${adminEmail}`)
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await db.insert(schema.users).values({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
  })

  console.log(`✓ Admin created: ${adminEmail}`)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => { console.error(err); process.exit(1) })

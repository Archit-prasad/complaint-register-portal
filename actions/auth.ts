'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { createSession, deleteSession } from '@/lib/session'
import { eq } from 'drizzle-orm'
import type { FormState } from '@/types'

const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Must contain at least one letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
})

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { email, password } = validated.data

  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { message: 'Invalid email or password. Please try again.' }
  }

  await createSession(user.id, user.role)
  redirect(user.role === 'admin' ? '/admin' : '/feed')
}

export async function register(prevState: FormState, formData: FormData): Promise<FormState> {
  const validated = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { name, email, password } = validated.data

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))

  if (existing) {
    return { errors: { email: ['This email address is already registered.'] } }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const [newUser] = await db
    .insert(users)
    .values({ name, email, password: hashedPassword, role: 'user' })
    .returning({ id: users.id, role: users.role })

  if (!newUser) {
    return { message: 'Failed to create your account. Please try again.' }
  }

  await createSession(newUser.id, newUser.role)
  redirect('/feed')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Sign in — CivicReport' }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">CivicReport</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to report and track public issues
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in you agree to our{' '}
          <span className="underline underline-offset-2 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </main>
  )
}

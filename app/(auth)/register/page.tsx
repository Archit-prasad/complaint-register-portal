import Link from 'next/link'
import { Building2 } from 'lucide-react'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata = { title: 'Create account — CivicReport' }

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
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
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Join CivicReport to help improve your community
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account you agree to our{' '}
          <span className="underline underline-offset-2 cursor-pointer">Terms of Service</span>
          {' '}and{' '}
          <span className="underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
        </p>
      </div>

      {/* Intellect Studio attribution */}
      <div className="fixed bottom-4 left-4 text-xs text-muted-foreground/60 select-none">
        Intellect Studio
      </div>
    </main>
  )
}

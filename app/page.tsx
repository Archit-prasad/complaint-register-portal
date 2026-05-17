import Link from 'next/link'
import { Building2, TrendingUp, ShieldCheck, Users, MessageSquare } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-foreground">CivicReport</span>
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Create account
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Split hero */}
        <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

            {/* Left — marketing */}
            <div>
              <span className="inline-block rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Community-driven civic reporting
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Report issues.<br />
                <span className="text-primary">Drive change.</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                CivicReport lets residents file, track, and upvote public complaints so local authorities can prioritise what matters most.
              </p>

              <ul className="mt-10 space-y-4">
                {[
                  {
                    icon: <MessageSquare className="h-4 w-4" />,
                    text: 'File detailed reports with location and photos in minutes',
                  },
                  {
                    icon: <TrendingUp className="h-4 w-4" />,
                    text: 'Community voting surfaces the most impactful issues',
                  },
                  {
                    icon: <ShieldCheck className="h-4 w-4" />,
                    text: 'Authorities get a live dashboard to triage and resolve',
                  },
                  {
                    icon: <Users className="h-4 w-4" />,
                    text: 'Real-time notifications keep you in the loop',
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {item.icon}
                    </span>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — live login form */}
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground">Sign in to CivicReport</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  No account?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Create one for free
                  </Link>
                </p>
              </div>
              <LoginForm />
            </div>

          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground">
              <Building2 className="h-3 w-3" />
            </div>
            <span className="font-medium text-foreground">CivicReport</span>
          </div>
          <p>© {new Date().getFullYear()} CivicReport. All rights reserved.</p>
          <Link href="/register" className="hover:text-foreground transition-colors">
            Register
          </Link>
        </div>
      </footer>
    </div>
  )
}

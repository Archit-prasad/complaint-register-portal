'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { register } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'At least one letter',   test: (p: string) => /[a-zA-Z]/.test(p) },
  { label: 'At least one number',   test: (p: string) => /[0-9]/.test(p) },
]

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, undefined)
  const [password, setPassword] = useState('')

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          className="h-11"
          required
        />
        {state?.errors?.name && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11"
          required
        />
        {state?.errors?.email && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="h-11"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ul className="mt-2 space-y-1">
          {passwordRules.map((rule) => {
            const met = password.length > 0 && rule.test(password)
            return (
              <li
                key={rule.label}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                    met ? 'text-green-600 dark:text-green-400' : ''
                  }`}
                />
                {rule.label}
              </li>
            )
          })}
        </ul>
        {state?.errors?.password && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {pending ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </form>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

// In Next.js 16, Proxy replaces Middleware. Named "proxy" export is the standard.
const AUTH_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/admin']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  const isLanding = pathname === '/'

  const token = req.cookies.get('session')?.value
  const session = await decrypt(token)

  // Unauthenticated: allow landing + auth pages, block everything else
  if (!session?.userId) {
    if (isLanding || isAuthRoute) return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Authenticated: bounce off landing and auth pages toward the app
  if (isLanding || isAuthRoute) {
    const dest = session.role === 'admin' ? '/admin' : '/feed'
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  // Non-admin trying to reach /admin
  if (isAdminRoute && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/feed', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|uploads|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.ico$).*)'],
}

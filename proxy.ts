import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const publicRoutes = ['/login', '/register']
const adminRoutes = ['/admin']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r))
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))

  const token = req.cookies.get('session')?.value
  const session = await decrypt(token)

  if (!session?.userId) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    return NextResponse.next()
  }

  // Admin-only guard
  if (isAdminRoute && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  // Redirect authenticated users away from auth pages
  if (isPublicRoute) {
    const dest = session.role === 'admin' ? '/admin' : '/'
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|uploads|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.ico$).*)'],
}

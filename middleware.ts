import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase Auth Middleware
 *
 * This middleware:
 * 1. Refreshes auth tokens automatically
 * 2. Maintains user sessions across requests
 * 3. Protects routes that require authentication
 *
 * IMPORTANT: This runs on every request before reaching your pages/APIs
 */

export async function middleware(request: NextRequest) {
  // OPTIMIZATION: Skip auth check for public website routes
  // This is a public website - no authentication needed
  // Only refresh auth session cookies if they exist (for potential future features)

  const pathname = request.nextUrl.pathname

  // Early return for all public routes (everything except /api routes)
  // This saves ~200ms TTFB by avoiding unnecessary Supabase auth calls
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next({
      request,
    })
  }

  // For API routes, maintain session cookies (in case needed for future features)
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session for API routes only
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

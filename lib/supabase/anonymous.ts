import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for anonymous operations
 * This client does not use cookies and is suitable for public API routes
 * where we want truly anonymous access (no session cookies)
 * 
 * Use this for:
 * - Public form submissions (waitlist, contact)
 * - Public API endpoints that don't require authentication
 * 
 * This client respects RLS policies and uses the anon key
 */
export function createAnonymousClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.'
    )
  }

  // createBrowserClient without cookies = truly anonymous
  // This is different from createServerClient which uses cookies
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}


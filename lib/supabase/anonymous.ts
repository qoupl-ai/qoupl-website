import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for anonymous operations
 * This client does not use cookies and is suitable for public API routes
 * where we want truly anonymous access (no session cookies)
 *
 * Use this for:
 * - Public form submissions (waitlist, contact)
 * - Public API endpoints that don't require authentication
 *
 * This client respects RLS policies and uses the anon key.
 * Uses the core supabase-js client instead of @supabase/ssr
 * because this is for server-side API routes, not browser environments.
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

  // Use core supabase-js client for server-side anonymous operations
  // No session persistence needed for anonymous operations
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // No session for anonymous operations
      autoRefreshToken: false,
    },
  })
}


import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client with service role key
 *
 * CRITICAL SECURITY NOTES:
 * - This client BYPASSES Row Level Security (RLS)
 * - NEVER expose this client to the browser/client-side
 * - NEVER use in server actions or API routes that handle user requests
 * - Service role key has full database access
 *
 * APPROVED USE CASES (Scripts Only):
 * - Migration scripts (scripts/*.ts)
 * - Setup scripts (scripts/*.ts)
 * - One-time data operations (scripts/*.ts)
 * - Storage bucket management (scripts/*.ts)
 *
 * FORBIDDEN USE CASES:
 * - Server actions (use regular client + assertAdmin())
 * - API routes (use regular client + assertAdmin())
 * - Page components (use regular client + assertAdmin())
 *
 * For all user-facing operations, use:
 *   1. assertAdmin() from @/lib/auth/assert-admin
 *   2. createClient() from @/lib/supabase/server
 *   3. Let RLS policies enforce access control
 */

if (!process.env['NEXT_PUBLIC_SUPABASE_URL']) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env['SUPABASE_SERVICE_ROLE_KEY']) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const adminClient = createClient(
  process.env['NEXT_PUBLIC_SUPABASE_URL'],
  process.env['SUPABASE_SERVICE_ROLE_KEY'],
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  }
)

/**
 * @deprecated Use assertAdmin() from @/lib/auth/assert-admin instead
 * 
 * This function is kept for backward compatibility with scripts only.
 * For server actions, API routes, and page components, use assertAdmin().
 * 
 * Scripts may use this when they need to verify admin status without
 * throwing errors (e.g., for conditional logic in migration scripts).
 */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  const { data, error } = await adminClient
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('Admin verification failed:', error)
    return false
  }

  return true
}

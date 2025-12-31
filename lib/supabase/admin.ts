/**
 * Admin Supabase Client
 * 
 * This client uses the service role key to bypass RLS policies.
 * Only use this for:
 * - Server-side scripts
 * - Admin operations
 * 
 * NEVER expose this client to the browser or client-side code.
 */

import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing env.SUPABASE_SERVICE_ROLE_KEY - This is required for admin operations. ' +
    'Note: The website repo typically doesn\'t need this. This is mainly for scripts.'
  )
}

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)


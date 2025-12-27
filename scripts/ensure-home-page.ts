/**
 * Ensure Home Page Exists
 * 
 * Creates the 'home' page if it doesn't exist.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  console.log('🔍 Checking for home page...\n')

  // Check if home page exists
  const { data: existingPage } = await adminClient
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .single()

  if (existingPage) {
    console.log('✅ Home page already exists')
    return
  }

  // Create home page
  const { data: newPage, error } = await adminClient
    .from('pages')
    .insert({
      slug: 'home',
      title: 'Home',
      description: 'Main landing page',
      published: true,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Failed to create home page:', error.message)
    process.exit(1)
  }

  console.log('✅ Created home page:', newPage.id)
}

main().catch(console.error)

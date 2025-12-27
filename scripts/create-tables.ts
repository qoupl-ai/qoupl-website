/**
 * Create Database Tables Script
 * Executes the SQL schema migration in your Supabase project
 *
 * Usage:
 *   1. Add your Supabase credentials to .env.local
 *   2. Run: npm run create:tables
 */

import { adminClient } from '../lib/supabase/admin'
import * as fs from 'fs'
import * as path from 'path'

async function createTables() {
  console.log('🏗️  Creating database tables in Supabase...\n')

  try {
    // Read the SQL migration file
    const sqlPath = path.join(
      __dirname,
      '../supabase/migrations/001_initial_schema.sql'
    )
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    console.log('📄 Found migration file: 001_initial_schema.sql')
    console.log(`📏 SQL file size: ${(sql.length / 1024).toFixed(2)} KB\n`)

    // Note: Supabase JS client doesn't support raw SQL execution
    // We need to use the REST API or run this via Supabase CLI/Dashboard

    console.log('⚠️  IMPORTANT INSTRUCTIONS:\n')
    console.log('The Supabase JS client cannot execute raw SQL migrations.')
    console.log('Please follow one of these methods:\n')

    console.log('METHOD 1: Supabase Dashboard (Recommended)')
    console.log('1. Go to https://app.supabase.com')
    console.log('2. Select your project')
    console.log('3. Click "SQL Editor" in the left sidebar')
    console.log('4. Click "New Query"')
    console.log('5. Copy the contents of: supabase/migrations/001_initial_schema.sql')
    console.log('6. Paste into the SQL editor')
    console.log('7. Click "Run" (or press Cmd/Ctrl + Enter)')
    console.log('8. Wait for execution to complete\n')

    console.log('METHOD 2: Supabase CLI')
    console.log('1. Install: npm install -g supabase')
    console.log('2. Login: supabase login')
    console.log('3. Link project: supabase link --project-ref YOUR_PROJECT_REF')
    console.log('4. Push migration: supabase db push\n')

    console.log('METHOD 3: PostgreSQL Client (Advanced)')
    console.log('1. Get connection string from Supabase Dashboard')
    console.log('2. Use psql or any PostgreSQL client')
    console.log('3. Execute: \\i supabase/migrations/001_initial_schema.sql\n')

    console.log('✅ After running the migration, verify in Table Editor that you see:')
    console.log('   - admin_users')
    console.log('   - pages (with 12 rows)')
    console.log('   - sections')
    console.log('   - global_content (with 3 rows)')
    console.log('   - blog_categories (with 5 rows)')
    console.log('   - blog_posts')
    console.log('   - faq_categories (with 8 rows)')
    console.log('   - faqs')
    console.log('   - feature_categories (with 4 rows)')
    console.log('   - features')
    console.log('   - pricing_plans')
    console.log('   - media')
    console.log('   - waitlist_signups')
    console.log('   - contact_submissions')
    console.log('   - content_history\n')

    // Test connection
    console.log('🔍 Testing Supabase connection...')
    const { data, error } = await adminClient.from('pages').select('count')

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('⚠️  Tables not found - please run the migration first!')
      } else {
        console.error('❌ Connection error:', error.message)
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('✅ Tables already exist - migration likely completed!')
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
  }
}

createTables()

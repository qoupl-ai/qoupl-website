/**
 * List Admin Users
 * Shows all users in the admin_users table
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function listAdmins() {
  console.log('📋 Current admin users:\n')

  const { data, error } = await adminClient
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.log('⚠️  No admin users found in the database.')
    console.log('\n📝 To add yourself as an admin:')
    console.log('1. Sign up at http://localhost:3000/login first')
    console.log('2. Then run: npm run add-admin your@email.com')
    return
  }

  console.log(`Found ${data.length} admin user(s):\n`)

  data.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.email}`)
    console.log(`   Name: ${admin.name}`)
    console.log(`   Active: ${admin.is_active ? '✅ YES' : '❌ NO'}`)
    console.log(`   User ID: ${admin.user_id}`)
    console.log(`   Created: ${new Date(admin.created_at).toLocaleString()}`)
    console.log('')
  })
}

listAdmins()

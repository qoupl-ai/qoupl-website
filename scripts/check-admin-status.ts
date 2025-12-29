/**
 * Check Admin Status
 * Verifies if a user is properly registered as an admin
 *
 * Usage:
 *   npx ts-node --project tsconfig.node.json scripts/check-admin-status.ts <email>
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function checkAdminStatus() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('\nUsage:')
    console.log('  npx ts-node --project tsconfig.node.json scripts/check-admin-status.ts your@email.com')
    process.exit(1)
  }

  console.log(`🔍 Checking admin status for: ${email}\n`)

  try {
    // Get user from auth.users
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()

    if (listError) {
      console.error('❌ Error listing users:', listError.message)
      process.exit(1)
    }

    const user = users?.find(u => u.email === email)

    if (!user) {
      console.error(`❌ No user found with email: ${email}`)
      console.log('\n💡 The user needs to sign up at /login first.')
      process.exit(1)
    }

    console.log(`✅ Found user in auth.users:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   User ID: ${user.id}`)
    console.log(`   Created: ${new Date(user.created_at).toLocaleString()}\n`)

    // Check admin_users table
    const { data: adminUser, error: adminError } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (adminError) {
      console.error(`❌ User is NOT in admin_users table`)
      console.log(`   Error: ${adminError.message}`)
      console.log('\n💡 Run: npm run add-admin ' + email)
      process.exit(1)
    }

    if (!adminUser) {
      console.error(`❌ User is NOT registered as an admin`)
      console.log('\n💡 Run: npm run add-admin ' + email)
      process.exit(1)
    }

    console.log(`✅ Found user in admin_users table:`)
    console.log(`   Name: ${adminUser.name}`)
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Active: ${adminUser.is_active ? '✅ YES' : '❌ NO'}`)
    console.log(`   Added: ${new Date(adminUser.created_at).toLocaleString()}\n`)

    if (!adminUser.is_active) {
      console.log('⚠️  User is INACTIVE. They cannot access the CMS.')
      console.log('   To activate, run the add-admin script again.')
    } else {
      console.log('🎉 User is properly configured as an active admin!')
      console.log('   They can access the CMS at /add-content')
    }

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

checkAdminStatus()

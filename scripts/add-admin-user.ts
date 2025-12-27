/**
 * Add Admin User Script
 * Adds a user to the admin_users table
 *
 * Usage:
 *   npx ts-node --project tsconfig.node.json scripts/add-admin-user.ts <email>
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function addAdminUser() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('\nUsage:')
    console.log('  npx ts-node --project tsconfig.node.json scripts/add-admin-user.ts your@email.com')
    process.exit(1)
  }

  console.log(`🔍 Looking for user with email: ${email}\n`)

  try {
    // Get user by email from auth.users
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()

    if (listError) {
      console.error('❌ Error listing users:', listError.message)
      process.exit(1)
    }

    const user = users?.find(u => u.email === email)

    if (!user) {
      console.error(`❌ No user found with email: ${email}`)
      console.log('\n💡 The user must first sign up at /login before you can make them an admin.')
      process.exit(1)
    }

    console.log(`✅ Found user: ${user.email}`)
    console.log(`   User ID: ${user.id}\n`)

    // Check if already an admin
    const { data: existingAdmin } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existingAdmin) {
      console.log('⚠️  User is already an admin!')
      console.log(`   Status: ${existingAdmin.is_active ? 'Active' : 'Inactive'}`)

      if (!existingAdmin.is_active) {
        const { error: updateError } = await adminClient
          .from('admin_users')
          .update({ is_active: true })
          .eq('user_id', user.id)

        if (updateError) {
          console.error('❌ Error activating admin:', updateError.message)
        } else {
          console.log('✅ Admin user activated!')
        }
      }
      return
    }

    // Add to admin_users table
    const { error: insertError } = await adminClient
      .from('admin_users')
      .insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
        is_active: true
      })

    if (insertError) {
      console.error('❌ Error adding admin user:', insertError.message)
      process.exit(1)
    }

    console.log('✅ Admin user added successfully!')
    console.log(`\n🎉 ${user.email} can now access the CMS at /add-content`)
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

addAdminUser()

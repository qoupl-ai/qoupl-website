/**
 * Fix Admin User ID
 * Updates admin_users records that have null user_id with the correct ID from auth.users
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function fixAdminUserId() {
  console.log('🔧 Fixing admin user IDs...\n')

  // Get all admin users with null user_id
  const { data: admins, error: adminError } = await adminClient
    .from('admin_users')
    .select('*')
    .is('user_id', null)

  if (adminError) {
    console.error('❌ Error fetching admin users:', adminError.message)
    process.exit(1)
  }

  if (!admins || admins.length === 0) {
    console.log('✅ No admin users need fixing!')
    return
  }

  console.log(`Found ${admins.length} admin user(s) with null user_id\n`)

  // Get all auth users
  const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()

  if (listError) {
    console.error('❌ Error listing auth users:', listError.message)
    process.exit(1)
  }

  // Fix each admin
  for (const admin of admins) {
    console.log(`Processing: ${admin.email}`)

    const authUser = users?.find(u => u.email === admin.email)

    if (!authUser) {
      console.log(`  ⚠️  No auth user found with email: ${admin.email}`)
      console.log(`      This user needs to sign up at /login first\n`)
      continue
    }

    console.log(`  Found auth user ID: ${authUser.id}`)

    const { error: updateError } = await adminClient
      .from('admin_users')
      .update({ user_id: authUser.id })
      .eq('id', admin.id)

    if (updateError) {
      console.error(`  ❌ Error updating: ${updateError.message}\n`)
    } else {
      console.log(`  ✅ Updated successfully!\n`)
    }
  }

  console.log('🎉 Done!')
}

fixAdminUserId()

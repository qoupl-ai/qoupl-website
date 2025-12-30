/**
 * Script to create the love-story bucket in Supabase Storage
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables first
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

async function createBucket() {
  console.log('📦 Creating love-story bucket...\n')

  try {
    // Check if bucket already exists
    const { data: existingBuckets } = await adminClient.storage.listBuckets()
    const bucketExists = existingBuckets?.some((b) => b.name === 'love-story')

    if (bucketExists) {
      console.log('✅ Bucket "love-story" already exists\n')
      return
    }

    // Create new bucket
    const { error: createError } = await adminClient.storage.createBucket(
      'love-story',
      {
        public: true,
        fileSizeLimit: 20 * 1024 * 1024, // 20MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      }
    )

    if (createError) {
      console.error('❌ Error creating bucket:', createError.message)
      process.exit(1)
    }

    console.log('✅ Created bucket "love-story" (public)\n')
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

createBucket()
  .then(() => {
    console.log('✨ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })


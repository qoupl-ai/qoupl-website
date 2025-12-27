/**
 * Supabase Storage Setup Script
 * Creates storage buckets programmatically
 *
 * Usage:
 *   npx ts-node scripts/setup-storage.ts
 * OR
 *   npm run setup:storage
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

const buckets = [
  {
    name: 'hero-images',
    public: true,
    fileSizeLimit: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'couple-photos',
    public: true,
    fileSizeLimit: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'app-screenshots',
    public: true,
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png'],
  },
  {
    name: 'blog-images',
    public: true,
    fileSizeLimit: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  {
    name: 'user-uploads',
    public: false,
    fileSizeLimit: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
]

async function setupStorage() {
  console.log('🚀 Starting Supabase Storage setup...\n')

  for (const bucket of buckets) {
    console.log(`📦 Creating bucket: ${bucket.name}`)

    try {
      // Check if bucket already exists
      const { data: existingBuckets } = await adminClient.storage.listBuckets()
      const bucketExists = existingBuckets?.some((b) => b.name === bucket.name)

      if (bucketExists) {
        console.log(`   ✅ Bucket "${bucket.name}" already exists`)

        // Update bucket configuration
        const { error: updateError } = await adminClient.storage.updateBucket(
          bucket.name,
          {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes,
          }
        )

        if (updateError) {
          console.error(
            `   ❌ Error updating bucket "${bucket.name}":`,
            updateError
          )
        } else {
          console.log(`   ✅ Updated bucket configuration`)
        }
      } else {
        // Create new bucket
        const { error: createError } = await adminClient.storage.createBucket(
          bucket.name,
          {
            public: bucket.public,
            fileSizeLimit: bucket.fileSizeLimit,
            allowedMimeTypes: bucket.allowedMimeTypes,
          }
        )

        if (createError) {
          console.error(
            `   ❌ Error creating bucket "${bucket.name}":`,
            createError
          )
        } else {
          console.log(
            `   ✅ Created bucket "${bucket.name}" (${bucket.public ? 'public' : 'private'})`
          )
        }
      }
    } catch (error) {
      console.error(`   ❌ Unexpected error with bucket "${bucket.name}":`, error)
    }

    console.log('') // Empty line for readability
  }

  console.log('✨ Storage setup complete!\n')

  // List all buckets
  console.log('📋 Current buckets:')
  const { data: allBuckets } = await adminClient.storage.listBuckets()
  allBuckets?.forEach((b) => {
    console.log(`   - ${b.name} (${b.public ? 'public' : 'private'})`)
  })
}

setupStorage().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

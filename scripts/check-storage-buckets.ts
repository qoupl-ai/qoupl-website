/**
 * Check Storage Bucket Configuration
 * Verifies that all buckets exist and are publicly accessible
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function checkBuckets() {
  console.log('🔍 Checking Supabase Storage buckets...\n')

  const buckets = ['hero-images', 'couple-photos', 'app-screenshots', 'blog-images', 'user-uploads']

  for (const bucketName of buckets) {
    console.log(`\n📦 Checking bucket: ${bucketName}`)

    // Check if bucket exists
    const { data: bucket, error: bucketError } = await adminClient
      .storage
      .getBucket(bucketName)

    if (bucketError || !bucket) {
      console.log(`  ❌ Bucket does not exist: ${bucketError?.message}`)
      continue
    }

    console.log(`  ✅ Bucket exists`)
    console.log(`  📊 Public: ${bucket.public}`)
    console.log(`  📏 File size limit: ${bucket.file_size_limit ? (bucket.file_size_limit / (1024 * 1024)).toFixed(0) : 'unlimited'} MB`)

    // List files in bucket
    const { data: files, error: listError } = await adminClient
      .storage
      .from(bucketName)
      .list('', { limit: 10 })

    if (listError) {
      console.log(`  ❌ Error listing files: ${listError.message}`)
    } else {
      console.log(`  📁 Files in root: ${files?.length || 0}`)
      if (files && files.length > 0) {
        files.forEach(file => {
          console.log(`     - ${file.name}`)
        })
      }
    }

    // For hero-images, also check subfolders
    if (bucketName === 'hero-images') {
      const { data: womenFiles } = await adminClient
        .storage
        .from(bucketName)
        .list('women', { limit: 5 })

      const { data: menFiles } = await adminClient
        .storage
        .from(bucketName)
        .list('men', { limit: 5 })

      console.log(`  📁 Files in women/: ${womenFiles?.length || 0}`)
      console.log(`  📁 Files in men/: ${menFiles?.length || 0}`)
    }
  }

  console.log('\n\n🔗 Test URLs (open in browser):')
  console.log(`${process.env['NEXT_PUBLIC_SUPABASE_URL']}/storage/v1/object/public/couple-photos/qoupl_couple_01.jpg`)
  console.log(`${process.env['NEXT_PUBLIC_SUPABASE_URL']}/storage/v1/object/public/hero-images/women/qoupl_women_01.png`)
  console.log(`${process.env['NEXT_PUBLIC_SUPABASE_URL']}/storage/v1/object/public/app-screenshots/qoupl_screenshot_01.png`)
}

checkBuckets()
  .then(() => {
    console.log('\n✅ Bucket check complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  })

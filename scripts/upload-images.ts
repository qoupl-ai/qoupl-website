/**
 * Upload Images to Supabase Storage
 * Uploads all renamed images from /public to Supabase Storage buckets
 *
 * Prerequisites:
 *   1. Supabase credentials in .env.local
 *   2. Storage buckets created (run: npm run setup:storage)
 *
 * Usage:
 *   npm run upload:images
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

interface UploadTask {
  localPath: string
  bucket: string
  storagePath: string
  category: string
}

async function uploadImages() {
  console.log('📤 Starting image upload to Supabase Storage...\n')

  // Define all images to upload
  const uploadTasks: UploadTask[] = []

  // Women profile images (10)
  for (let i = 1; i <= 10; i++) {
    const num = i.toString().padStart(2, '0')
    const ext = i <= 8 ? 'png' : 'jpg'
    uploadTasks.push({
      localPath: `public/images/women/qoupl_women_${num}.${ext}`,
      bucket: 'hero-images',
      storagePath: `women/qoupl_women_${num}.${ext}`,
      category: 'hero',
    })
  }

  // Men profile images (6)
  for (let i = 1; i <= 6; i++) {
    const num = i.toString().padStart(2, '0')
    uploadTasks.push({
      localPath: `public/images/men/qoupl_men_${num}.jpg`,
      bucket: 'hero-images',
      storagePath: `men/qoupl_men_${num}.jpg`,
      category: 'hero',
    })
  }

  // Couple photos (5)
  for (let i = 1; i <= 5; i++) {
    const num = i.toString().padStart(2, '0')
    uploadTasks.push({
      localPath: `public/images/coupl/qoupl_couple_${num}.jpg`,
      bucket: 'couple-photos',
      storagePath: `qoupl_couple_${num}.jpg`,
      category: 'gallery',
    })
  }

  // App screenshots (7)
  for (let i = 1; i <= 7; i++) {
    const num = i.toString().padStart(2, '0')
    uploadTasks.push({
      localPath: `public/qoupl/qoupl_screenshot_${num}.png`,
      bucket: 'app-screenshots',
      storagePath: `qoupl_screenshot_${num}.png`,
      category: 'screenshot',
    })
  }

  let uploaded = 0
  let skipped = 0
  let failed = 0

  console.log(`📋 Total images to upload: ${uploadTasks.length}\n`)

  for (const task of uploadTasks) {
    const fullPath = path.join(__dirname, '..', task.localPath)

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${task.localPath}`)
      failed++
      continue
    }

    // Read file
    const fileBuffer = fs.readFileSync(fullPath)
    const fileSize = (fileBuffer.length / 1024).toFixed(2)

    console.log(`📤 Uploading: ${task.storagePath} (${fileSize} KB)`)

    try {
      // Upload file (upsert will replace if exists)
      const { error: uploadError } = await adminClient.storage
        .from(task.bucket)
        .upload(task.storagePath, fileBuffer, {
          contentType: task.storagePath.endsWith('.png')
            ? 'image/png'
            : 'image/jpeg',
          cacheControl: '3600',
          upsert: true, // Replace if exists
        })

      if (uploadError) {
        console.error(`   ❌ Upload failed: ${uploadError.message}`)
        failed++
        continue
      }

      // Add to media table (only if not exists)
      const { data: existingMedia } = await adminClient
        .from('media')
        .select('id')
        .eq('storage_path', task.storagePath)
        .single()

      if (!existingMedia) {
        const { error: dbError } = await adminClient.from('media').insert({
          filename: path.basename(task.storagePath),
          storage_path: task.storagePath,
          bucket_name: task.bucket,
          file_type: task.storagePath.endsWith('.png')
            ? 'image/png'
            : 'image/jpeg',
          file_size: fileBuffer.length,
          alt_text: task.storagePath.replace(/\.\w+$/, '').replace(/[_-]/g, ' '),
          category: task.category,
          metadata: {},
        })

        if (dbError) {
          console.warn(`   ⚠️  Uploaded but DB insert failed: ${dbError.message}`)
        }
      }

      console.log(`   ✅ Uploaded successfully`)
      uploaded++
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      failed++
    }
  }

  console.log('\n📊 Upload Summary:')
  console.log(`   ✅ Uploaded: ${uploaded}`)
  console.log(`   ⏭️  Skipped (already exist): ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📦 Total: ${uploadTasks.length}`)

  if (uploaded > 0) {
    console.log('\n✨ Images uploaded successfully!')
    console.log('\n🔗 Access your images:')
    console.log(
      '   Go to: https://app.supabase.com/project/_/storage/buckets'
    )
  }

  if (failed > 0) {
    console.log(
      '\n⚠️  Some uploads failed. Please check the errors above.'
    )
    process.exit(1)
  }
}

uploadImages().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

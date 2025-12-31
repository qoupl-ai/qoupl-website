/**
 * Script to upload love-story images to Supabase Storage
 * 
 * Usage:
 * 1. Place images in public/images/love-story/ with names: qoupl_love_story_1.jpg, qoupl_love_story_2.jpg, etc.
 * 2. Run: npx tsx scripts/upload-love-story-images.ts
 */

import * as dotenv from 'dotenv'
import { join } from 'path'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables first
dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const BUCKET_NAME = 'love-story'
const LOCAL_DIR = path.join(__dirname, '..', 'public', 'images', 'love-story')

async function uploadLoveStoryImages() {
  console.log('📤 Starting love-story image upload to Supabase Storage...\n')

  // Check if directory exists
  if (!fs.existsSync(LOCAL_DIR)) {
    console.error(`❌ Directory not found: ${LOCAL_DIR}`)
    console.log('💡 Please create the directory and add images first.')
    process.exit(1)
  }

  // Read all image files
  const files = fs.readdirSync(LOCAL_DIR).filter(
    (file) => file.match(/\.(jpg|jpeg|png)$/i) && file.startsWith('qoupl_love_story_')
  )

  if (files.length === 0) {
    console.error(`❌ No images found in ${LOCAL_DIR}`)
    console.log('💡 Please rename your images to: qoupl_love_story_1.jpg, qoupl_love_story_2.jpg, etc.')
    process.exit(1)
  }

  console.log(`📋 Found ${files.length} images to upload\n`)

  let uploaded = 0
  let failed = 0

  for (const file of files) {
    const localPath = path.join(LOCAL_DIR, file)
    const storagePath = file // Store directly in bucket root

    console.log(`📤 Uploading: ${file}`)

    try {
      // Read file
      const fileBuffer = fs.readFileSync(localPath)
      const fileSize = (fileBuffer.length / 1024).toFixed(2)

      // Determine content type
      const contentType = file.endsWith('.png') ? 'image/png' : 'image/jpeg'

      // Upload to Supabase Storage
      const { error: uploadError } = await adminClient.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType,
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
        .eq('storage_path', storagePath)
        .eq('bucket_name', BUCKET_NAME)
        .single()

      if (!existingMedia) {
        const { error: dbError } = await adminClient.from('media').insert({
          filename: file,
          storage_path: storagePath,
          bucket_name: BUCKET_NAME,
          file_type: contentType,
          file_size: fileBuffer.length,
          alt_text: file.replace(/\.\w+$/, '').replace(/[_-]/g, ' '),
          category: 'love-story',
          metadata: {},
        })

        if (dbError) {
          console.warn(`   ⚠️  Uploaded but DB insert failed: ${dbError.message}`)
        }
      }

      console.log(`   ✅ Uploaded successfully (${fileSize} KB)`)
      uploaded++
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`)
      failed++
    }
  }

  console.log(`\n✨ Upload complete!`)
  console.log(`   ✅ Successfully uploaded: ${uploaded}`)
  if (failed > 0) {
    console.log(`   ❌ Failed: ${failed}`)
  }
}

// Run the script
uploadLoveStoryImages()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })


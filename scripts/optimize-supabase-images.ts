/**
 * Supabase Image Optimization Script
 *
 * Downloads images from Supabase Storage, generates WebP and AVIF versions,
 * and uploads them back to Supabase.
 *
 * This reduces image sizes by ~70% (AVIF) and ~60% (WebP).
 *
 * Usage: npm run optimize:images
 */

import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
})

// Buckets to optimize
const BUCKETS_TO_OPTIMIZE = [
  'hero-images',
  'love-story',
  'gallery-images',
  'blog-images',
  'qoupl'
]

interface OptimizationStats {
  bucket: string
  totalFiles: number
  optimized: number
  skipped: number
  errors: number
  originalSize: number
  webpSize: number
  avifSize: number
}

/**
 * Get file size from Supabase Storage
 */
async function getFileSize(bucket: string, path: string): Promise<number> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)

    if (error || !data) return 0
    return data.size
  } catch {
    return 0
  }
}

/**
 * Optimize a single image file
 */
async function optimizeImage(bucket: string, file: { name: string }) {
  console.log(`  📸 Processing: ${file.name}`)

  try {
    // Skip if already optimized (has .webp or .avif extension)
    if (file.name.endsWith('.webp') || file.name.endsWith('.avif')) {
      console.log(`  ⏭️  Skipped (already optimized): ${file.name}`)
      return { skipped: true }
    }

    // Skip non-image files
    const imageExtensions = ['.jpg', '.jpeg', '.png']
    const hasImageExt = imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
    if (!hasImageExt) {
      console.log(`  ⏭️  Skipped (not an image): ${file.name}`)
      return { skipped: true }
    }

    // Download original image
    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(file.name)

    if (downloadError || !imageBlob) {
      console.error(`  ❌ Download failed: ${downloadError?.message}`)
      return { error: true }
    }

    const originalSize = imageBlob.size
    console.log(`  📊 Original size: ${(originalSize / 1024).toFixed(2)} KB`)

    // Convert blob to buffer
    const arrayBuffer = await imageBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate WebP (80% quality)
    console.log(`  🔄 Generating WebP...`)
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer()

    const webpSize = webpBuffer.length
    console.log(`  ✅ WebP size: ${(webpSize / 1024).toFixed(2)} KB (${((1 - webpSize/originalSize) * 100).toFixed(1)}% reduction)`)

    // Generate AVIF (75% quality)
    console.log(`  🔄 Generating AVIF...`)
    const avifBuffer = await sharp(buffer)
      .avif({ quality: 75 })
      .toBuffer()

    const avifSize = avifBuffer.length
    console.log(`  ✅ AVIF size: ${(avifSize / 1024).toFixed(2)} KB (${((1 - avifSize/originalSize) * 100).toFixed(1)}% reduction)`)

    // Upload WebP version
    const webpPath = file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    const { error: webpError } = await supabase.storage
      .from(bucket)
      .upload(webpPath, webpBuffer, {
        contentType: 'image/webp',
        upsert: true
      })

    if (webpError) {
      console.error(`  ❌ WebP upload failed: ${webpError.message}`)
    } else {
      console.log(`  ✅ Uploaded: ${webpPath}`)
    }

    // Upload AVIF version
    const avifPath = file.name.replace(/\.(jpg|jpeg|png)$/i, '.avif')
    const { error: avifError } = await supabase.storage
      .from(bucket)
      .upload(avifPath, avifBuffer, {
        contentType: 'image/avif',
        upsert: true
      })

    if (avifError) {
      console.error(`  ❌ AVIF upload failed: ${avifError.message}`)
    } else {
      console.log(`  ✅ Uploaded: ${avifPath}`)
    }

    return {
      optimized: true,
      originalSize,
      webpSize,
      avifSize
    }

  } catch (error) {
    console.error(`  ❌ Error optimizing ${file.name}:`, error)
    return { error: true }
  }
}

/**
 * Optimize all images in a bucket
 */
async function optimizeBucket(bucket: string): Promise<OptimizationStats> {
  console.log(`\n📦 Optimizing bucket: ${bucket}`)
  console.log(`${'='.repeat(50)}`)

  const stats: OptimizationStats = {
    bucket,
    totalFiles: 0,
    optimized: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    webpSize: 0,
    avifSize: 0
  }

  try {
    // List all files in bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (listError) {
      console.error(`❌ Failed to list files in ${bucket}:`, listError.message)
      return stats
    }

    if (!files || files.length === 0) {
      console.log(`  ℹ️  No files found in bucket`)
      return stats
    }

    stats.totalFiles = files.length
    console.log(`  📁 Found ${stats.totalFiles} files\n`)

    // Optimize each file
    for (const file of files) {
      const result = await optimizeImage(bucket, file)

      if (result.error) {
        stats.errors++
      } else if (result.skipped) {
        stats.skipped++
      } else if (result.optimized) {
        stats.optimized++
        stats.originalSize += result.originalSize || 0
        stats.webpSize += result.webpSize || 0
        stats.avifSize += result.avifSize || 0
      }

      console.log('') // Add spacing between files
    }

    return stats

  } catch (error) {
    console.error(`❌ Error processing bucket ${bucket}:`, error)
    return stats
  }
}

/**
 * Main optimization function
 */
async function main() {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Supabase Image Optimization Script                    ║
║  Generates WebP and AVIF versions of all images        ║
╚════════════════════════════════════════════════════════╝
`)

  const allStats: OptimizationStats[] = []

  // Optimize each bucket
  for (const bucket of BUCKETS_TO_OPTIMIZE) {
    const stats = await optimizeBucket(bucket)
    allStats.push(stats)
  }

  // Print summary
  console.log(`\n\n${'='.repeat(70)}`)
  console.log(`📊 OPTIMIZATION SUMMARY`)
  console.log(`${'='.repeat(70)}\n`)

  let totalOptimized = 0
  let totalSkipped = 0
  let totalErrors = 0
  let totalOriginalSize = 0
  let totalWebpSize = 0
  let totalAvifSize = 0

  allStats.forEach(stats => {
    console.log(`📦 ${stats.bucket}:`)
    console.log(`   Files processed: ${stats.totalFiles}`)
    console.log(`   ✅ Optimized: ${stats.optimized}`)
    console.log(`   ⏭️  Skipped: ${stats.skipped}`)
    console.log(`   ❌ Errors: ${stats.errors}`)

    if (stats.optimized > 0) {
      console.log(`   📊 Original size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`)
      console.log(`   📊 WebP size: ${(stats.webpSize / 1024 / 1024).toFixed(2)} MB (${((1 - stats.webpSize/stats.originalSize) * 100).toFixed(1)}% reduction)`)
      console.log(`   📊 AVIF size: ${(stats.avifSize / 1024 / 1024).toFixed(2)} MB (${((1 - stats.avifSize/stats.originalSize) * 100).toFixed(1)}% reduction)`)
    }
    console.log('')

    totalOptimized += stats.optimized
    totalSkipped += stats.skipped
    totalErrors += stats.errors
    totalOriginalSize += stats.originalSize
    totalWebpSize += stats.webpSize
    totalAvifSize += stats.avifSize
  })

  console.log(`${'='.repeat(70)}`)
  console.log(`🎉 TOTAL:`)
  console.log(`   ✅ Optimized: ${totalOptimized} images`)
  console.log(`   ⏭️  Skipped: ${totalSkipped} images`)
  console.log(`   ❌ Errors: ${totalErrors} images`)

  if (totalOptimized > 0) {
    console.log(`\n   💾 Storage Impact:`)
    console.log(`   Original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`   WebP: ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB (${((1 - totalWebpSize/totalOriginalSize) * 100).toFixed(1)}% reduction)`)
    console.log(`   AVIF: ${(totalAvifSize / 1024 / 1024).toFixed(2)} MB (${((1 - totalAvifSize/totalOriginalSize) * 100).toFixed(1)}% reduction)`)
    console.log(`   Total saved: ${((totalOriginalSize - totalAvifSize) / 1024 / 1024).toFixed(2)} MB`)
  }

  console.log(`${'='.repeat(70)}\n`)

  console.log(`✅ Optimization complete!`)
  console.log(`\nℹ️  Note: Original images are preserved. WebP and AVIF versions are created alongside them.`)
  console.log(`ℹ️  Next.js will automatically serve the best format based on browser support.`)
}

// Run the script
main().catch(console.error)

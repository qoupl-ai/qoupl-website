/**
 * Remove Local Images from Repository
 * 
 * This script removes all local image files from the public directory
 * after they have been migrated to Supabase Storage.
 * 
 * WARNING: This script DELETES files. Make sure you have:
 * 1. Uploaded all images to Supabase Storage
 * 2. Replaced all image references in code
 * 3. Tested the application
 * 
 * Usage:
 *   npm run remove:local-images
 * OR
 *   npx ts-node --project tsconfig.node.json scripts/remove-local-images.ts
 */

import * as fs from 'fs'
import * as path from 'path'

/**
 * Recursively find all image files
 */
function findImageFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findImageFiles(filePath, fileList)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'].includes(ext)) {
        fileList.push(filePath)
      }
    }
  }

  return fileList
}

/**
 * Main execution
 */
async function main() {
  console.log('🗑️  Removing local images from repository...\n')

  const publicDir = path.join(__dirname, '..', 'public')

  if (!fs.existsSync(publicDir)) {
    console.error('❌ Public directory not found')
    process.exit(1)
  }

  // Find all image files
  const imageFiles = findImageFiles(publicDir)

  if (imageFiles.length === 0) {
    console.log('✨ No image files found to remove')
    return
  }

  console.log(`📋 Found ${imageFiles.length} image files:\n`)

  // List files that will be deleted
  for (const file of imageFiles) {
    const relativePath = path.relative(publicDir, file)
    console.log(`   - ${relativePath}`)
  }

  console.log('\n⚠️  WARNING: This will DELETE the above files!')
  console.log('   Make sure you have:')
  console.log('   1. Uploaded all images to Supabase Storage')
  console.log('   2. Replaced all image references in code')
  console.log('   3. Tested the application\n')

  // In a real scenario, you might want to add a confirmation prompt
  // For now, we'll proceed with deletion
  console.log('🗑️  Deleting files...\n')

  let deleted = 0
  let failed = 0
  const errors: string[] = []

  for (const file of imageFiles) {
    try {
      fs.unlinkSync(file)
      const relativePath = path.relative(publicDir, file)
      console.log(`✅ Deleted: ${relativePath}`)
      deleted++
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const relativePath = path.relative(publicDir, file)
      console.error(`❌ Failed to delete ${relativePath}: ${errorMessage}`)
      errors.push(`${relativePath}: ${errorMessage}`)
      failed++
    }
  }

  // Remove empty directories
  console.log('\n🧹 Cleaning up empty directories...\n')
  
  const removeEmptyDirs = (dir: string): void => {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        removeEmptyDirs(filePath)
        
        // Try to remove directory if empty
        try {
          const remainingFiles = fs.readdirSync(filePath)
          if (remainingFiles.length === 0) {
            fs.rmdirSync(filePath)
            const relativePath = path.relative(publicDir, filePath)
            console.log(`✅ Removed empty directory: ${relativePath}`)
          }
        } catch {
          // Directory not empty or error, skip
        }
      }
    }
  }

  removeEmptyDirs(publicDir)

  console.log('\n📊 Summary:')
  console.log(`   ✅ Deleted: ${deleted}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log(`   📦 Total: ${imageFiles.length}`)

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:')
    errors.forEach(err => console.log(`   - ${err}`))
  }

  if (deleted > 0) {
    console.log('\n✨ Local images removed!')
    console.log('\n📝 Next steps:')
    console.log('   1. Commit the changes')
    console.log('   2. Verify application still works')
    console.log('   3. All images should now load from Supabase Storage')
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})


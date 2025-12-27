/**
 * Cleanup Script: Remove Legacy Code
 * 
 * This script identifies and lists legacy files that should be deleted
 * after migration to unified CMS model.
 * 
 * Run: ts-node --project tsconfig.node.json scripts/cleanup-legacy-code.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const legacyFiles = [
  // Legacy server actions
  'app/actions/blog-actions.ts',
  'app/actions/faq-actions.ts',
  'app/actions/feature-actions.ts',
  'app/actions/pricing-actions.ts',

  // Legacy CMS components
  'components/cms/blog-dialog.tsx',
  'components/cms/blog-list.tsx',
  'components/cms/faq-dialog.tsx',
  'components/cms/faq-list.tsx',
  'components/cms/feature-dialog.tsx',
  'components/cms/feature-list.tsx',
  'components/cms/pricing-dialog.tsx',
  'components/cms/pricing-list.tsx',
  'components/cms/delete-blog-dialog.tsx',
  'components/cms/delete-faq-dialog.tsx',
  'components/cms/delete-feature-dialog.tsx',
  'components/cms/delete-pricing-dialog.tsx',

  // Legacy CMS pages (if they exist)
  'app/add-content/blog/page.tsx',
  'app/add-content/faqs/page.tsx',
  'app/add-content/features/page.tsx',
  'app/add-content/pricing/page.tsx',

  // Legacy migration scripts (after migration is complete)
  'scripts/migrate-content-to-supabase.ts', // Keep for reference, but mark as deprecated
]

const legacyDirectories = [
  // These should be empty after cleanup
  'app/add-content/blog',
  'app/add-content/faqs',
  'app/add-content/features',
  'app/add-content/pricing',
]

function checkFile(filePath: string): { exists: boolean; size: number } {
  const fullPath = path.join(process.cwd(), filePath)
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath)
    return { exists: true, size: stats.size }
  }
  return { exists: false, size: 0 }
}

function checkDirectory(dirPath: string): { exists: boolean; files: string[] } {
  const fullPath = path.join(process.cwd(), dirPath)
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath)
    return { exists: true, files }
  }
  return { exists: false, files: [] }
}

async function main() {
  console.log('🧹 Legacy Code Cleanup Report\n')
  console.log('='.repeat(60))

  console.log('\n📄 Legacy Files:\n')
  let totalSize = 0
  let existingCount = 0

  for (const file of legacyFiles) {
    const { exists, size } = checkFile(file)
    if (exists) {
      console.log(`   ✅ ${file} (${(size / 1024).toFixed(2)} KB)`)
      totalSize += size
      existingCount++
    } else {
      console.log(`   ⏭️  ${file} (not found)`)
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Files found: ${existingCount}/${legacyFiles.length}`)
  console.log(`   Total size: ${(totalSize / 1024).toFixed(2)} KB`)

  console.log('\n📁 Legacy Directories:\n')
  for (const dir of legacyDirectories) {
    const { exists, files } = checkDirectory(dir)
    if (exists) {
      if (files.length > 0) {
        console.log(`   ⚠️  ${dir} (${files.length} files)`)
        files.forEach((file) => console.log(`      - ${file}`))
      } else {
        console.log(`   ✅ ${dir} (empty, safe to delete)`)
      }
    } else {
      console.log(`   ⏭️  ${dir} (not found)`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n💡 Next Steps:')
  console.log('   1. Verify all data is migrated to sections table')
  console.log('   2. Test unified CMS works correctly')
  console.log('   3. Delete legacy files listed above')
  console.log('   4. Update CMS navigation to remove legacy links')
  console.log('   5. Remove legacy routes from middleware if needed\n')

  console.log('⚠️  WARNING: Do not delete files until:')
  console.log('   - Data migration is complete and verified')
  console.log('   - Unified CMS is tested and working')
  console.log('   - All pages render correctly from sections\n')
}

main()


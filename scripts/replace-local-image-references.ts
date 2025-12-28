/**
 * Replace Local Image References with Supabase URLs
 * 
 * This script finds all references to local images in the codebase and replaces
 * them with Supabase Storage URLs using getStorageUrl().
 * 
 * Usage:
 *   npm run replace:images
 * OR
 *   npx ts-node --project tsconfig.node.json scripts/replace-local-image-references.ts
 */

import * as fs from 'fs'
import * as path from 'path'

interface ImageMapping {
  localPath: string | RegExp
  bucket: string
  storagePath: string | ((match: RegExpMatchArray) => string)
  useAbsolute?: boolean // Use getStorageUrlAbsolute for full URLs
  description: string
}

// Map of local paths to Supabase storage paths
const imageMappings: ImageMapping[] = [
  // Brand logos - exact matches
  { localPath: '/images/brand-logo/apple.png', bucket: 'brand-assets', storagePath: 'brand-logo/apple.png', description: 'Apple logo' },
  { localPath: '/images/brand-logo/apple-dark.png', bucket: 'brand-assets', storagePath: 'brand-logo/apple-dark.png', description: 'Apple logo dark' },
  { localPath: '/images/brand-logo/android.png', bucket: 'brand-assets', storagePath: 'brand-logo/android.png', description: 'Android logo' },
  { localPath: '/images/brand-logo/android-dark.png', bucket: 'brand-assets', storagePath: 'brand-logo/android-dark.png', description: 'Android logo dark' },
  { localPath: '/images/quoupl.svg', bucket: 'brand-assets', storagePath: 'quoupl.svg', description: 'Qoupl logo SVG' },
  
  // Root logo files
  { localPath: '/qoupl_logo.svg', bucket: 'brand-assets', storagePath: 'qoupl_logo.svg', description: 'Qoupl logo' },
  { localPath: '/qoupl_apple_icon.svg', bucket: 'brand-assets', storagePath: 'qoupl_apple_icon.svg', description: 'Qoupl Apple icon' },
  
  // Generic SVGs
  { localPath: '/og-image.svg', bucket: 'brand-assets', storagePath: 'og-image.svg', description: 'OG image' },
  
  // Full URL patterns (for structured data, etc.) - use getStorageUrlAbsolute
  { 
    localPath: /https:\/\/qoupl\.ai\/images\/quoupl\.svg/, 
    bucket: 'brand-assets', 
    storagePath: 'quoupl.svg',
    useAbsolute: true,
    description: 'Qoupl logo full URL' 
  },
  { 
    localPath: /https:\/\/qoupl\.ai\/og-image\.svg/, 
    bucket: 'brand-assets', 
    storagePath: 'og-image.svg',
    useAbsolute: true,
    description: 'OG image full URL' 
  },
  { localPath: '/next.svg', bucket: 'brand-assets', storagePath: 'next.svg', description: 'Next.js logo' },
  { localPath: '/vercel.svg', bucket: 'brand-assets', storagePath: 'vercel.svg', description: 'Vercel logo' },
  { localPath: '/window.svg', bucket: 'brand-assets', storagePath: 'window.svg', description: 'Window icon' },
  { localPath: '/globe.svg', bucket: 'brand-assets', storagePath: 'globe.svg', description: 'Globe icon' },
  { localPath: '/file.svg', bucket: 'brand-assets', storagePath: 'file.svg', description: 'File icon' },
  
  // Pattern-based replacements
  { 
    localPath: /\/images\/coupl\/(.+)/, 
    bucket: 'couple-photos', 
    storagePath: (match) => match[1] || '', 
    description: 'Couple photos' 
  },
  { 
    localPath: /\/images\/men\/(.+)/, 
    bucket: 'hero-images', 
    storagePath: (match) => `men/${match[1] || ''}`, 
    description: 'Men profile images' 
  },
  { 
    localPath: /\/images\/women\/(.+)/, 
    bucket: 'hero-images', 
    storagePath: (match) => `women/${match[1] || ''}`, 
    description: 'Women profile images' 
  },
  { 
    localPath: /\/qoupl\/(.+)/, 
    bucket: 'app-screenshots', 
    storagePath: (match) => match[1] || '', 
    description: 'App screenshots' 
  },
]

/**
 * Recursively find all TypeScript/TSX files
 */
function findFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and .next
      if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.')) {
        findFiles(filePath, fileList)
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath)
    }
  }

  return fileList
}

/**
 * Process a single file
 */
function processFile(filePath: string): { replaced: number; errors: string[] } {
  let content = fs.readFileSync(filePath, 'utf-8')
  const originalContent = content
  let replaced = 0
  const errors: string[] = []

  // Check if file needs getStorageUrl import
  let needsImport = false
  for (const mapping of imageMappings) {
    if (typeof mapping.localPath === 'string') {
      if (content.includes(`"${mapping.localPath}"`) || content.includes(`'${mapping.localPath}'`)) {
        needsImport = true
        break
      }
    } else {
      if (mapping.localPath.test(content)) {
        needsImport = true
        break
      }
    }
  }

  if (!needsImport) {
    return { replaced: 0, errors: [] }
  }

  // Check if we need getStorageUrlAbsolute (check before processing)
  let needsAbsolute = false
  for (const mapping of imageMappings) {
    if (mapping.useAbsolute) {
      if (typeof mapping.localPath === 'string') {
        if (content.includes(mapping.localPath)) {
          needsAbsolute = true
          break
        }
      } else {
        if (mapping.localPath.test(content)) {
          needsAbsolute = true
          break
        }
      }
    }
  }
  
  // Add import if not present
  if (!content.includes('getStorageUrl') && !content.includes("from '@/lib/supabase/storage-url'")) {
    // Find the last import statement
    const importLines = content.split('\n')
    let lastImportIndex = -1
    for (let i = 0; i < importLines.length; i++) {
      const line = importLines[i]
      if (line?.trim().startsWith('import ')) {
        lastImportIndex = i
      }
    }

    if (lastImportIndex >= 0) {
      const importStatement = needsAbsolute
        ? "import { getStorageUrl, getStorageUrlAbsolute } from '@/lib/supabase/storage-url';"
        : "import { getStorageUrl } from '@/lib/supabase/storage-url';"
      importLines.splice(lastImportIndex + 1, 0, importStatement)
      content = importLines.join('\n')
    } else {
      // No imports found, add at the top
      const importStatement = needsAbsolute
        ? "import { getStorageUrl, getStorageUrlAbsolute } from '@/lib/supabase/storage-url';\n"
        : "import { getStorageUrl } from '@/lib/supabase/storage-url';\n"
      content = importStatement + content
    }
  } else if (needsAbsolute && !content.includes('getStorageUrlAbsolute')) {
    // Update existing import to include getStorageUrlAbsolute
    content = content.replace(
      /import\s*{\s*getStorageUrl\s*}\s*from\s*['"]@\/lib\/supabase\/storage-url['"]/,
      "import { getStorageUrl, getStorageUrlAbsolute } from '@/lib/supabase/storage-url'"
    )
  }

  // Replace all local image paths
  for (const mapping of imageMappings) {
    if (typeof mapping.localPath === 'string') {
      // Exact string match - handle all quote types and contexts
      const escapedPath = mapping.localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const storagePath = typeof mapping.storagePath === 'string' ? mapping.storagePath : ''
      const replacement = mapping.useAbsolute
        ? `getStorageUrlAbsolute("${mapping.bucket}", "${storagePath}")`
        : `getStorageUrl("${mapping.bucket}", "${storagePath}")`
      
      // Replace in double quotes
      const doubleQuoteRegex = new RegExp(`"${escapedPath}"`, 'g')
      if (doubleQuoteRegex.test(content)) {
        content = content.replace(doubleQuoteRegex, replacement)
        replaced++
      }
      
      // Replace in single quotes
      const singleQuoteRegex = new RegExp(`'${escapedPath}'`, 'g')
      if (singleQuoteRegex.test(content)) {
        content = content.replace(singleQuoteRegex, replacement)
        replaced++
      }
      
      // Replace in template literals
      const templateRegex = new RegExp(`\`${escapedPath}\``, 'g')
      if (templateRegex.test(content)) {
        content = content.replace(templateRegex, replacement)
        replaced++
      }
      
      // Replace full URLs (for structured data)
      if (mapping.useAbsolute) {
        const fullUrlPattern = new RegExp(`https://qoupl\\.ai${escapedPath}`, 'g')
        if (fullUrlPattern.test(content)) {
          content = content.replace(fullUrlPattern, replacement)
          replaced++
        }
      }
    } else {
      // Regex pattern match
      const doubleQuotePattern = new RegExp(`"(${mapping.localPath.source})"`, 'g')
      const singleQuotePattern = new RegExp(`'(${mapping.localPath.source})'`, 'g')
      const templatePattern = new RegExp(`\`(${mapping.localPath.source})\``, 'g')
      
      const patterns = [doubleQuotePattern, singleQuotePattern, templatePattern]
      
      for (const pattern of patterns) {
        const matches = [...content.matchAll(pattern)]
        for (const match of matches) {
          const fullPath = match[1]
          if (!fullPath) continue
          const pathMatch = fullPath.match(mapping.localPath)
          if (pathMatch) {
            const storagePathResult = typeof mapping.storagePath === 'function' 
              ? mapping.storagePath(pathMatch)
              : (typeof mapping.storagePath === 'string' ? mapping.storagePath : '')
            
            const replacement = mapping.useAbsolute
              ? `getStorageUrlAbsolute("${mapping.bucket}", "${storagePathResult}")`
              : `getStorageUrl("${mapping.bucket}", "${storagePathResult}")`
            content = content.replace(match[0], replacement)
            replaced++
          }
        }
      }
    }
  }

  // Write file if changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
  }

  return { replaced, errors }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Finding and replacing local image references...\n')

  const rootDir = path.join(__dirname, '..')
  const searchDirs = [
    path.join(rootDir, 'app'),
    path.join(rootDir, 'components'),
    path.join(rootDir, 'lib'),
  ]

  const files: string[] = []
  for (const dir of searchDirs) {
    if (fs.existsSync(dir)) {
      findFiles(dir, files)
    }
  }

  console.log(`📋 Found ${files.length} files to process\n`)

  let totalReplaced = 0
  let filesModified = 0
  const errors: string[] = []

  for (const file of files) {
    try {
      const { replaced, errors: fileErrors } = processFile(file)
      if (replaced > 0) {
        const relativePath = path.relative(rootDir, file)
        console.log(`✅ ${relativePath}: ${replaced} replacement(s)`)
        totalReplaced += replaced
        filesModified++
      }
      errors.push(...fileErrors)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const relativePath = path.relative(rootDir, file)
      console.error(`❌ Error processing ${relativePath}: ${errorMessage}`)
      errors.push(`${relativePath}: ${errorMessage}`)
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Files modified: ${filesModified}`)
  console.log(`   🔄 Total replacements: ${totalReplaced}`)
  if (errors.length > 0) {
    console.log(`   ⚠️  Errors: ${errors.length}`)
    errors.forEach(err => console.log(`      - ${err}`))
  }

  if (totalReplaced > 0) {
    console.log('\n✨ Image references updated!')
    console.log('\n📝 Next steps:')
    console.log('   1. Review the changes')
    console.log('   2. Test the application')
    console.log('   3. Run: npm run remove:local-images')
  } else {
    console.log('\n✨ No image references found to replace')
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

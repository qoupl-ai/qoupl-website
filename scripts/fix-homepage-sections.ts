/**
 * Fix Homepage Sections
 * 
 * This script automatically fixes component_type values for homepage sections
 * based on their content structure.
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

/**
 * Identify section type based on content structure
 */
function identifySectionType(content: any): string | null {
  if (!content || typeof content !== 'object') {
    return null
  }

  // Hero section: has title, tagline/subtitle, images (men/women), cta
  if (content.title && (content.tagline || content.subtitle) && content.images) {
    return 'hero'
  }

  // How it works: has steps array
  if (content.steps && Array.isArray(content.steps) && content.steps.length > 0) {
    return 'how-it-works'
  }

  // Product features: has features array with title, description, icon
  if (content.features && Array.isArray(content.features) && content.features.length > 0) {
    if (content.features[0].title && content.features[0].description) {
      return 'product-features'
    }
  }

  // Gallery: has images array with story/title
  if (content.images && Array.isArray(content.images)) {
    if (content.images[0]?.story || content.images[0]?.title) {
      return 'gallery'
    }
  }

  // Testimonials: has testimonials array
  if (content.testimonials && Array.isArray(content.testimonials)) {
    return 'testimonials'
  }

  // App download: has platforms and screenshots
  if (content.platforms && content.screenshots) {
    return 'app-download'
  }

  // Coming soon: has platforms and benefits (but no screenshots)
  if (content.platforms && content.benefits && !content.screenshots) {
    return 'coming-soon'
  }

  // App download (alternative): has platforms with coming flag and screenshots
  if (content.platforms && Array.isArray(content.platforms) && content.screenshots) {
    return 'app-download'
  }

  return null
}

async function fixHomepageSections() {
  console.log('\n🔧 Fixing Homepage Sections...\n')

  // Get home page
  const { data: homePage, error: pageError } = await adminClient
    .from('pages')
    .select('id, slug, title')
    .eq('slug', 'home')
    .single()

  if (pageError || !homePage) {
    console.error('❌ Error fetching home page:', pageError)
    return
  }

  console.log(`✅ Found home page: ${homePage.title}\n`)

  // Get all sections for home page
  const { data: sectionsData, error: sectionsError } = await adminClient
    .from('sections')
    .select('*')
    .eq('page_id', homePage.id)
    .order('order_index', { ascending: true })

  if (sectionsError) {
    console.error('❌ Error fetching sections:', sectionsError)
    return
  }

  // Normalize sections - handle missing component_type
  const sections = (sectionsData || []).map(s => ({
    ...s,
    component_type: s.component_type || s.type || null,
  }))

  if (!sections || sections.length === 0) {
    console.log('⚠️  No sections found for home page\n')
    return
  }

  console.log(`📊 Found ${sections.length} sections\n`)

  let fixedCount = 0
  let skippedCount = 0

  for (const section of sections) {
    const identifiedType = identifySectionType(section.content)
    
    if (!identifiedType) {
      console.log(`⚠️  [${section.order_index}] Could not identify type for section ${section.id}`)
      console.log(`   Current type: ${section.component_type}`)
      skippedCount++
      continue
    }

    if (section.component_type === identifiedType) {
      console.log(`✅ [${section.order_index}] ${section.component_type} - Already correct`)
      skippedCount++
      continue
    }

    // Update the section type
    const { error: updateError } = await adminClient
      .from('sections')
      .update({ component_type: identifiedType })
      .eq('id', section.id)

    if (updateError) {
      console.error(`❌ [${section.order_index}] Failed to update:`, updateError.message)
      continue
    }

    console.log(`✅ [${section.order_index}] Fixed: ${section.component_type} → ${identifiedType}`)
    fixedCount++
  }

  console.log(`\n📊 Summary:`)
  console.log(`   ✅ Fixed: ${fixedCount}`)
  console.log(`   ⏭️  Skipped: ${skippedCount}`)
  console.log('\n🎉 Done!\n')
}

fixHomepageSections().catch(console.error)


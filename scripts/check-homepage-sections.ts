/**
 * Check Homepage Sections
 * 
 * This script checks what component_type values are stored in the database
 * for the home page and compares them with the registry.
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function checkHomepageSections() {
  console.log('\n🔍 Checking Homepage Sections...\n')

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

  console.log(`✅ Found home page: ${homePage.title} (ID: ${homePage.id})\n`)

  // Get all sections for home page
  // Try with component_type first, if that fails, try type
  let sections: any[] = []
  let sectionsError: any = null

  const { data: sectionsData, error: error1 } = await adminClient
    .from('sections')
    .select('*')
    .eq('page_id', homePage.id)
    .order('order_index', { ascending: true })

  if (error1) {
    // Try alternative column name
    const { data: altData, error: error2 } = await adminClient
      .from('sections')
      .select('*')
      .eq('page_id', homePage.id)
    
    if (error2) {
      console.error('❌ Error fetching sections:', error1)
      console.error('   Alternative query also failed:', error2)
      return
    }
    sections = altData || []
  } else {
    sections = sectionsData || []
  }

  // Normalize component_type field (might be 'type' or 'component_type')
  sections = sections.map(s => ({
    ...s,
    component_type: s.component_type || s.type || 'unknown',
  }))

  if (!sections || sections.length === 0) {
    console.log('⚠️  No sections found for home page\n')
    return
  }

  console.log(`📊 Found ${sections.length} sections:\n`)

  // Expected types in registry
  const registeredTypes = [
    'hero',
    'how-it-works',
    'product-features',
    'gallery',
    'testimonials',
    'app-download',
    'coming-soon',
  ]

  sections.forEach((section, index) => {
    const isRegistered = registeredTypes.includes(section.component_type)
    const status = isRegistered ? '✅' : '❌'
    
    console.log(`${status} [${index + 1}] ${section.component_type}`)
    console.log(`   Order: ${section.order_index} | Published: ${section.published}`)
    
    if (!isRegistered) {
      console.log(`   ⚠️  This type is NOT registered in component registry!`)
      
      // Try to identify what it should be based on content
      const content = section.content as any
      if (content.title && content.tagline && content.images) {
        console.log(`   💡 Suggestion: Should be 'hero'`)
      } else if (content.steps && Array.isArray(content.steps)) {
        console.log(`   💡 Suggestion: Should be 'how-it-works'`)
      } else if (content.features && Array.isArray(content.features)) {
        console.log(`   💡 Suggestion: Should be 'product-features'`)
      } else if (content.images && Array.isArray(content.images) && content.images[0]?.story) {
        console.log(`   💡 Suggestion: Should be 'gallery'`)
      } else if (content.testimonials && Array.isArray(content.testimonials)) {
        console.log(`   💡 Suggestion: Should be 'testimonials'`)
      } else if (content.platforms && content.screenshots) {
        console.log(`   💡 Suggestion: Should be 'app-download'`)
      } else if (content.platforms && content.benefits) {
        console.log(`   💡 Suggestion: Should be 'coming-soon'`)
      }
    }
    console.log('')
  })

  // Summary
  const unregistered = sections.filter(s => !registeredTypes.includes(s.component_type))
  
  if (unregistered.length > 0) {
    console.log(`\n⚠️  Found ${unregistered.length} sections with unregistered types:`)
    unregistered.forEach(s => {
      console.log(`   - ${s.component_type}`)
    })
    console.log('\n💡 Run fix-homepage-sections.ts to update them automatically\n')
  } else {
    console.log('✅ All section types are registered!\n')
  }
}

checkHomepageSections().catch(console.error)


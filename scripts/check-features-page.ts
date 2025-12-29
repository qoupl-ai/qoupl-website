/**
 * Check Features Page
 * 
 * This script checks if the features page exists and has sections
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function checkFeaturesPage() {
  console.log('\n🔍 Checking Features Page...\n')

  // Get features page
  const { data: featuresPage, error: pageError } = await adminClient
    .from('pages')
    .select('id, slug, title')
    .eq('slug', 'features')
    .single()

  if (pageError || !featuresPage) {
    console.error('❌ Features page not found!')
    console.error('   Error:', pageError?.message)
    console.log('\n💡 You need to create the features page first.')
    return
  }

  console.log(`✅ Found features page: ${featuresPage.title} (ID: ${featuresPage.id})\n`)

  // Get all sections for features page
  const { data: sections, error: sectionsError } = await adminClient
    .from('sections')
    .select('*')
    .eq('page_id', featuresPage.id)
    .order('order_index', { ascending: true })

  if (sectionsError) {
    console.error('❌ Error fetching sections:', sectionsError)
    return
  }

  if (!sections || sections.length === 0) {
    console.log('⚠️  No sections found for features page\n')
    console.log('💡 You need to create sections for the features page.')
    console.log('   Run: npm run migrate:all-pages (if available)')
    console.log('   Or create sections manually in the CMS\n')
    return
  }

  console.log(`📊 Found ${sections.length} sections:\n`)

  sections.forEach((section, index) => {
    console.log(`[${index + 1}] ${section.component_type || 'unknown'}`)
    console.log(`   Order: ${section.order_index} | Published: ${section.published}`)
    
    if (section.component_type === 'feature-category') {
      const content = section.content as any
      const features = content?.features || []
      console.log(`   Features: ${features.length} categories`)
    }
    console.log('')
  })

  // Check for feature-category section specifically
  const featureCategorySection = sections.find(s => s.component_type === 'feature-category')
  
  if (!featureCategorySection) {
    console.log('⚠️  No "feature-category" section found!')
    console.log('   The features page needs a section with component_type = "feature-category"\n')
  } else {
    const content = featureCategorySection.content as any
    const categories = content?.features || []
    console.log(`✅ Found feature-category section with ${categories.length} categories\n`)
  }
}

checkFeaturesPage().catch(console.error)


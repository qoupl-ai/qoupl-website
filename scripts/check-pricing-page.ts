/**
 * Check Pricing Page
 * 
 * This script checks if the pricing page has sections and if they're published
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function checkPricingPage() {
  console.log('\n🔍 Checking Pricing Page...\n')

  // Get pricing page
  const { data: pricingPage, error: pageError } = await adminClient
    .from('pages')
    .select('id, slug, title, published')
    .eq('slug', 'pricing')
    .single()

  if (pageError || !pricingPage) {
    console.error('❌ Pricing page not found!')
    console.error('   Error:', pageError?.message)
    return
  }

  console.log(`✅ Found pricing page: ${pricingPage.title} (ID: ${pricingPage.id})`)
  console.log(`   Published: ${pricingPage.published}\n`)

  // Get all sections for pricing page
  const { data: sections, error: sectionsError } = await adminClient
    .from('sections')
    .select('*')
    .eq('page_id', pricingPage.id)
    .order('order_index', { ascending: true })

  if (sectionsError) {
    console.error('❌ Error fetching sections:', sectionsError)
    return
  }

  if (!sections || sections.length === 0) {
    console.log('⚠️  No sections found for pricing page\n')
    return
  }

  console.log(`📊 Found ${sections.length} sections:\n`)

  const requiredTypes = [
    'pricing-hero',
    'pricing-plans',
    'free-messages',
    'message-bundles',
    'pricing-info',
    'pricing-faq',
  ]

  sections.forEach((section, index) => {
    const type = section.component_type || (section as any).section_type || 'unknown'
    const isPublished = section.published
    const status = isPublished ? '✅' : '❌'
    
    console.log(`${status} [${index + 1}] ${type}`)
    console.log(`   Order: ${section.order_index} | Published: ${isPublished}`)
    
    if (!isPublished) {
      console.log(`   ⚠️  This section is NOT published!`)
    }
    console.log('')
  })

  // Check for required types
  const foundTypes = new Set(
    sections.map(s => s.component_type || (s as any).section_type).filter(Boolean)
  )

  const missingTypes = requiredTypes.filter(t => !foundTypes.has(t))
  const unpublishedSections = sections.filter(s => !s.published)

  if (missingTypes.length > 0) {
    console.log(`\n⚠️  Missing section types:`)
    missingTypes.forEach(t => console.log(`   - ${t}`))
  }

  if (unpublishedSections.length > 0) {
    console.log(`\n⚠️  ${unpublishedSections.length} sections are not published:`)
    unpublishedSections.forEach(s => {
      const type = s.component_type || (s as any).section_type
      console.log(`   - ${type}`)
    })
  }

  if (missingTypes.length === 0 && unpublishedSections.length === 0) {
    console.log('\n✅ All required sections exist and are published!\n')
  }
}

checkPricingPage().catch(console.error)


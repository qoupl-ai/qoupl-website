/**
 * Seed Pricing Page Sections
 * Creates all necessary sections for the pricing page
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function getPageId(slug: string): Promise<string | null> {
  const { data, error } = await adminClient
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error(`❌ Page "${slug}" not found:`, error?.message)
    return null
  }

  return data.id
}

async function seedPricingSections() {
  console.log('\n💰 Seeding Pricing Page Sections...\n')

  const pricingPageId = await getPageId('pricing')
  if (!pricingPageId) {
    console.error('❌ Pricing page not found. Please create it first.')
    return
  }

  console.log(`✅ Found pricing page with ID: ${pricingPageId}\n`)

  // Check which column name the database uses
  const { data: sample } = await adminClient
    .from('sections')
    .select('*')
    .limit(1)
    .maybeSingle()

  const hasSectionType = sample && 'section_type' in sample
  const hasComponentType = sample && 'component_type' in sample
  
  console.log(`📊 Database columns: section_type=${hasSectionType}, component_type=${hasComponentType}\n`)

  // Check if sections already exist (try both column names)
  const { data: existingSections1 } = await adminClient
    .from('sections')
    .select('component_type, section_type')
    .eq('page_id', pricingPageId)

  const existingTypes = new Set(
    (existingSections1 || []).map(s => s.component_type || (s as any).section_type).filter(Boolean)
  )
  console.log(`📊 Existing sections: ${existingTypes.size > 0 ? Array.from(existingTypes).join(', ') : 'None'}\n`)

  // Helper to create section with correct column names
  const createSection = (type: string, order: number, content: any, published: boolean = true) => {
    const section: any = {
      page_id: pricingPageId,
      order_index: order,
      content: content,
      published: published,
    }
    if (hasSectionType) {
      section.section_type = type
    }
    if (hasComponentType) {
      section.component_type = type
    }
    return section
  }

  const sections = [
    createSection('pricing-hero', 0, {
      title: 'Affordable Pricing',
      subtitle: 'Pay only for what you use. No hidden fees, no surprises.',
      badge: {
        icon: 'sparkles',
        text: 'Transparent Pricing',
      },
    }, true),
    createSection('pricing-plans', 1, {
      plans: [
        {
          name: 'Platform Access',
          price: 10,
          currency: 'INR',
          billing_period: 'month',
          features: [
            'AI-powered matching algorithm',
            'Advanced profile customization',
            'Photo verification',
            'Smart conversation starters',
            'Read receipts',
            'Priority support',
            'Ad-free experience',
            'Enhanced privacy controls',
          ],
          is_popular: false,
          order_index: 0,
        },
      ],
    }, true),
    createSection('free-messages', 2, {
      title: 'First 3 Messages Free Per Match!',
      description: 'Start conversations with your matches without any additional cost. Your first 3 messages with each match are completely free.',
      count: 3,
    }, true),
    createSection('message-bundles', 3, {
      title: 'Message Bundles',
      subtitle: 'After your free messages, purchase message bundles to continue connecting',
      price_per_message: 10,
      gst_rate: 18,
      min_messages: 5,
      max_messages: 100,
      bundles: [
        { messages: 5, popular: false },
        { messages: 10, popular: true },
        { messages: 20, popular: false },
        { messages: 50, popular: false },
      ],
    }, true),
    createSection('pricing-info', 4, {
      title: 'How it works',
      items: [
        'Pay ₹10/month for platform access',
        'Get 3 free messages with each match',
        'Purchase message bundles as needed (minimum 5 messages for ₹50 + GST)',
        'Each message costs ₹10, bundles can be customized to your needs',
        'All prices include 18% GST',
      ],
    }, true),
    createSection('pricing-faq', 5, {
      title: 'Frequently Asked Questions',
      faqs: [
        {
          question: 'Do message bundles expire?',
          answer: 'No, your purchased message bundles never expire. Use them whenever you\'re ready to connect!',
        },
        {
          question: 'Can I cancel my subscription?',
          answer: 'Yes, you can cancel your platform subscription anytime. Your access will continue until the end of your billing period.',
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No hidden fees! The only costs are the ₹10/month platform fee and any message bundles you choose to purchase.',
        },
        {
          question: 'How do the 3 free messages work?',
          answer: 'For each match you connect with, your first 3 messages are completely free. This applies to every new match individually.',
        },
      ],
      cta_text: 'Still have questions?',
      cta_link: '/contact',
    }, true),
  ]

  let created = 0
  let skipped = 0
  let errors = 0

  for (const section of sections) {
    const sectionType = section.component_type || (section as any).section_type
    
    if (existingTypes.has(sectionType)) {
      console.log(`⏭️  Skipping ${sectionType} (already exists)`)
      skipped++
      continue
    }

    try {
      const { error } = await adminClient
        .from('sections')
        .insert(section)

      if (error) {
        console.error(`❌ Failed to create ${sectionType}:`, error.message)
        errors++
      } else {
        console.log(`✅ Created ${sectionType}`)
        created++
      }
    } catch (error: any) {
      console.error(`❌ Error creating ${sectionType}:`, error.message)
      errors++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Created: ${created}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log('\n🎉 Done!')
}

seedPricingSections().catch(console.error)

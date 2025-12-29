/**
 * Seed Pricing Page Sections
 * Creates all necessary sections for the pricing page
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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

  // Check if sections already exist
  const { data: existingSections } = await adminClient
    .from('sections')
    .select('section_type')
    .eq('page_id', pricingPageId)

  const existingTypes = new Set(existingSections?.map(s => s.section_type) || [])
  console.log(`📊 Existing sections: ${existingTypes.size > 0 ? Array.from(existingTypes).join(', ') : 'None'}\n`)

  const sections = [
    {
      section_type: 'pricing-hero',
      order_index: 0,
      content: {
        title: 'Affordable Pricing',
        subtitle: 'Pay only for what you use. No hidden fees, no surprises.',
        badge: {
          icon: 'sparkles',
          text: 'Transparent Pricing',
        },
      },
      published: true,
    },
    {
      section_type: 'pricing-plans',
      order_index: 1,
      content: {
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
      },
      published: true,
    },
    {
      section_type: 'free-messages',
      order_index: 2,
      content: {
        title: 'First 3 Messages Free Per Match!',
        description: 'Start conversations with your matches without any additional cost. Your first 3 messages with each match are completely free.',
        count: 3,
      },
      published: true,
    },
    {
      section_type: 'message-bundles',
      order_index: 3,
      content: {
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
      },
      published: true,
    },
    {
      section_type: 'pricing-info',
      order_index: 4,
      content: {
        title: 'How it works',
        items: [
          'Pay ₹10/month for platform access',
          'Get 3 free messages with each match',
          'Purchase message bundles as needed (minimum 5 messages for ₹50 + GST)',
          'Each message costs ₹10, bundles can be customized to your needs',
          'All prices include 18% GST',
        ],
      },
      published: true,
    },
    {
      section_type: 'pricing-faq',
      order_index: 5,
      content: {
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
      },
      published: true,
    },
  ]

  let created = 0
  let skipped = 0
  let errors = 0

  for (const section of sections) {
    if (existingTypes.has(section.section_type)) {
      console.log(`⏭️  Skipping ${section.section_type} (already exists)`)
      skipped++
      continue
    }

    try {
      const { error } = await adminClient
        .from('sections')
        .insert({
          page_id: pricingPageId,
          ...section,
        })

      if (error) {
        console.error(`❌ Failed to create ${section.section_type}:`, error.message)
        errors++
      } else {
        console.log(`✅ Created ${section.section_type}`)
        created++
      }
    } catch (error: any) {
      console.error(`❌ Error creating ${section.section_type}:`, error.message)
      errors++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Created: ${created}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log('\n🎉 Done!')
}

seedPricingSections()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })


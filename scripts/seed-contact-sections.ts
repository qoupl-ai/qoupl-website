/**
 * Seed Contact Page Sections
 * Creates all necessary sections for the contact page
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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

async function seedContactSections() {
  console.log('\n📧 Seeding Contact Page Sections...\n')

  const contactPageId = await getPageId('contact')
  if (!contactPageId) {
    console.error('❌ Contact page not found. Please create it first.')
    return
  }

  console.log(`✅ Found contact page with ID: ${contactPageId}\n`)

  // Check if sections already exist
  const { data: existingSections } = await adminClient
    .from('sections')
    .select('component_type')
    .eq('page_id', contactPageId)

  const existingTypes = new Set(existingSections?.map(s => s.component_type) || [])
  console.log(`📊 Existing sections: ${existingTypes.size > 0 ? Array.from(existingTypes).join(', ') : 'None'}\n`)

  const sections = [
    {
      component_type: 'contact-hero',
      order_index: 0,
      content: {
        title: 'Get in Touch',
        subtitle: 'Have questions about qoupl? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        badge: {
          icon: 'heart',
          text: 'We\'re Here to Help',
        },
      },
      published: true,
    },
    {
      component_type: 'contact-info',
      order_index: 1,
      content: {
        title: 'Contact Information',
        items: [
          {
            icon: 'mail',
            title: 'Email Us',
            details: 'support@qoupl.ai',
            link: 'mailto:support@qoupl.ai',
          },
          {
            icon: 'phone',
            title: 'Call Us',
            details: '+91 9103732229',
            link: 'tel:+919103732229',
          },
          {
            icon: 'map-pin',
            title: 'Location',
            details: 'B-98, Sector-2, Noida, UP 201301',
            link: null,
          },
        ],
      },
      published: true,
    },
    {
      component_type: 'contact-info-details',
      order_index: 2,
      content: {
        title: 'Let\'s Connect',
        description: 'Whether you have questions about features, need technical support, or just want to say hello, we\'re here for you.',
        items: [
          {
            icon: 'clock',
            title: 'Response Time',
            description: 'We typically respond within 24-48 hours during business days.',
          },
          {
            icon: 'heart',
            title: 'Support',
            description: 'Our team is dedicated to providing you with the best possible experience.',
          },
          {
            icon: 'message-square',
            title: 'Feedback',
            description: 'We value your feedback and are constantly working to improve qoupl.',
          },
        ],
        faq_link: {
          text: 'Visit FAQ',
          url: '/faq',
        },
      },
      published: true,
    },
  ]

  let created = 0
  let skipped = 0
  let errors = 0

  for (const section of sections) {
    if (existingTypes.has(section.component_type)) {
      console.log(`⏭️  Skipping ${section.component_type} (already exists)`)
      skipped++
      continue
    }

    try {
      const { error } = await adminClient
        .from('sections')
        .insert({
          page_id: contactPageId,
          ...section,
        })

      if (error) {
        console.error(`❌ Failed to create ${section.component_type}:`, error.message)
        errors++
      } else {
        console.log(`✅ Created ${section.component_type}`)
        created++
      }
    } catch (error: any) {
      console.error(`❌ Error creating ${section.component_type}:`, error.message)
      errors++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Created: ${created}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log('\n🎉 Done!')
}

seedContactSections()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })


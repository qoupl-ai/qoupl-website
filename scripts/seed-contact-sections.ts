/**
 * Seed Contact Page Sections
 * Creates all necessary sections for the contact page
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']!
const supabaseServiceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing Supabase environment variables')
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
    console.error(`ERROR: Page "${slug}" not found:`, error?.message)
    return null
  }

  return data.id
}

async function seedContactSections() {
  console.log('\nINFO: Seeding Contact Page Sections...\n')

  const contactPageId = await getPageId('contact')
  if (!contactPageId) {
    console.error('ERROR: Contact page not found. Please create it first.')
    return
  }

  console.log(`OK: Found contact page with ID: ${contactPageId}\n`)

  const { data: existingSections } = await adminClient
    .from('sections')
    .select('id, section_type, content')
    .eq('page_id', contactPageId)

  const existingSectionMap = new Map(
    (existingSections || []).map((section) => [section.section_type, section])
  )
  console.log(
    `INFO: Existing sections: ${
      existingSectionMap.size > 0 ? Array.from(existingSectionMap.keys()).join(', ') : 'None'
    }\n`
  )

  const isObject = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === 'object' && !Array.isArray(value)

  const mergeContent = (
    base: Record<string, unknown>,
    override: Record<string, unknown>
  ): Record<string, unknown> => {
    const result: Record<string, unknown> = { ...base }

    Object.entries(override).forEach(([key, value]) => {
      if (isObject(value) && isObject(result[key])) {
        result[key] = mergeContent(result[key] as Record<string, unknown>, value)
      } else {
        result[key] = value
      }
    })

    return result
  }

  const sections = [
    {
      section_type: 'contact-hero',
      order_index: 0,
      content: {
        title: 'Get in Touch',
        subtitle: 'Have questions about qoupl? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
        badge: {
          icon: 'heart',
          text: 'We\'re Here to Help',
          show: true,
        },
      },
      published: true,
    },
    {
      section_type: 'contact-info',
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
      section_type: 'contact-info-details',
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
          icon: 'ArrowLeft',
          title: 'Looking for quick answers?',
          description: 'Check out our FAQ page for instant answers to common questions.',
          show: true,
        },
        form: {
          title: 'Send us a Message',
          required_indicator: '*',
          name_label: 'Your Name',
          name_placeholder: 'John Doe',
          email_label: 'Email Address',
          email_placeholder: 'john@example.com',
          subject_label: 'Subject',
          subject_placeholder: 'How can we help?',
          message_label: 'Message',
          message_placeholder: 'Tell us more about your inquiry...',
          submit_text: 'Send Message',
          submit_icon: 'Send',
          sending_text: 'Sending...',
          success_title: 'Message Sent!',
          success_message: 'Thank you for contacting us. We\'ll get back to you soon.',
          success_icon: 'CheckCircle',
          error_message: 'Failed to send message. Please try again.',
          toast_success: 'Message sent successfully!',
          toast_error: 'Failed to send message. Please try again.',
          show: true,
        },
      },
      published: true,
    },
  ]

  let created = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const section of sections) {
    const existing = existingSectionMap.get(section.section_type)

    try {
      if (!existing) {
        const { error } = await adminClient.from('sections').insert({
          page_id: contactPageId,
          ...section,
        })

        if (error) {
          console.error(`ERROR: Failed to create ${section.section_type}:`, error.message)
          errors++
        } else {
          console.log(`OK: Created ${section.section_type}`)
          created++
        }
        continue
      }

      const existingContent = isObject(existing.content) ? existing.content : {}
      const mergedContent = mergeContent(section.content, existingContent)

      const { error } = await adminClient
        .from('sections')
        .update({ content: mergedContent })
        .eq('id', existing.id)

      if (error) {
        console.error(`ERROR: Failed to update ${section.section_type}:`, error.message)
        errors++
      } else {
        console.log(`OK: Updated ${section.section_type}`)
        updated++
      }
    } catch (error: any) {
      console.error(`ERROR: Error syncing ${section.section_type}:`, error.message)
      errors++
    }
  }

  if (sections.length === 0) {
    console.log('SKIP: No sections to create (empty config)')
    skipped++
  }

  console.log('\nSUMMARY:')
  console.log(`   OK Created: ${created}`)
  console.log(`   OK Updated: ${updated}`)
  console.log(`   OK Skipped: ${skipped}`)
  console.log(`   ERROR Errors: ${errors}`)
  console.log('\nDONE')
}

seedContactSections()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('ERROR: Fatal error:', error)
    process.exit(1)
  })

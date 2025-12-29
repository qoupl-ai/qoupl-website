/**
 * Seed About Page Sections
 * Creates all necessary sections for the about page
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

async function seedAboutSections() {
  console.log('\nINFO: Seeding About Page Sections...\n')

  const aboutPageId = await getPageId('about')
  if (!aboutPageId) {
    console.error('ERROR: About page not found. Please create it first.')
    return
  }

  console.log(`OK: Found about page with ID: ${aboutPageId}\n`)

  const { data: existingSections } = await adminClient
    .from('sections')
    .select('id, section_type, content')
    .eq('page_id', aboutPageId)

  const sections = existingSections || []

  const hasSectionType = (type: string) =>
    sections.some((section) => section.section_type === type)

  const hasMissionVisionValues = sections.some(
    (section) =>
      section.section_type === 'values' &&
      (section.content as Record<string, unknown>)?.['useMissionVisionLayout'] === true
  )

  const hasCoreValues = sections.some(
    (section) =>
      section.section_type === 'values' &&
      (section.content as Record<string, unknown>)?.['useMissionVisionLayout'] !== true
  )

  const sectionsToCreate = [] as Array<{
    section_type: string
    order_index: number
    content: Record<string, unknown>
    published: boolean
  }>

  if (!hasSectionType('hero')) {
    sectionsToCreate.push({
      section_type: 'hero',
      order_index: 0,
      content: {
        title: 'Building the Future of Love',
        titleHighlight: 'Future',
        description:
          "qoupl is revolutionizing how people connect. Through advanced AI matching and a commitment to authentic relationships, we're creating a platform where meaningful connections happen naturally.",
        showDescription: true,
        badge: {
          icon: 'Sparkles',
          text: 'Our Story',
          show: true,
        },
        stats: [
          {
            icon: 'Users',
            text: '10,000+ Waitlist',
            show: true,
          },
          {
            icon: 'Globe',
            text: 'Launching in India',
            show: true,
          },
        ],
        images: {
          grid: [
            {
              image: 'couple-photos/qoupl_couple_01.jpg',
              alt: 'Happy couple',
            },
            {
              image: 'couple-photos/qoupl_couple_02.jpg',
              alt: 'Couple together',
            },
            {
              image: 'couple-photos/qoupl_couple_03.jpg',
              alt: 'Smiling couple',
            },
            {
              image: 'couple-photos/qoupl_couple_04.jpg',
              alt: 'Book loving couple',
            },
          ],
        },
        floatingBadge: {
          value: '10,000+',
          label: 'On Waitlist',
          icon: 'Heart',
          show: true,
        },
      },
      published: true,
    })
  }

  if (!hasMissionVisionValues) {
    sectionsToCreate.push({
      section_type: 'values',
      order_index: 1,
      content: {
        useMissionVisionLayout: true,
        values: [
          {
            label: 'Our Mission',
            labelIcon: 'Target',
            title: 'Bringing People Together',
            description:
              'At qoupl, we believe that everyone deserves to find love and meaningful connections. Our mission is to leverage cutting-edge AI technology to match compatible people while maintaining the authenticity and magic of human connection.',
            body: [
              "We're committed to creating a safe, inclusive, and trustworthy platform where people can be themselves and find their perfect match.",
            ],
            icon: 'Target',
            show: true,
          },
          {
            label: 'Our Vision',
            labelIcon: 'Eye',
            title: 'The Future of Dating',
            description:
              "We envision a world where finding love is accessible, safe, and enjoyable for everyone, regardless of their background or location. Through continuous innovation and user-centric design, we're building the world's most trusted dating platform.",
            body: [
              "Our vision extends beyond just matching - we want to foster lasting relationships that enrich lives and create countless success stories.",
            ],
            icon: 'Eye',
            show: true,
          },
        ],
      },
      published: true,
    })
  }

  if (!hasCoreValues) {
    sectionsToCreate.push({
      section_type: 'values',
      order_index: 2,
      content: {
        title: 'Our Core Values',
        titleHighlight: 'Values',
        subtitle: 'These principles guide everything we do at qoupl',
        badge: {
          icon: 'Sparkles',
          text: 'What Drives Us',
          show: true,
        },
        values: [],
      },
      published: true,
    })
  }

  if (!hasSectionType('timeline')) {
    sectionsToCreate.push({
      section_type: 'timeline',
      order_index: 3,
      content: {
        title: 'From Idea to Reality',
        titleHighlight: 'Reality',
        subtitle: 'Transforming the way people connect and find love',
        badge: {
          icon: 'Rocket',
          text: 'Our Journey',
          show: true,
        },
        itemIcon: 'TrendingUp',
        showItemIcon: true,
        timeline: [],
      },
      published: true,
    })
  }

  if (!hasSectionType('why-join')) {
    sectionsToCreate.push({
      section_type: 'why-join',
      order_index: 4,
      content: {
        title: 'Why Choose qoupl?',
        titleHighlight: 'qoupl',
        badge: {
          icon: 'Zap',
          text: 'What Makes Us Different',
          show: true,
        },
        items: [
          {
            title: 'AI-Powered Matching',
            description:
              'Our advanced algorithm learns your preferences and suggests highly compatible matches.',
            icon: 'Sparkles',
            color: 'from-purple-500 to-indigo-500',
            show: true,
          },
          {
            title: 'Verified Profiles',
            description: 'Photo verification and ID checks ensure you\'re talking to real people.',
            icon: 'Shield',
            color: 'from-blue-500 to-cyan-500',
            show: true,
          },
          {
            title: 'Safe & Secure',
            description: 'End-to-end encryption and 24/7 moderation keep your data and conversations private.',
            icon: 'Shield',
            color: 'from-green-500 to-emerald-500',
            show: true,
          },
          {
            title: 'Inclusive Platform',
            description: 'Everyone is welcome. We celebrate diversity and promote inclusivity.',
            icon: 'Users',
            color: 'from-pink-500 to-rose-500',
            show: true,
          },
          {
            title: 'Smart Features',
            description: 'Smart conversation starters, messaging tools, and date planning features make connecting easy.',
            icon: 'Zap',
            color: 'from-orange-500 to-amber-500',
            show: true,
          },
          {
            title: 'Love Stories',
            description: 'Join thousands of couples who found love through qoupl.',
            icon: 'Heart',
            color: 'from-red-500 to-pink-500',
            show: true,
          },
        ],
      },
      published: true,
    })
  }

  if (!hasSectionType('app-download')) {
    sectionsToCreate.push({
      section_type: 'app-download',
      order_index: 5,
      content: {
        title: 'Ready to Find Your Perfect Match?',
        subtitle: 'Be part of the next generation of dating and find meaningful connections',
        badge: {
          icon: 'Heart',
          text: 'Join Our Community',
          show: true,
        },
        cta: {
          text: 'Join the Waitlist',
          icon: 'Heart',
          show: true,
          secondaryText: 'Learn More',
          secondaryLink: '/community-guidelines',
          showSecondary: true,
        },
      },
      published: true,
    })
  }

  let created = 0
  let skipped = 0
  let errors = 0

  for (const section of sectionsToCreate) {
    try {
      const { error } = await adminClient
        .from('sections')
        .insert({
          page_id: aboutPageId,
          ...section,
        })

      if (error) {
        console.error(`ERROR: Failed to create ${section.section_type}:`, error.message)
        errors++
      } else {
        console.log(`OK: Created ${section.section_type}`)
        created++
      }
    } catch (error: any) {
      console.error(`ERROR: Error creating ${section.section_type}:`, error.message)
      errors++
    }
  }

  if (sectionsToCreate.length === 0) {
    console.log('SKIP: No sections to create (all required sections already exist)')
    skipped++
  }

  console.log('\nSUMMARY:')
  console.log(`   OK Created: ${created}`)
  console.log(`   OK Skipped: ${skipped}`)
  console.log(`   ERROR Errors: ${errors}`)
  console.log('\nDONE')
}

seedAboutSections()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('ERROR: Fatal error:', error)
    process.exit(1)
  })

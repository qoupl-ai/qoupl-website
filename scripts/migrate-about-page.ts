/**
 * About Page Migration Script
 *
 * Migrates about page content to Supabase:
 * - Values section
 * - Timeline section
 *
 * Usage:
 *   npx ts-node --project tsconfig.node.json scripts/migrate-about-page.ts
 * OR
 *   npm run migrate:about
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

/**
 * Get or create the 'about' page
 */
async function ensureAboutPage() {
  console.log('📄 Ensuring about page exists...')

  const { data: existingPage, error: fetchError } = await adminClient
    .from('pages')
    .select('id')
    .eq('slug', 'about')
    .maybeSingle()

  if (fetchError) {
    console.error('❌ Error fetching about page:', fetchError.message)
    throw fetchError
  }

  if (existingPage) {
    console.log(`✅ About page found (ID: ${existingPage.id})`)
    return existingPage.id
  }

  // Create about page if it doesn't exist
  const { data: newPage, error: createError } = await adminClient
    .from('pages')
    .insert({
      slug: 'about',
      title: 'About Us',
      description: 'Learn about qoupl\'s mission to revolutionize dating',
      published: true,
    })
    .select('id')
    .single()

  if (createError) {
    console.error('❌ Error creating about page:', createError.message)
    throw createError
  }

  console.log(`✅ About page created (ID: ${newPage.id})`)
  return newPage.id
}

/**
 * Upsert a section (update if exists, insert if not)
 */
async function upsertSection(
  pageId: string,
  componentType: string,
  orderIndex: number,
  content: Record<string, any>
) {
  // Check which column name the database uses
  const { data: sample } = await adminClient
    .from('sections')
    .select('*')
    .limit(1)
    .maybeSingle()

  const hasSectionType = sample && 'section_type' in sample
  const hasComponentType = sample && 'component_type' in sample

  // Check if section exists
  const { data: existingSection } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', pageId)
    .or(hasSectionType ? `section_type.eq.${componentType}` : `component_type.eq.${componentType}`)
    .maybeSingle()

  const sectionData: any = {
    content,
    order_index: orderIndex,
    published: true,
  }

  // Set both column names if both exist
  if (hasSectionType) {
    sectionData.section_type = componentType
  }
  if (hasComponentType) {
    sectionData.component_type = componentType
  }

  if (existingSection) {
    // Update existing section
    sectionData.updated_at = new Date().toISOString()

    const { error } = await adminClient
      .from('sections')
      .update(sectionData)
      .eq('id', existingSection.id)

    if (error) {
      console.error(`❌ Error updating ${componentType}:`, error.message)
      return false
    }

    console.log(`✅ Updated ${componentType} section`)
  } else {
    // Insert new section
    sectionData.page_id = pageId

    const { error } = await adminClient
      .from('sections')
      .insert(sectionData)

    if (error) {
      console.error(`❌ Error inserting ${componentType}:`, error.message)
      return false
    }

    console.log(`✅ Created ${componentType} section`)
  }

  return true
}

/**
 * Main Migration Function
 */
async function migrateAboutPage() {
  console.log('📖 Starting about page migration...\n')

  try {
    // Ensure about page exists
    const pageId = await ensureAboutPage()
    console.log('')

    // ========================================================================
    // HERO SECTION
    // ========================================================================
    console.log('🦸 Migrating hero section...')

    const heroContent = {
      badge: 'Our Story',
      title: 'Building the Future of Love',
      description:
        'qoupl is revolutionizing how people connect. Through advanced AI matching and a commitment to authentic relationships, we\'re creating a platform where meaningful connections happen naturally.',
      locationBadge: {
        flag: '🇮🇳',
        text: 'Launching in India',
      },
      images: [
        'couple-photos/qoupl_couple_01.jpg',
        'couple-photos/qoupl_couple_02.jpg',
        'couple-photos/qoupl_couple_03.jpg',
      ],
    }

    await upsertSection(pageId, 'hero', 0, heroContent)
    console.log('')

    // ========================================================================
    // VALUES SECTION
    // ========================================================================
    console.log('💎 Migrating values section...')

    const valuesContent = {
      values: [
        {
          icon: 'Heart',
          title: 'Authenticity First',
          description:
            'We believe in genuine connections. Every profile is verified, every match is real, and every conversation has the potential to be meaningful.',
        },
        {
          icon: 'Shield',
          title: 'Safety & Trust',
          description:
            'Your safety is our priority. With college ID verification, photo verification, and 24/7 moderation, we create a secure environment for authentic relationships.',
        },
        {
          icon: 'Sparkles',
          title: 'Innovation in Love',
          description:
            'Combining cutting-edge AI with human understanding, we\'re reimagining how people find and build lasting relationships in the modern world.',
        },
        {
          icon: 'Users',
          title: 'Community Driven',
          description:
            'Built by college students, for college students. We listen to our community and evolve based on what matters most to you.',
        },
      ],
    }

    await upsertSection(pageId, 'values', 1, valuesContent)
    console.log('')

    // ========================================================================
    // TIMELINE SECTION
    // ========================================================================
    console.log('📅 Migrating timeline section...')

    const timelineContent = {
      timeline: [
        {
          year: '2024',
          event: 'The Vision',
          description:
            'qoupl was born from a simple idea: college students deserve a dating platform that prioritizes authentic connections and safety. We started building a solution that goes beyond superficial swipes.',
        },
        {
          year: 'Q1 2025',
          event: 'Beta Launch',
          description:
            'Successfully launched closed beta program with select college campuses. Early users helped us refine the AI matching algorithm and safety features, providing invaluable feedback.',
        },
        {
          year: 'Q2 2025',
          event: 'India Launch',
          description:
            'Public launch across major Indian colleges and universities. Bringing our vision of meaningful connections to millions of college students nationwide.',
        },
        {
          year: 'Future',
          event: 'Global Expansion',
          description:
            'Expanding to college campuses worldwide, helping students across the globe find genuine connections and meaningful relationships.',
        },
      ],
    }

    await upsertSection(pageId, 'timeline', 2, timelineContent)
    console.log('')

    // ========================================================================
    // MISSION & VISION SECTION
    // ========================================================================
    console.log('🎯 Migrating mission & vision section...')

    const missionVisionContent = {
      mission: {
        badge: 'Our Mission',
        title: 'Bringing People Together',
        content: [
          'At qoupl, we believe that everyone deserves to find love and meaningful connections. Our mission is to leverage cutting-edge AI technology to match compatible people while maintaining the authenticity and magic of human connection.',
          'We\'re committed to creating a safe, inclusive, and trustworthy platform where people can be themselves and find their perfect match.',
        ],
      },
      vision: {
        badge: 'Our Vision',
        title: 'The Future of Dating',
        content: [
          'We envision a world where finding love is accessible, safe, and enjoyable for everyone, regardless of their background or location. Through continuous innovation and user-centric design, we\'re building the world\'s most trusted dating platform.',
          'Our vision extends beyond just matching—we want to foster lasting relationships that enrich lives and create countless success stories.',
        ],
      },
    }

    await upsertSection(pageId, 'mission-vision', 3, missionVisionContent)
    console.log('')

    // ========================================================================
    // WHY CHOOSE US SECTION
    // ========================================================================
    console.log('✨ Migrating why-choose-us section...')

    const whyChooseUsContent = {
      badge: 'What Makes Us Different',
      title: 'Why Choose qoupl?',
      features: [
        {
          icon: 'Sparkles',
          title: 'AI-Powered Matching',
          description: 'Our advanced algorithm learns your preferences and suggests highly compatible matches.',
        },
        {
          icon: 'Shield',
          title: 'Verified Profiles',
          description: 'Photo verification and ID checks ensure you\'re talking to real people.',
        },
        {
          icon: 'Shield',
          title: 'Safe & Secure',
          description: 'End-to-end encryption and 24/7 moderation keep your data and conversations private.',
        },
        {
          icon: 'Users',
          title: 'Inclusive Platform',
          description: 'Everyone is welcome. We celebrate diversity and promote inclusivity.',
        },
        {
          icon: 'Zap',
          title: 'Smart Features',
          description: 'Smart conversation starters, messaging tools, and date planning features make connecting easy.',
        },
        {
          icon: 'Heart',
          title: 'Love Stories',
          description: 'Join thousands of couples who found love through qoupl.',
        },
      ],
    }

    await upsertSection(pageId, 'why-choose-us', 4, whyChooseUsContent)
    console.log('')

    // ========================================================================
    // CTA SECTION
    // ========================================================================
    console.log('📣 Migrating CTA section...')

    const ctaContent = {
      badge: 'Join Our Community',
      title: 'Ready to Find Your Perfect Match?',
      description: 'Be part of the next generation of dating and find meaningful connections',
      buttons: [
        {
          text: 'Join the Waitlist',
          type: 'primary',
        },
        {
          text: 'Learn More',
          type: 'outline',
          href: '/community-guidelines',
        },
      ],
    }

    await upsertSection(pageId, 'cta', 5, ctaContent)
    console.log('')

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('═'.repeat(70))
    console.log('✅ ABOUT PAGE MIGRATION COMPLETE')
    console.log('═'.repeat(70))
    console.log('Migrated sections:')
    console.log('  ✓ Hero (title, description, images)')
    console.log('  ✓ Values (4 core values)')
    console.log('  ✓ Timeline (4 milestones)')
    console.log('  ✓ Mission & Vision')
    console.log('  ✓ Why Choose Us (6 features)')
    console.log('  ✓ CTA (call to action)')
    console.log('\nNext steps:')
    console.log('  - Verify content in Supabase dashboard')
    console.log('  - Update about-client.tsx to use database content')
    console.log('  - Run all migrations: npm run migrate:all')
    console.log('═'.repeat(70))

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateAboutPage()
  .then(() => {
    console.log('\n✅ About page migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ About page migration failed:', error)
    process.exit(1)
  })

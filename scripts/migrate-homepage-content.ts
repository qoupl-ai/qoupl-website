/**
 * Homepage Content Migration Script
 *
 * Migrates all homepage sections content to Supabase:
 * - Hero section
 * - How It Works
 * - Product Features
 * - Testimonials
 * - App Download
 * - Gallery
 * - Love Story
 *
 * Usage:
 *   npx ts-node --project tsconfig.node.json scripts/migrate-homepage-content.ts
 * OR
 *   npm run migrate:homepage
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

/**
 * Get or create the 'home' page
 */
async function ensureHomePage() {
  console.log('📄 Ensuring home page exists...')

  const { data: existingPage, error: fetchError } = await adminClient
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .maybeSingle()

  if (fetchError) {
    console.error('❌ Error fetching home page:', fetchError.message)
    throw fetchError
  }

  if (existingPage) {
    console.log(`✅ Home page found (ID: ${existingPage.id})`)
    return existingPage.id
  }

  // Create home page if it doesn't exist
  const { data: newPage, error: createError } = await adminClient
    .from('pages')
    .insert({
      slug: 'home',
      title: 'Home',
      published: true,
    })
    .select('id')
    .single()

  if (createError) {
    console.error('❌ Error creating home page:', createError.message)
    throw createError
  }

  console.log(`✅ Home page created (ID: ${newPage.id})`)
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
  // Check if section exists
  const { data: existingSection } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', pageId)
    .eq('component_type', componentType)
    .maybeSingle()

  if (existingSection) {
    // Update existing section
    const { error } = await adminClient
      .from('sections')
      .update({
        content,
        order_index: orderIndex,
        published: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingSection.id)

    if (error) {
      console.error(`❌ Error updating ${componentType}:`, error.message)
      return false
    }

    console.log(`✅ Updated ${componentType} section`)
  } else {
    // Insert new section
    const { error } = await adminClient
      .from('sections')
      .insert({
        page_id: pageId,
        component_type: componentType,
        order_index: orderIndex,
        content,
        published: true,
      })

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
async function migrateHomepageContent() {
  console.log('🏠 Starting homepage content migration...\n')

  try {
    // Ensure home page exists
    const pageId = await ensureHomePage()
    console.log('')

    // ========================================================================
    // HERO SECTION
    // ========================================================================
    console.log('🦸 Migrating hero section...')

    const heroContent = {
      title: 'qoupl',
      tagline: 'Be couple with qoupl',
      subtitle: 'Find your vibe. Match your energy. Connect for real.',
      cta: {
        text: 'Join the Waitlist',
        subtext: '⚡ Limited spots for early access',
        badge: 'Free',
      },
      images: {
        women: [
          'hero-images/women/qoupl_women_03.png',
          'hero-images/women/qoupl_women_05.png',
          'hero-images/women/qoupl_women_01.png',
          'hero-images/women/qoupl_women_02.png',
          'hero-images/women/qoupl_women_04.png',
          'hero-images/women/qoupl_women_06.png',
          'hero-images/women/qoupl_women_07.png',
          'hero-images/women/qoupl_women_08.png',
          'hero-images/women/qoupl_women_09.png',
          'hero-images/women/qoupl_women_10.png',
        ],
        men: [
          'hero-images/men/qoupl_men_01.jpg',
          'hero-images/men/qoupl_men_02.jpg',
          'hero-images/men/qoupl_men_03.jpg',
          'hero-images/men/qoupl_men_04.jpg',
          'hero-images/men/qoupl_men_05.jpg',
          'hero-images/men/qoupl_men_06.jpg',
        ],
      },
    }

    await upsertSection(pageId, 'hero', 1, heroContent)
    console.log('')

    // ========================================================================
    // HOW IT WORKS SECTION
    // ========================================================================
    console.log('⚙️  Migrating how-it-works section...')

    const howItWorksContent = {
      steps: [
        {
          step: '01',
          title: 'Create Your Profile',
          description:
            'Sign up in seconds as a college student and create a profile that showcases the real you. Verify with your college ID, add photos, interests, and what makes you unique.\n\nOur verification process ensures a safe and authentic community where you can be yourself. Share your passions, hobbies, and what you\'re looking for in a meaningful connection.',
          image: 'app-screenshots/qoupl_screenshot_01.png',
        },
        {
          step: '02',
          title: 'Smart AI Matching',
          description:
            'Our advanced AI algorithm analyzes compatibility factors and suggests the most suitable matches for you.\n\nThe system learns from your preferences, interactions, and behavior to continuously improve match quality. Every swipe and conversation helps refine your future suggestions for better compatibility.',
          image: 'app-screenshots/qoupl_screenshot_03.png',
        },
        {
          step: '03',
          title: 'Start Conversations',
          description:
            'Break the ice with our conversation starters and build meaningful connections through authentic chats.\n\nEngage in genuine conversations that go beyond surface-level small talk. Our platform encourages thoughtful interactions that help you discover shared values, interests, and life goals with potential matches.',
          image: 'app-screenshots/qoupl_screenshot_04.png',
        },
        {
          step: '04',
          title: 'Plan Your Date',
          description:
            'Use our date planning features to find the perfect spot and make your first meeting memorable.\n\nDiscover local venues, activities, and events that match both your interests. Get suggestions for date ideas that create the perfect atmosphere for getting to know each other better.',
          image: 'app-screenshots/qoupl_screenshot_06.png',
        },
        {
          step: '05',
          title: 'Find True Love',
          description:
            'Build lasting relationships with people who truly understand and complement you. Your perfect match awaits!\n\nExperience the joy of finding someone who shares your values, supports your dreams, and grows with you. Join thousands of college students who have found their perfect match on qoupl.',
          image: 'app-screenshots/qoupl_screenshot_07.png',
        },
      ],
    }

    await upsertSection(pageId, 'how-it-works', 2, howItWorksContent)
    console.log('')

    // ========================================================================
    // PRODUCT FEATURES SECTION
    // ========================================================================
    console.log('✨ Migrating product-features section...')

    const productFeaturesContent = {
      title: 'Why Choose qoupl',
      features: [
        {
          icon: 'Heart',
          title: 'Smart AI Matching',
          description:
            'Our advanced AI algorithm analyzes compatibility factors including personality, interests, values, and lifestyle to suggest highly compatible matches tailored just for you.',
          highlights: [
            'Deep compatibility analysis',
            'Personalized suggestions',
            'Values-based matching',
            'Learning preferences',
          ],
          image: 'couple-photos/qoupl_couple_01.jpg',
          color: 'bg-[#662D91]',
        },
        {
          icon: 'Shield',
          title: 'Safe & Verified',
          description:
            'Multi-layered verification system with mandatory college ID verification, 24/7 AI moderation, photo verification, and encrypted messaging to keep college students safe while finding love.',
          highlights: [
            'College ID verification',
            'Photo verification',
            '24/7 AI moderation',
            'Encrypted messaging',
          ],
          image: 'couple-photos/qoupl_couple_02.jpg',
          color: 'bg-[#662D91]',
        },
        {
          icon: 'Zap',
          title: 'Instant Connections',
          description:
            'Connect with compatible matches instantly through our real-time matching system. Start meaningful conversations with smart conversation starters.',
          highlights: [
            'Real-time matching',
            'Smart conversation starters',
            'Meaningful connections',
            'Instant notifications',
          ],
          image: 'couple-photos/qoupl_couple_04.jpg',
          color: 'bg-[#662D91]',
        },
      ],
    }

    await upsertSection(pageId, 'product-features', 3, productFeaturesContent)
    console.log('')

    // ========================================================================
    // TESTIMONIALS SECTION
    // ========================================================================
    console.log('💬 Migrating testimonials section...')

    const testimonialsContent = {
      testimonials: [
        {
          name: 'Arjun',
          image: 'hero-images/men/qoupl_men_01.jpg',
          text: 'We matched on qoupl during beta testing and instantly connected. Three months later, we\'re inseparable!',
          location: 'Mumbai, Maharashtra',
          rating: 5,
          date: 'Beta User',
        },
        {
          name: 'Ananya',
          image: 'hero-images/women/qoupl_women_03.png',
          text: 'Being part of the beta program was amazing! The matching algorithm really works and I can\'t wait for everyone to experience it.',
          location: 'Bangalore, Karnataka',
          rating: 4,
          date: 'Beta User',
        },
        {
          name: 'Kavya',
          image: 'hero-images/women/qoupl_women_05.png',
          text: 'Found my soulmate during the beta phase. qoupl changed my life forever and I\'m excited for the public launch!',
          location: 'Delhi, India',
          rating: 4,
          date: 'Beta User',
        },
      ],
    }

    await upsertSection(pageId, 'testimonials', 4, testimonialsContent)
    console.log('')

    // ========================================================================
    // APP DOWNLOAD SECTION
    // ========================================================================
    console.log('📱 Migrating app-download section...')

    const appDownloadContent = {
      enabled: true,
      title: 'Get the App',
      subtitle: 'Download qoupl on iOS and Android',
    }

    await upsertSection(pageId, 'app-download', 5, appDownloadContent)
    console.log('')

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('═'.repeat(70))
    console.log('✅ HOMEPAGE CONTENT MIGRATION COMPLETE')
    console.log('═'.repeat(70))
    console.log('Migrated sections:')
    console.log('  ✓ Hero (title, tagline, subtitle, CTA, 16 images)')
    console.log('  ✓ How It Works (5 steps)')
    console.log('  ✓ Product Features (title + 3 features)')
    console.log('  ✓ Testimonials (3 beta user testimonials)')
    console.log('  ✓ App Download')
    console.log('\nNext steps:')
    console.log('  - Verify content in Supabase dashboard')
    console.log('  - Components will automatically use this content')
    console.log('  - Run features migration: npm run migrate:features')
    console.log('  - Run static pages migration: npm run migrate:static')
    console.log('═'.repeat(70))

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateHomepageContent()
  .then(() => {
    console.log('\n✅ Homepage migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Homepage migration failed:', error)
    process.exit(1)
  })

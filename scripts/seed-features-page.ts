/**
 * Seed Features Page
 * 
 * Creates the features page section if it doesn't exist
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function seedFeaturesPage() {
  console.log('\n🌱 Seeding Features Page...\n')

  // Get or create features page
  let { data: featuresPage, error: pageError } = await adminClient
    .from('pages')
    .select('id, slug, title')
    .eq('slug', 'features')
    .single()

  if (pageError || !featuresPage) {
    // Create the page
    const { data: newPage, error: createError } = await adminClient
      .from('pages')
      .insert({
        slug: 'features',
        title: 'Features',
        description: 'Discover qoupl\'s powerful features',
        published: true,
      })
      .select('id, slug, title')
      .single()

    if (createError || !newPage) {
      console.error('❌ Failed to create features page:', createError?.message)
      return
    }

    featuresPage = newPage
    console.log(`✅ Created features page: ${featuresPage.title}`)
  } else {
    console.log(`✅ Found features page: ${featuresPage.title}`)
  }

  // Check which column name the database uses
  const { data: sample } = await adminClient
    .from('sections')
    .select('*')
    .limit(1)
    .maybeSingle()

  const hasSectionType = sample && 'section_type' in sample
  const hasComponentType = sample && 'component_type' in sample
  
  console.log(`📊 Database columns: section_type=${hasSectionType}, component_type=${hasComponentType}`)

  // Check if section already exists
  const { data: existingSection } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', featuresPage.id)
    .or(hasSectionType ? 'section_type.eq.feature-category' : 'component_type.eq.feature-category')
    .maybeSingle()

  if (existingSection) {
    console.log('⏭️  Features section already exists, skipping')
    return
  }

  // Create features section
  const featuresSection: any = {
    page_id: featuresPage.id,
    order_index: 1,
    content: {
      features: [
        {
          id: 'matching',
          title: 'Smart Matching',
          icon: 'Sparkles',
          color: 'bg-[#662D91]',
          image: 'app-screenshots/qoupl_screenshot_03.png',
          coupleImage: 'couple-photos/qoupl_couple_01.jpg',
          features: [
            { icon: 'Sparkles', title: 'AI-Powered Algorithm', description: 'Advanced compatibility analysis based on personality, interests, and values' },
            { icon: 'Star', title: 'Compatibility Score', description: 'See how well you match with potential partners before connecting' },
            { icon: 'Heart', title: 'Learning Preferences', description: 'Algorithm improves as you use the app, understanding your type better' },
            { icon: 'Filter', title: 'Smart Filters', description: 'Filter by age, location, education, lifestyle preferences and more' },
          ],
        },
        {
          id: 'safety',
          title: 'Safety & Trust',
          icon: 'Shield',
          color: 'bg-[#662D91]',
          image: 'app-screenshots/qoupl_screenshot_01.png',
          coupleImage: 'couple-photos/qoupl_couple_02.jpg',
          features: [
            { icon: 'Camera', title: 'Photo Verification', description: 'Real-time selfie verification to confirm identity and get verified badge' },
            { icon: 'Shield', title: 'College ID Verification', description: 'Mandatory college ID verification to ensure all users are current college students' },
            { icon: 'Lock', title: 'End-to-End Encryption', description: 'All messages encrypted to protect your privacy' },
            { icon: 'Bell', title: '24/7 AI Moderation', description: 'Automated and human review of content for safety' },
          ],
        },
        {
          id: 'communication',
          title: 'Rich Communication',
          icon: 'MessageCircle',
          color: 'bg-[#662D91]',
          image: 'app-screenshots/qoupl_screenshot_04.png',
          coupleImage: 'couple-photos/qoupl_couple_04.jpg',
          features: [
            { icon: 'MessageCircle', title: 'Smart Icebreakers', description: 'AI-generated conversation starters tailored to each match' },
            { icon: 'Camera', title: 'Photo & Video Sharing', description: 'Share moments with your matches securely' },
            { icon: 'Phone', title: 'Voice Messages', description: 'Express yourself better with voice notes' },
            { icon: 'Zap', title: 'Real-time Chat', description: 'Instant messaging with read receipts and typing indicators' },
          ],
        },
        {
          id: 'experience',
          title: 'Premium Experience',
          icon: 'Star',
          color: 'bg-[#662D91]',
          image: 'app-screenshots/qoupl_screenshot_06.png',
          coupleImage: 'couple-photos/qoupl_couple_03.jpg',
          features: [
            { icon: 'Eye', title: 'See Who Likes You', description: 'View all people who liked your profile instantly' },
            { icon: 'Zap', title: 'Profile Boost', description: 'Get more visibility by appearing at the top of search results' },
            { icon: 'MapPin', title: 'Travel Mode', description: 'Match with people in any city before you visit' },
            { icon: 'Heart', title: 'Unlimited Likes', description: 'Like as many profiles as you want without restrictions' },
          ],
        },
      ],
    },
    published: true,
  }

  // Set the correct column name(s) - set both if both exist, or the one that exists
  if (hasSectionType) {
    featuresSection.section_type = 'feature-category'
  }
  if (hasComponentType) {
    featuresSection.component_type = 'feature-category'
  }

  const { error: insertError } = await adminClient
    .from('sections')
    .insert(featuresSection)

  if (insertError) {
    console.error('❌ Failed to create features section:', insertError.message)
    return
  }

  console.log('✅ Created features section with 4 categories')
  console.log('\n🎉 Features page is now ready!\n')
}

seedFeaturesPage().catch(console.error)

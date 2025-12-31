import { createClient } from '@supabase/supabase-js'
import { join } from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function updateHowItWorksDescriptions() {
  console.log('📝 Updating How It Works section descriptions...\n')

  try {
    // Get the home page ID
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', 'home')
      .single()

    if (pageError || !page) {
      console.error('❌ Error finding home page:', pageError?.message)
      process.exit(1)
    }

    const pageId = page.id
    console.log(`✅ Found home page (ID: ${pageId})\n`)

    // Find the how-it-works section
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('id, content')
      .eq('page_id', pageId)
      .eq('component_type', 'how-it-works')
      .single()

    if (sectionError || !section) {
      console.error('❌ Error finding how-it-works section:', sectionError?.message)
      console.log('💡 Run the migrate-content-to-supabase.ts script first to create the section')
      process.exit(1)
    }

    console.log(`✅ Found how-it-works section (ID: ${section.id})\n`)

    // Update the steps with new descriptions that include second paragraphs
    const updatedSteps = [
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
    ]

    const updatedContent = {
      ...section.content,
      steps: updatedSteps,
    }

    const { error: updateError } = await supabase
      .from('sections')
      .update({ content: updatedContent })
      .eq('id', section.id)

    if (updateError) {
      console.error('❌ Error updating how-it-works section:', updateError.message)
      process.exit(1)
    }

    console.log(`✅ Successfully updated how-it-works section descriptions
  - Added second paragraph to all 5 steps
  - Each step now has two paragraphs separated by \\n\\n`)
    console.log('\n🎉 Done!\n')
  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message)
    process.exit(1)
  }
}

updateHowItWorksDescriptions()


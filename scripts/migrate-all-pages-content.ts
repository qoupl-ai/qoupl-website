/**
 * Migration Script: Migrate All Pages Content to Database
 * 
 * Migrates content for FAQ, About, Pricing, Features pages to sections table.
 * 
 * Run: ts-node --project tsconfig.node.json scripts/migrate-all-pages-content.ts
 */

import * as dotenv from 'dotenv'
import { join } from 'path'

// Load environment variables BEFORE importing adminClient
dotenv.config({ path: join(process.cwd(), '.env.local') })

// Now import adminClient after env vars are loaded
import { adminClient } from '../lib/supabase/admin'

async function getPageId(slug: string): Promise<string | null> {
  const { data, error } = await adminClient
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error(`❌ Page not found: ${slug}`, error?.message)
    return null
  }

  return data.id
}

async function migrateFAQPage() {
  console.log('\n❓ Migrating FAQ page content...\n')

  const faqPageId = await getPageId('faq')
  if (!faqPageId) {
    console.error('❌ FAQ page not found, skipping')
    return
  }

  // Check if already migrated
  const { data: existing } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', faqPageId)
    .eq('component_type', 'faq-category')
    .single()

  if (existing) {
    console.log('⏭️  FAQ page content already migrated')
    return
  }

  // FAQ categories with questions (from the hardcoded content)
  const faqCategories = [
    {
      category_id: 'getting-started',
      faqs: [
        {
          question: "How do I create an account on qoupl?",
          answer: "qoupl is launching soon! Join our waitlist to be among the first to know when we launch on iOS and Android. Once the app is available, you'll be able to sign up with your email or phone number, complete your profile with photos and information about yourself, and start matching. The entire process will take just a few minutes."
        },
        {
          question: "Is qoupl really free to use?",
          answer: "Yes! qoupl will be free to use. You'll be able to create a profile, browse matches, and send messages. We'll also offer premium features for users who want enhanced functionality like unlimited likes, advanced filters, and more."
        },
        {
          question: "Who can use qoupl?",
          answer: "qoupl is exclusively for college students aged 18 to 25 years. You must be a current college student enrolled in a recognized college or university. During account creation, you will be required to verify your college student status using a valid college/university ID card. We only accept college ID cards for verification - no other identification documents are accepted. This verification is mandatory to ensure all users are current college students within the eligible age range."
        },
        {
          question: "How does qoupl verify profiles?",
          answer: "We require mandatory college ID verification where users must upload a valid college/university ID card to verify their student status. We also offer photo verification where users can verify their identity by taking a real-time selfie. Verified profiles get a blue checkmark badge. We use AI and human moderation to detect and remove fake profiles and ensure all users are legitimate college students."
        }
      ]
    },
    {
      category_id: 'matching-discovery',
      faqs: [
        {
          question: "How does qoupl's matching algorithm work?",
          answer: "Our AI-powered algorithm analyzes your profile information, preferences, interests, behavior, and values to suggest highly compatible matches. The more you use qoupl, the better our algorithm becomes at understanding your preferences and suggesting suitable matches."
        },
        {
          question: "Can I filter matches by specific criteria?",
          answer: "Yes! You can filter potential matches by age range, distance, height, education, religion, lifestyle choices, and more. Premium users get access to advanced filters for even more specific matching."
        },
        {
          question: "What should I do if I don't see many matches?",
          answer: "Try expanding your search radius, adjusting your age preferences, completing your profile fully with quality photos, being active on the app regularly, and verifying your profile to appear more trustworthy to potential matches."
        },
        {
          question: "Can I undo a swipe or like?",
          answer: "Yes! Premium users can use the 'Rewind' feature to undo their last swipe. This is especially helpful if you accidentally swiped left on someone you were interested in."
        }
      ]
    },
    {
      category_id: 'messaging-communication',
      faqs: [
        {
          question: "How do I start a conversation?",
          answer: "Once you match with someone, you can start chatting immediately. We recommend using our AI-powered conversation starters or referencing something from their profile to make a great first impression."
        },
        {
          question: "Are my messages private and secure?",
          answer: "Absolutely! All messages on qoupl are encrypted end-to-end, meaning only you and your match can read them. We take your privacy seriously and never read your private conversations."
        },
        {
          question: "Can I send photos in messages?",
          answer: "Yes, you can share photos and voice messages with your matches. All shared content is moderated by our AI system to ensure it complies with our Community Guidelines."
        },
        {
          question: "What if someone sends me inappropriate messages?",
          answer: "You can report any message or user that makes you uncomfortable. Use the report button in the chat, and our safety team will review it within 24 hours. You can also block users immediately."
        }
      ]
    },
    {
      category_id: 'safety-privacy',
      faqs: [
        {
          question: "How does qoupl keep me safe?",
          answer: "We use multiple safety measures including photo verification, AI-powered content moderation, 24/7 human review team, encrypted messaging, reporting and blocking features, and safety tips before first meetings. Your safety is our top priority."
        },
        {
          question: "Can I hide my profile from certain people?",
          answer: "Yes! You can block specific users, and they won't be able to see your profile or contact you. You can also use the 'Incognito Mode' (premium feature) to browse profiles privately without appearing in their discovery feed."
        },
        {
          question: "What information is visible on my profile?",
          answer: "Your profile shows your photos, name, age, bio, interests, and any other information you choose to add. Your exact location is never shared - only approximate distance. You control what you share."
        },
        {
          question: "How do I report a suspicious profile?",
          answer: "Tap the three dots on any profile and select 'Report.' Choose the reason (fake profile, inappropriate content, harassment, etc.) and submit. We review all reports within 24 hours."
        }
      ]
    },
    {
      category_id: 'premium-features',
      faqs: [
        {
          question: "What is qoupl Plus?",
          answer: "qoupl Plus is our premium subscription that includes unlimited likes, advanced filters, rewind feature, see who liked you, boost your profile, incognito mode, and no ads. It enhances your experience and increases your chances of finding matches."
        },
        {
          question: "How much does qoupl Plus cost?",
          answer: "qoupl Plus is available in different subscription plans: monthly, 3-month, and 6-month options. Longer plans offer better value. Check the app for current pricing in your region."
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes! You can cancel your subscription at any time through your app store settings (App Store or Google Play). Your premium features will remain active until the end of your current billing period."
        },
        {
          question: "Do I get a refund if I cancel?",
          answer: "Refunds are handled through your app store (Apple App Store or Google Play Store) and are subject to their refund policies. Generally, unused portions of subscriptions are not refundable, but you can check with the respective app store."
        }
      ]
    },
    {
      category_id: 'profile-account',
      faqs: [
        {
          question: "How do I edit my profile?",
          answer: "Tap on your profile icon, then tap 'Edit Profile.' You can update your photos, bio, interests, preferences, and all other profile information anytime."
        },
        {
          question: "What makes a good profile?",
          answer: "Use clear, recent photos that show your face, write a genuine and interesting bio, fill out all profile sections, showcase your interests and hobbies, be authentic and honest, and verify your profile for credibility."
        },
        {
          question: "Can I link my Instagram or Spotify?",
          answer: "Yes! You can connect your Instagram and Spotify accounts to your qoupl profile to showcase more about your lifestyle and music taste. This helps potential matches get to know you better."
        },
        {
          question: "How do I delete my account?",
          answer: "Go to Settings > Account > Delete Account. Keep in mind this is permanent and cannot be undone. All your matches, messages, and profile data will be permanently deleted."
        }
      ]
    },
    {
      category_id: 'technical-support',
      faqs: [
        {
          question: "The app isn't working properly. What should I do?",
          answer: "Try these steps: ensure you have the latest version of the app, restart the app, check your internet connection, restart your phone, or contact our support team at support@qoupl.ai with details about the issue."
        },
        {
          question: "I'm not receiving notifications. How do I fix this?",
          answer: "Check your phone's notification settings for qoupl, ensure notifications are enabled in the app settings, make sure your phone isn't in Do Not Disturb mode, and check that you have a stable internet connection."
        },
        {
          question: "Why can't I log in to my account?",
          answer: "Make sure you're using the correct email/phone number and password, try resetting your password, check if your account was suspended (check your email), ensure you have a stable internet connection, or contact support if the issue persists."
        },
        {
          question: "Can I use qoupl on multiple devices?",
          answer: "Yes! You can log into your qoupl account on multiple devices. Your profile, matches, and messages will sync across all devices automatically."
        }
      ]
    },
    {
      category_id: 'success-tips',
      faqs: [
        {
          question: "What are the best tips for getting matches?",
          answer: "Use high-quality, clear photos that show your face, complete your entire profile with honest information, be active on the app daily, write a unique and engaging bio, verify your profile, use the app during peak hours (evenings and weekends), and be yourself!"
        },
        {
          question: "How long does it usually take to find a match?",
          answer: "This varies for everyone! Some users find matches within hours, while others may take longer. Stay active, keep your profile updated, and be patient. Our algorithm gets better at understanding your preferences over time."
        },
        {
          question: "What should I write in my first message?",
          answer: "Reference something specific from their profile, ask an open-ended question, use humor (if appropriate), be genuine and friendly, and avoid generic openers like 'Hey' or 'What's up?' Show that you've read their profile!"
        },
        {
          question: "Is it okay to meet someone in person from qoupl?",
          answer: "Yes! Many successful couples have met through qoupl. Always follow our safety guidelines: meet in public places, tell a friend where you're going, chat extensively before meeting, trust your instincts, and arrange your own transportation."
        }
      ]
    }
  ]

  // Create one section per FAQ category
  for (const category of faqCategories) {
    const sectionData = {
      page_id: faqPageId,
      component_type: 'faq-category',
      order_index: 0,
      content: {
        category_id: category.category_id,
        faqs: category.faqs.map((faq, idx) => ({
          question: faq.question,
          answer: faq.answer,
          order_index: idx,
        })),
      },
      published: true,
    }

    const { error } = await adminClient
      .from('sections')
      .insert(sectionData)

    if (error) {
      console.error(`❌ Failed to migrate FAQ category: ${category.category_id}`, error.message)
    } else {
      console.log(`✅ Migrated FAQ category: ${category.category_id} (${category.faqs.length} FAQs)`)
    }
  }
}

async function migrateAboutPage() {
  console.log('\n📖 Migrating About page content...\n')

  const aboutPageId = await getPageId('about')
  if (!aboutPageId) {
    console.error('❌ About page not found, skipping')
    return
  }

  // Check if already migrated
  const { data: existing } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', aboutPageId)
    .single()

  if (existing) {
    console.log('⏭️  About page content already migrated')
    return
  }

  // Values section
  const valuesSection = {
    page_id: aboutPageId,
    component_type: 'values',
    order_index: 1,
    content: {
      values: [
        {
          icon: 'Heart',
          title: 'Authenticity First',
          description: 'We believe in real connections built on honesty and genuine interactions.',
          color: 'bg-[#662D91]',
        },
        {
          icon: 'Shield',
          title: 'Safety & Trust',
          description: 'Your safety is our priority. We create a secure environment for finding love.',
          color: 'bg-[#662D91]',
        },
        {
          icon: 'Sparkles',
          title: 'Innovation',
          description: 'Leveraging AI and technology to make dating smarter and more meaningful.',
          color: 'bg-[#662D91]',
        },
        {
          icon: 'Users',
          title: 'College Community',
          description: 'A dedicated space for college students to connect with peers who understand their journey.',
          color: 'bg-[#662D91]',
        },
      ],
    },
    published: true,
  }

  // Timeline section
  const timelineSection = {
    page_id: aboutPageId,
    component_type: 'timeline',
    order_index: 2,
    content: {
      timeline: [
        { year: '2024', event: 'qoupl Founded', description: 'Started with a vision to revolutionize online dating in India' },
        { year: '2024', event: 'Platform Development', description: 'Building the core platform with AI-powered matching technology' },
        { year: '2025', event: 'Beta Testing', description: 'Preparing for beta launch with select users' },
        { year: '2025', event: 'Future Plans', description: 'Expanding features and preparing for global launch' },
      ],
    },
    published: true,
  }

  const { error: valuesError } = await adminClient
    .from('sections')
    .insert(valuesSection)

  if (valuesError) {
    console.error('❌ Failed to migrate values section:', valuesError.message)
  } else {
    console.log('✅ Migrated values section')
  }

  const { error: timelineError } = await adminClient
    .from('sections')
    .insert(timelineSection)

  if (timelineError) {
    console.error('❌ Failed to migrate timeline section:', timelineError.message)
  } else {
    console.log('✅ Migrated timeline section')
  }
}

async function migratePricingPage() {
  console.log('\n💰 Migrating Pricing page content...\n')

  const pricingPageId = await getPageId('pricing')
  if (!pricingPageId) {
    console.error('❌ Pricing page not found, skipping')
    return
  }

  // Check if already migrated
  const { data: existing } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', pricingPageId)
    .eq('component_type', 'pricing-plans')
    .single()

  if (existing) {
    console.log('⏭️  Pricing page content already migrated')
    return
  }

  const pricingSection = {
    page_id: pricingPageId,
    component_type: 'pricing-plans',
    order_index: 1,
    content: {
      plans: [
        {
          name: 'Basic',
          price: 0,
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
  }

  const { error } = await adminClient
    .from('sections')
    .insert(pricingSection)

  if (error) {
    console.error('❌ Failed to migrate pricing section:', error.message)
  } else {
    console.log('✅ Migrated pricing section')
  }
}

async function migrateFeaturesPage() {
  console.log('\n✨ Migrating Features page content...\n')

  const featuresPageId = await getPageId('features')
  if (!featuresPageId) {
    console.error('❌ Features page not found, skipping')
    return
  }

  // Check if already migrated
  const { data: existing } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', featuresPageId)
    .eq('component_type', 'feature-category')
    .single()

  if (existing) {
    console.log('⏭️  Features page content already migrated')
    return
  }

  const featuresSection = {
    page_id: featuresPageId,
    component_type: 'feature-category',
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

  const { error } = await adminClient
    .from('sections')
    .insert(featuresSection)

  if (error) {
    console.error('❌ Failed to migrate features section:', error.message)
  } else {
    console.log('✅ Migrated features section')
  }
}

async function main() {
  console.log('🚀 Starting All Pages Content Migration...\n')
  console.log('='.repeat(60))

  try {
    await migrateFAQPage()
    await migrateAboutPage()
    await migratePricingPage()
    await migrateFeaturesPage()

    console.log('\n' + '='.repeat(60))
    console.log('✨ All Pages Content Migration Complete!')
    console.log('\n💡 Next steps:')
    console.log('   1. Verify migrated data in sections table')
    console.log('   2. Test all pages render correctly')
    console.log('   3. Update CMS to edit this content\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()


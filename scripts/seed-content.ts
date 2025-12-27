/**
 * Content Seeding Script
 * Seeds the database with initial content from the existing hardcoded data
 *
 * Usage:
 *   npx ts-node scripts/seed-content.ts
 * OR
 *   npm run seed:content
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

async function seedContent() {
  console.log('🌱 Starting content seeding...\n')

  try {
    // ========================================================================
    // SEED FAQs (32 Q&A pairs across 8 categories)
    // ========================================================================
    console.log('📝 Seeding FAQs...')

    // Get category IDs
    const { data: faqCategories } = await adminClient
      .from('faq_categories')
      .select('id, slug')

    if (!faqCategories) {
      console.error('❌ FAQ categories not found')
      return
    }

    const getCategoryId = (slug: string) =>
      faqCategories.find((c) => c.slug === slug)?.id

    const faqs = [
      // Getting Started (4)
      {
        category_id: getCategoryId('getting-started'),
        question: 'How do I create an account on qoupl?',
        answer:
          'Download the app, sign up with email/phone, complete your profile with photos and interests, verify your college ID, and start matching!',
        order_index: 1,
      },
      {
        category_id: getCategoryId('getting-started'),
        question: 'Is qoupl free to use?',
        answer:
          'Yes! Basic features are free. Platform access is ₹10/month, and you get 3 free messages per match. Additional messages can be purchased in bundles.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('getting-started'),
        question: 'Who can join qoupl?',
        answer:
          'qoupl is exclusively for college students aged 18-25. You must provide valid college ID verification to join.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('getting-started'),
        question: 'How do I verify my profile?',
        answer:
          'Complete photo verification (selfie with pose) and upload your college ID. Verification typically takes 24 hours.',
        order_index: 4,
      },

      // Matching & Discovery (4)
      {
        category_id: getCategoryId('matching-discovery'),
        question: 'How does the matching algorithm work?',
        answer:
          'Our AI analyzes your profile, preferences, behavior, and interests to suggest compatible matches. The more you use qoupl, the better it gets!',
        order_index: 1,
      },
      {
        category_id: getCategoryId('matching-discovery'),
        question: 'Can I filter matches by specific criteria?',
        answer:
          'Yes! Filter by age range, distance, interests, education level, and more. Premium users get additional filter options.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('matching-discovery'),
        question: 'What if I run out of matches?',
        answer:
          'Expand your search radius, update preferences, or use profile boost to increase visibility. New users join daily!',
        order_index: 3,
      },
      {
        category_id: getCategoryId('matching-discovery'),
        question: 'Can I undo a swipe?',
        answer:
          'Yes, premium users can rewind their last swipe. This feature is available with qoupl Plus subscription.',
        order_index: 4,
      },

      // Messaging & Communication (4)
      {
        category_id: getCategoryId('messaging-communication'),
        question: 'How do I start a conversation?',
        answer:
          'After matching, send a message! You get 3 free messages per match. Use our AI-generated icebreakers if you need inspiration.',
        order_index: 1,
      },
      {
        category_id: getCategoryId('messaging-communication'),
        question: 'Are messages encrypted?',
        answer:
          'Yes! All conversations use end-to-end encryption. Your messages are private and secure.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('messaging-communication'),
        question: 'Can I send photos or videos?',
        answer:
          'Yes, you can share photos and videos securely. All media is scanned for inappropriate content.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('messaging-communication'),
        question: 'What if someone sends inappropriate messages?',
        answer:
          'Report immediately using the in-chat report button. Our team reviews all reports within 24 hours.',
        order_index: 4,
      },

      // Safety & Privacy (4)
      {
        category_id: getCategoryId('safety-privacy'),
        question: 'How does qoupl ensure my safety?',
        answer:
          'We use photo verification, college ID checks, 24/7 AI moderation, end-to-end encryption, and a dedicated safety team.',
        order_index: 1,
      },
      {
        category_id: getCategoryId('safety-privacy'),
        question: 'Can I hide my profile?',
        answer:
          'Yes! Use incognito mode (premium feature) or pause your account temporarily from settings.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('safety-privacy'),
        question: 'What information is visible to others?',
        answer:
          'Others see your name, age, photos, bio, and interests. Your email, phone number, and college ID remain private.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('safety-privacy'),
        question: 'How do I report suspicious behavior?',
        answer:
          'Click the report button on any profile or conversation, select the reason, and submit. We review all reports promptly.',
        order_index: 4,
      },

      // Premium Features (4)
      {
        category_id: getCategoryId('premium-features'),
        question: 'What is qoupl Plus?',
        answer:
          'Premium subscription with features like seeing who likes you, unlimited swipes, profile boost, rewind, and travel mode.',
        order_index: 1,
      },
      {
        category_id: getCategoryId('premium-features'),
        question: 'How much does qoupl Plus cost?',
        answer:
          'Platform access is ₹10/month. Message bundles range from ₹50 to ₹500. No hidden fees!',
        order_index: 2,
      },
      {
        category_id: getCategoryId('premium-features'),
        question: 'Can I cancel my subscription?',
        answer:
          'Yes, cancel anytime from settings. You will retain access until the end of your billing period.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('premium-features'),
        question: 'Is there a refund policy?',
        answer:
          'Refunds available within 48 hours if you haven\'t used premium features. Contact support@qoupl.ai.',
        order_index: 4,
      },

      // Profile & Account (4)
      {
        category_id: getCategoryId('profile-account'),
        question: 'How do I edit my profile?',
        answer:
          'Go to Settings → Edit Profile. Update photos, bio, interests, and preferences. Changes save automatically.',
        order_index: 1,
      },
      {
        category_id: getCategoryId('profile-account'),
        question: 'What makes a good profile?',
        answer:
          'Use clear, recent photos showing your face and personality. Write a genuine bio. List real interests. Complete all profile sections.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('profile-account'),
        question: 'Can I link my social media?',
        answer:
          'Yes! Link Instagram or Spotify (optional). This increases trust and shows personality.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('profile-account'),
        question: 'How do I delete my account?',
        answer:
          'Settings → Account → Delete Account. This is permanent and cannot be undone. All data is deleted within 30 days.',
        order_index: 4,
      },

      // Technical Support (4)
      {
        category_id: getCategoryId('technical-support'),
        question: 'The app is not working properly',
        answer:
          'Try: Update app to latest version, restart device, clear app cache, or reinstall. Contact support@qoupl.ai if issues persist.',
        order_index: 1,
      },
      {
        category_id: getCategoryId('technical-support'),
        question: "I'm not receiving notifications",
        answer:
          'Check: Settings → Enable notifications, allow app permissions in device settings, ensure "Do Not Disturb" is off.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('technical-support'),
        question: "I can't log in to my account",
        answer:
          'Use "Forgot Password" to reset. Verify email/phone. If still stuck, contact support@qoupl.ai with your registered email.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('technical-support'),
        question: 'Can I use qoupl on multiple devices?',
        answer:
          `Yes! Log in with the same account on multiple devices. You cannot be active on two devices simultaneously.`,
        order_index: 4,
      },

      // Success & Tips (4)
      {
        category_id: getCategoryId('success-tips'),
        question: 'How can I increase my matches?',
        answer:
          'Complete your profile, use quality photos, stay active daily, update preferences, be authentic, and use profile boost.',
        order_index: 1,
      },
      {
        category_id: getCategoryId('success-tips'),
        question: 'How long until I get a match?',
        answer:
          'Varies by location and profile. Optimize your profile, be patient, and stay active. Most users get matches within a week.',
        order_index: 2,
      },
      {
        category_id: getCategoryId('success-tips'),
        question: "What's the best first message?",
        answer:
          'Be personalized! Reference their profile, ask an open-ended question, avoid generic "hey". Show genuine interest.',
        order_index: 3,
      },
      {
        category_id: getCategoryId('success-tips'),
        question: 'How do I know when to meet in person?',
        answer:
          'After multiple conversations, do a video call first, meet in public places, tell friends/family, trust your instincts.',
        order_index: 4,
      },
    ]

    const { error: faqError } = await adminClient.from('faqs').insert(faqs)

    if (faqError) {
      console.error('❌ Error seeding FAQs:', faqError)
    } else {
      console.log(`✅ Seeded ${faqs.length} FAQs\n`)
    }

    // ========================================================================
    // SEED BLOG POSTS (6 posts)
    // ========================================================================
    console.log('📰 Seeding blog posts...')

    const { data: blogCategories } = await adminClient
      .from('blog_categories')
      .select('id, slug')

    const getBlogCategoryId = (slug: string) =>
      blogCategories?.find((c) => c.slug === slug)?.id

    const blogPosts = [
      {
        title: 'The Future of AI in Online Dating',
        slug: 'future-of-ai-online-dating',
        excerpt:
          'Explore how artificial intelligence is revolutionizing the way we connect and find meaningful relationships in the digital age.',
        content: `
# The Future of AI in Online Dating

Artificial Intelligence is transforming how we find love online. At qoupl, we're at the forefront of this revolution.

## How AI Enhances Matching

Our AI-powered matching algorithm analyzes:
- Profile preferences and behaviors
- Conversation patterns
- Compatibility indicators
- User feedback and interactions

## The qoupl Difference

Unlike traditional dating apps that rely solely on swipes, qoupl's AI learns and adapts to your preferences over time, ensuring better matches with each interaction.

## Looking Ahead

The future of dating is intelligent, personalized, and focused on meaningful connections. We're excited to be part of this journey!
        `,
        category_id: getBlogCategoryId('technology'),
        author: 'qoupl Team',
        publish_date: '2025-11-15T10:00:00Z',
        read_time: 5,
        featured_image: '/images/indian-student-goes-first-lesson.jpg',
        published: true,
      },
      {
        title: 'Building Authentic Connections in a Digital World',
        slug: 'building-authentic-connections',
        excerpt:
          'In an era of swipes and likes, learn how to create genuine connections that last.',
        content: `
# Building Authentic Connections in a Digital World

In today's fast-paced digital landscape, finding authentic connections can feel challenging. Here's how qoupl helps you build real relationships.

## The Authenticity Challenge

With so many dating apps, it's easy to feel lost in superficial interactions. qoupl focuses on:
- College ID verification
- Photo verification
- Meaningful profile prompts
- Quality over quantity

## Tips for Authentic Connections

1. **Be Yourself**: Authenticity attracts authenticity
2. **Ask Meaningful Questions**: Go beyond surface level
3. **Share Your Story**: Vulnerability builds connection
4. **Listen Actively**: Show genuine interest

## The qoupl Community

We've built a platform where college students can connect based on shared experiences, values, and genuine interest.
        `,
        category_id: getBlogCategoryId('relationships'),
        author: 'qoupl Team',
        publish_date: '2025-11-10T10:00:00Z',
        read_time: 7,
        featured_image: '/images/coupl/hannah-skelly-_wQqLdsgr4I-unsplash.jpg',
        published: true,
      },
      {
        title: 'Safety First: Your Guide to Secure Online Dating',
        slug: 'safety-guide-online-dating',
        excerpt:
          'Essential tips and best practices for staying safe while dating online.',
        content: `
# Safety First: Your Guide to Secure Online Dating

Your safety is our top priority. Here's everything you need to know about staying safe on qoupl.

## Our Safety Features

- **Photo Verification**: Real-time selfie verification
- **College ID Verification**: Mandatory for all users
- **End-to-End Encryption**: Your messages stay private
- **24/7 AI Moderation**: Automatic inappropriate content detection
- **Human Review Team**: All reports reviewed within 24 hours

## Safety Tips

### Before Meeting
1. Have multiple conversations first
2. Do a video call
3. Tell friends/family your plans
4. Meet in public places

### During the Date
1. Arrange your own transportation
2. Stay in public areas
3. Trust your instincts
4. Stay sober

### Red Flags to Watch
- Asks for money
- Refuses video calls
- Pressures to move off-platform
- Too good to be true
- Aggressive behavior

## Report & Block

Don't hesitate to report suspicious behavior. We take all reports seriously.
        `,
        category_id: getBlogCategoryId('safety'),
        author: 'qoupl Safety Team',
        publish_date: '2025-11-05T10:00:00Z',
        read_time: 6,
        featured_image: '/images/medium-shot-man-with-paperwork.jpg',
        published: true,
      },
      {
        title: 'The Psychology of Modern Romance',
        slug: 'psychology-modern-romance',
        excerpt:
          'Understanding the psychological aspects of digital dating and what makes relationships work.',
        content: `
# The Psychology of Modern Romance

Dating has evolved, but the psychology behind attraction remains fascinating. Let's explore what makes modern relationships work.

## The Science of Attraction

Research shows that successful matches often share:
- Similar values and goals
- Complementary personality traits
- Shared interests and hobbies
- Compatible communication styles

## Digital Dating Psychology

Online dating changes how we:
- Make first impressions (visual-first)
- Communicate initial interest (text-based)
- Build emotional connections (before meeting)
- Evaluate compatibility (through profiles)

## The qoupl Approach

Our AI considers psychological compatibility factors:
- Personality indicators
- Communication patterns
- Shared values
- Relationship goals

## Building Lasting Connections

Quality relationships require:
- Emotional intelligence
- Active listening
- Vulnerability
- Patience
- Mutual respect

Understanding these principles helps you make better connections on qoupl!
        `,
        category_id: getBlogCategoryId('psychology'),
        author: 'Dr. Sarah Johnson',
        publish_date: '2025-11-01T10:00:00Z',
        read_time: 8,
        featured_image:
          '/images/coupl/boy-giving-piggy-back-ride-his-girlfriend.jpg',
        published: true,
      },
      {
        title: 'Creating the Perfect Dating Profile',
        slug: 'perfect-dating-profile',
        excerpt:
          'Step-by-step guide to crafting a profile that stands out and attracts the right matches.',
        content: `
# Creating the Perfect Dating Profile

Your profile is your first impression. Here's how to make it count!

## Profile Photos (Most Important!)

### Photo 1: Clear Face Shot
- Well-lit, recent photo
- Smiling, natural expression
- Good quality, not pixelated

### Photo 2: Full Body
- Shows your style
- Doing an activity you love
- Natural setting

### Photo 3-5: Personality Shots
- With friends (but you're clearly identifiable)
- Hobbies and interests
- Travel or adventures
- Candid moments

### Avoid:
- ❌ Group photos where you can't be identified
- ❌ Heavily filtered or edited photos
- ❌ Sunglasses in every photo
- ❌ Old photos (use recent ones!)

## Writing Your Bio

### Be Specific
Instead of: "I love music"
Write: "Indie rock enthusiast, Coldplay is my go-to"

### Show Personality
- Use humor if that's you
- Share a quirky fact
- Mention specific interests

### Include Conversation Starters
- "Ask me about my backpacking trip to Ladakh"
- "Let's debate pineapple on pizza"
- "Looking for food recommendations in Delhi"

## Profile Prompts

Answer prompts authentically:
- Share real interests
- Be vulnerable
- Show what makes you unique

## Common Mistakes to Avoid

1. **Generic Bios**: "Love to travel, foodie, Netflix"
2. **Negativity**: "No drama" or "Tired of games"
3. **Empty Profiles**: At least 3 photos and complete bio
4. **Lies**: Authenticity matters!

## Pro Tips

✅ Update photos seasonally
✅ Check spelling and grammar
✅ Link Instagram (if appropriate)
✅ Complete all profile sections
✅ Verify your profile (blue checkmark!)

Your perfect match is waiting! Make your profile count.
        `,
        category_id: getBlogCategoryId('tips-tricks'),
        author: 'qoupl Team',
        publish_date: '2025-10-28T10:00:00Z',
        read_time: 4,
        featured_image: '/images/Gemini_Generated_Image_6cx31l6cx31l6cx3.png',
        published: true,
      },
      {
        title: 'The Importance of Emotional Intelligence in Relationships',
        slug: 'emotional-intelligence-relationships',
        excerpt:
          'How emotional intelligence can help you build stronger, more meaningful connections.',
        content: `
# The Importance of Emotional Intelligence in Relationships

Emotional intelligence (EQ) is crucial for successful relationships. Here's why it matters and how to develop it.

## What is Emotional Intelligence?

EQ involves:
- **Self-awareness**: Understanding your emotions
- **Self-regulation**: Managing your reactions
- **Empathy**: Understanding others' feelings
- **Social skills**: Building healthy connections

## EQ in Dating

High emotional intelligence helps you:
- Communicate effectively
- Handle conflict constructively
- Show empathy and understanding
- Build deeper connections
- Recognize compatibility

## Developing Your EQ

### 1. Practice Self-Awareness
- Journal your feelings
- Reflect on reactions
- Understand your triggers

### 2. Improve Communication
- Express feelings clearly
- Listen actively
- Ask clarifying questions

### 3. Build Empathy
- Put yourself in others' shoes
- Validate feelings
- Show genuine interest

### 4. Manage Emotions
- Pause before reacting
- Process feelings healthily
- Seek feedback

## EQ on qoupl

Our platform encourages emotional intelligence through:
- Thoughtful profile prompts
- Communication features
- Safety guidelines
- Community standards

## Signs of High EQ in a Match

- Good listener
- Expresses feelings clearly
- Handles disagreements maturely
- Shows empathy
- Respects boundaries

Emotional intelligence is key to finding and maintaining meaningful connections!
        `,
        category_id: getBlogCategoryId('relationships'),
        author: 'Dr. Priya Sharma',
        publish_date: '2025-10-25T10:00:00Z',
        read_time: 6,
        featured_image: '/images/Gemini_Generated_Image_l957byl957byl957.png',
        published: true,
      },
    ]

    const { error: blogError } = await adminClient
      .from('blog_posts')
      .insert(blogPosts)

    if (blogError) {
      console.error('❌ Error seeding blog posts:', blogError)
    } else {
      console.log(`✅ Seeded ${blogPosts.length} blog posts\n`)
    }

    // ========================================================================
    // SEED FEATURES
    // ========================================================================
    console.log('✨ Seeding features...')

    const { data: featureCategories } = await adminClient
      .from('feature_categories')
      .select('id, slug')

    const getFeatureCategoryId = (slug: string) =>
      featureCategories?.find((c) => c.slug === slug)?.id

    const features = [
      // Smart Matching (4 features)
      {
        category_id: getFeatureCategoryId('smart-matching'),
        title: 'AI-Powered Algorithm',
        description:
          'Advanced machine learning analyzes your preferences, behavior, and interactions to suggest the most compatible matches.',
        icon: 'brain',
        order_index: 1,
      },
      {
        category_id: getFeatureCategoryId('smart-matching'),
        title: 'Compatibility Score',
        description:
          'See how well you match with potential partners based on interests, values, and personality traits.',
        icon: 'heart',
        order_index: 2,
      },
      {
        category_id: getFeatureCategoryId('smart-matching'),
        title: 'Learning Preferences',
        description:
          'The more you use qoupl, the better it understands you. Our AI learns from your swipes and conversations.',
        icon: 'trending-up',
        order_index: 3,
      },
      {
        category_id: getFeatureCategoryId('smart-matching'),
        title: 'Smart Filters',
        description:
          'Customize your search with detailed preferences like age range, distance, education, interests, and more.',
        icon: 'filter',
        order_index: 4,
      },

      // Safety & Trust (4 features)
      {
        category_id: getFeatureCategoryId('safety-trust'),
        title: 'Photo Verification',
        description:
          'Ensure profiles are real with our photo verification system. Verified profiles get a blue checkmark.',
        icon: 'badge-check',
        order_index: 1,
      },
      {
        category_id: getFeatureCategoryId('safety-trust'),
        title: 'College ID Verification',
        description:
          'Exclusive to verified college students. All users must provide valid college ID for authentication.',
        icon: 'graduation-cap',
        order_index: 2,
      },
      {
        category_id: getFeatureCategoryId('safety-trust'),
        title: 'End-to-End Encryption',
        description:
          'Your conversations are private and secure with end-to-end encryption. Nobody can read your messages.',
        icon: 'lock',
        order_index: 3,
      },
      {
        category_id: getFeatureCategoryId('safety-trust'),
        title: '24/7 AI Moderation',
        description:
          'Automated monitoring detects and prevents inappropriate content. Our AI keeps the community safe.',
        icon: 'shield-check',
        order_index: 4,
      },

      // Rich Communication (4 features)
      {
        category_id: getFeatureCategoryId('rich-communication'),
        title: 'Smart Icebreakers',
        description:
          'AI-generated conversation starters based on shared interests. Never struggle with the first message again.',
        icon: 'sparkles',
        order_index: 1,
      },
      {
        category_id: getFeatureCategoryId('rich-communication'),
        title: 'Photo & Video Sharing',
        description:
          'Share moments with your matches securely. All media is scanned for safety.',
        icon: 'image',
        order_index: 2,
      },
      {
        category_id: getFeatureCategoryId('rich-communication'),
        title: 'Voice Messages',
        description:
          'Add a personal touch to your conversations with voice messages. Let your personality shine!',
        icon: 'mic',
        order_index: 3,
      },
      {
        category_id: getFeatureCategoryId('rich-communication'),
        title: 'Real-time Chat',
        description:
          'Instant messaging with online status indicators. Know when your match is active.',
        icon: 'message-circle',
        order_index: 4,
      },

      // Premium Experience (4 features)
      {
        category_id: getFeatureCategoryId('premium-experience'),
        title: 'See Who Likes You',
        description:
          `Know who is interested before you match. Skip the guessing game and connect instantly.`,
        icon: 'eye',
        order_index: 1,
      },
      {
        category_id: getFeatureCategoryId('premium-experience'),
        title: 'Profile Boost',
        description:
          'Get 10x more visibility in your area for 30 minutes. Be seen by more potential matches.',
        icon: 'rocket',
        order_index: 2,
      },
      {
        category_id: getFeatureCategoryId('premium-experience'),
        title: 'Travel Mode',
        description:
          `Connect with people in cities you are visiting. Perfect for college trips and vacations.`,
        icon: 'plane',
        order_index: 3,
      },
      {
        category_id: getFeatureCategoryId('premium-experience'),
        title: 'Unlimited Likes',
        description:
          'No daily limit on likes. Swipe as much as you want and increase your chances of matching.',
        icon: 'infinity',
        order_index: 4,
      },
    ]

    const { error: featuresError } = await adminClient
      .from('features')
      .insert(features)

    if (featuresError) {
      console.error('❌ Error seeding features:', featuresError)
    } else {
      console.log(`✅ Seeded ${features.length} features\n`)
    }

    // ========================================================================
    // SEED PRICING PLANS
    // ========================================================================
    console.log('💰 Seeding pricing plans...')

    const pricingPlans = [
      // Subscription
      {
        plan_type: 'subscription',
        name: 'Monthly Subscription',
        price: 10,
        currency: 'INR',
        billing_period: 'monthly',
        features: [
          'AI-powered matching algorithm',
          'Advanced profile customization',
          'Photo verification badge',
          'End-to-end encrypted messaging',
          'See who views your profile',
          'Priority customer support',
          'Profile boost once a month',
          'Unlimited profile views',
        ],
        is_popular: false,
        order_index: 1,
      },

      // Message Bundles
      {
        plan_type: 'bundle',
        name: '5 Messages',
        price: 50,
        currency: 'INR',
        billing_period: 'one_time',
        features: ['5 additional messages', 'No expiration', '+ 18% GST'],
        is_popular: false,
        order_index: 2,
      },
      {
        plan_type: 'bundle',
        name: '10 Messages',
        price: 100,
        currency: 'INR',
        billing_period: 'one_time',
        features: [
          '10 additional messages',
          'No expiration',
          '+ 18% GST',
          'Most popular bundle',
        ],
        is_popular: true,
        order_index: 3,
      },
      {
        plan_type: 'bundle',
        name: '20 Messages',
        price: 200,
        currency: 'INR',
        billing_period: 'one_time',
        features: ['20 additional messages', 'No expiration', '+ 18% GST'],
        is_popular: false,
        order_index: 4,
      },
      {
        plan_type: 'bundle',
        name: '50 Messages',
        price: 500,
        currency: 'INR',
        billing_period: 'one_time',
        features: [
          '50 additional messages',
          'No expiration',
          '+ 18% GST',
          'Best value',
        ],
        is_popular: false,
        order_index: 5,
      },
    ]

    const { error: pricingError } = await adminClient
      .from('pricing_plans')
      .insert(pricingPlans)

    if (pricingError) {
      console.error('❌ Error seeding pricing plans:', pricingError)
    } else {
      console.log(`✅ Seeded ${pricingPlans.length} pricing plans\n`)
    }

    console.log('✨ Content seeding complete!\n')
    console.log('📊 Summary:')
    console.log(`   - FAQs: ${faqs.length}`)
    console.log(`   - Blog Posts: ${blogPosts.length}`)
    console.log(`   - Features: ${features.length}`)
    console.log(`   - Pricing Plans: ${pricingPlans.length}`)
    console.log('\n🎉 All done!')
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error)
    process.exit(1)
  }
}

seedContent()

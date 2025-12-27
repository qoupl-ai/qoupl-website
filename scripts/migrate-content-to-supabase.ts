/**
 * Migration Script: Move All Hardcoded Content to Supabase
 * 
 * This script populates:
 * 1. global_content table (navbar, footer, social_links, contact_info, site_config)
 * 2. sections table (homepage sections: hero, how-it-works, features, gallery, testimonials, app-download, coming-soon)
 * 
 * Run: ts-node --project tsconfig.node.json scripts/migrate-content-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function migrateGlobalContent() {
  console.log('\n📦 Migrating Global Content...\n')

  // Navbar links
  const navbarContent = {
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/features', label: 'Features' },
      { href: '/safety', label: 'Safety & Security' },
      { href: '/community-guidelines', label: 'Community Guidelines' },
      { href: '/faq', label: 'FAQ' },
    ],
    logo: {
      src: '/images/quoupl.svg',
      alt: 'qoupl',
      width: 120,
      height: 40,
    },
  }

  // Footer content
  const footerContent = {
    brand: {
      description: 'The exclusive dating app for college students. Find your perfect match with qoupl.',
      logo: {
        src: '/images/quoupl.svg',
        alt: 'qoupl',
        width: 120,
        height: 40,
      },
    },
    columns: {
      product: {
        title: 'Product',
        links: [
          { href: '/features', label: 'Features' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/faq', label: 'FAQ' },
          { href: '/#waitlist', label: 'Join Waitlist' },
        ],
      },
      company: {
        title: 'Company',
        links: [
          { href: '/about', label: 'About Us' },
          { href: '/blog', label: 'Blog' },
          { href: '/careers', label: 'Careers' },
          { href: '/contact', label: 'Contact' },
        ],
      },
      legal: {
        title: 'Legal',
        links: [
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/terms', label: 'Terms of Service' },
          { href: '/community-guidelines', label: 'Community Guidelines' },
          { href: '/safety', label: 'Safety & Security' },
        ],
      },
    },
    copyright: {
      text: 'Made for meaningful connections',
      company: 'qoupl by Xencus Technologies Private Limited',
    },
  }

  // Social links (already in schema, but update with correct URLs)
  const socialLinks = {
    linkedin: 'https://www.linkedin.com/company/qoupl-ai/',
    instagram: 'https://www.instagram.com/qoupl.ai?igsh=MWI1bDFqOHplYzY1Nw==',
  }

  // Contact info (already in schema, but ensure it's correct)
  const contactInfo = {
    email: 'support@qoupl.ai',
    phone: '+91 9103732229',
    address: 'B-98, Sector-2, Noida, UP 201301',
    support_email: 'help@qoupl.ai',
  }

  // Site config (already in schema, but ensure it's correct)
  const siteConfig = {
    waitlist_count: 10000,
    tagline: 'Be couple with qoupl',
    subtitle: 'Find your vibe. Match your energy. Connect for real.',
  }

  // Upsert global content
  const globalContentItems = [
    { key: 'navbar', content: navbarContent },
    { key: 'footer', content: footerContent },
    { key: 'social_links', content: socialLinks },
    { key: 'contact_info', content: contactInfo },
    { key: 'site_config', content: siteConfig },
  ]

  for (const item of globalContentItems) {
    const { error } = await supabase
      .from('global_content')
      .upsert(
        {
          key: item.key,
          content: item.content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'key',
        }
      )

    if (error) {
      console.error(`❌ Failed to upsert ${item.key}:`, error.message)
    } else {
      console.log(`✅ Upserted global_content: ${item.key}`)
    }
  }
}

async function migrateHomepageSections() {
  console.log('\n📄 Migrating Homepage Sections...\n')

  // Get the home page ID
  const { data: homePage, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .single()

  if (pageError || !homePage) {
    console.error('❌ Failed to find home page:', pageError?.message)
    return
  }

  const pageId = homePage.id

  // Hero Section
  const heroSection = {
    component_type: 'hero',
    page_id: pageId,
    order_index: 1,
    published: true,
    content: {
      title: 'qoupl',
      tagline: 'Be couple with qoupl',
      subtitle: 'Find your vibe. Match your energy. Connect for real.',
      cta: {
        text: 'Join the Waitlist',
        subtext: '⚡ Limited spots for early access',
        buttonText: 'Join the Waitlist',
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
    },
  }

  // How It Works Section
  const howItWorksSection = {
    component_type: 'how-it-works',
    page_id: pageId,
    order_index: 2,
    published: true,
    content: {
      title: 'How qoupl Works',
      steps: [
        {
          step: '01',
          title: 'Create Your Profile',
          description:
            'Sign up in seconds as a college student and create a profile that showcases the real you. Verify with your college ID, add photos, interests, and what makes you unique.',
          image: 'app-screenshots/qoupl_screenshot_01.png',
        },
        {
          step: '02',
          title: 'Smart AI Matching',
          description:
            'Our advanced AI algorithm analyzes compatibility factors and suggests the most suitable matches for you.',
          image: 'app-screenshots/qoupl_screenshot_03.png',
        },
        {
          step: '03',
          title: 'Start Conversations',
          description:
            'Break the ice with our conversation starters and build meaningful connections through authentic chats.',
          image: 'app-screenshots/qoupl_screenshot_04.png',
        },
        {
          step: '04',
          title: 'Plan Your Date',
          description:
            'Use our date planning features to find the perfect spot and make your first meeting memorable.',
          image: 'app-screenshots/qoupl_screenshot_06.png',
        },
        {
          step: '05',
          title: 'Find True Love',
          description:
            'Build lasting relationships with people who truly understand and complement you. Your perfect match awaits!',
          image: 'app-screenshots/qoupl_screenshot_07.png',
        },
      ],
    },
  }

  // Product Features Section
  const productFeaturesSection = {
    component_type: 'product-features',
    page_id: pageId,
    order_index: 3,
    published: true,
    content: {
      title: 'Why Choose qoupl',
      subtitle: 'Advanced features designed to help you find meaningful connections',
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
    },
  }

  // Gallery Section
  const gallerySection = {
    component_type: 'gallery',
    page_id: pageId,
    order_index: 4,
    published: true,
    content: {
      title: 'Real Connections',
      subtitle: 'Join thousands of college student couples who found their perfect match through qoupl',
      badge: {
        icon: 'Heart',
        text: 'Love Stories',
      },
      images: [
        {
          image: 'couple-photos/qoupl_couple_01.jpg',
          alt: 'Happy couple outdoors',
          title: 'Sarah & Raj',
          story: 'Met through qoupl, now planning their future together',
        },
        {
          image: 'couple-photos/qoupl_couple_02.jpg',
          alt: 'Couple enjoying time together',
          title: 'Priya & Arjun',
          story: 'Found love in unexpected places',
        },
        {
          image: 'couple-photos/qoupl_couple_05.jpg',
          alt: 'Romantic moment',
          title: 'Anjali & Vikram',
          story: 'Book lovers united by their passion',
        },
        {
          image: 'couple-photos/qoupl_couple_03.jpg',
          alt: 'Couple smiling',
          title: 'Neha & Karan',
          story: 'Perfect match from day one',
        },
        {
          image: 'couple-photos/qoupl_couple_04.jpg',
          alt: 'Dating couple',
          title: 'Maya & Rohan',
          story: 'Adventure seekers finding love together',
        },
      ],
      cta: {
        text: 'Be part of something beautiful.',
        highlight: 'Your story could be next.',
      },
    },
  }

  // Testimonials Section
  const testimonialsSection = {
    component_type: 'testimonials',
    page_id: pageId,
    order_index: 5,
    published: true,
    content: {
      title: 'What Our Beta Users Say',
      subtitle:
        'Real college student couples from our exclusive beta program. See how qoupl brought them together during testing.',
      badge: {
        icon: 'Heart',
        text: 'Beta User Success Stories',
      },
      testimonials: [
        {
          name: 'Arjun',
          image: 'hero-images/men/qoupl_men_01.jpg',
          text: "We matched on qoupl during beta testing and instantly connected. Three months later, we're inseparable!",
          location: 'Mumbai, Maharashtra',
          rating: 5,
          date: 'Beta User',
        },
        {
          name: 'Ananya',
          image: 'hero-images/women/qoupl_women_03.png',
          text: "Being part of the beta program was amazing! The matching algorithm really works and I can't wait for everyone to experience it.",
          location: 'Bangalore, Karnataka',
          rating: 4,
          date: 'Beta User',
        },
        {
          name: 'Kavya',
          image: 'hero-images/women/qoupl_women_05.png',
          text: "Found my soulmate during the beta phase. qoupl changed my life forever and I'm excited for the public launch!",
          location: 'Delhi, India',
          rating: 4,
          date: 'Beta User',
        },
      ],
      stats: {
        text: 'Join 10,000+ people waiting for qoupl to launch',
        icon: 'Heart',
      },
    },
  }

  // App Download Section
  const appDownloadSection = {
    component_type: 'app-download',
    page_id: pageId,
    order_index: 6,
    published: true,
    content: {
      title: 'qoupl is Launching Soon',
      subtitle:
        'Be among the first college students to experience the future of dating! Join our waitlist today and get exclusive early access when we launch on iOS and Android.',
      badge: {
        icon: 'Sparkles',
        text: 'Coming Soon',
      },
      benefits: [
        'Get notified before official launch',
        'Exclusive early access to the app',
        'Special perks for early members',
        'Help shape the future of qoupl',
      ],
      cta: {
        text: 'Join the Waitlist',
        subtext: 'Limited spots available for early access',
      },
      platforms: [
        {
          name: 'App Store',
          icon: '🍎',
          coming: true,
        },
        {
          name: 'Google Play',
          icon: '📱',
          coming: true,
        },
      ],
      stats: {
        text: 'Join',
        count: '10,000+',
        suffix: 'on the waitlist',
      },
      images: {
        decorative: [
          'couple-photos/qoupl_couple_03.jpg',
          'couple-photos/qoupl_couple_05.jpg',
        ],
      },
    },
  }

  // Coming Soon Section
  const comingSoonSection = {
    component_type: 'coming-soon',
    page_id: pageId,
    order_index: 7,
    published: true,
    content: {
      title: 'Get Early Access',
      subtitle:
        'Be among the first college students to experience qoupl. Join our waitlist and get notified when we launch on iOS and Android.',
      badge: {
        icon: 'Sparkles',
        text: 'Launching Soon',
      },
      cta: {
        text: 'Join Waitlist Now',
      },
      platforms: [
        {
          name: 'App Store',
          icon: 'Apple',
          coming: true,
        },
        {
          name: 'Google Play',
          icon: 'Smartphone',
          coming: true,
        },
      ],
      stats: {
        text: 'people already on the waitlist',
        count: '10,000+',
      },
      screenshots: [
        'app-screenshots/qoupl_screenshot_01.png',
        'app-screenshots/qoupl_screenshot_02.png',
        'app-screenshots/qoupl_screenshot_03.png',
        'app-screenshots/qoupl_screenshot_04.png',
        'app-screenshots/qoupl_screenshot_05.png',
      ],
    },
  }

  const sections = [
    heroSection,
    howItWorksSection,
    productFeaturesSection,
    gallerySection,
    testimonialsSection,
    appDownloadSection,
    comingSoonSection,
  ]

  // Delete existing sections for home page to avoid duplicates
  await supabase.from('sections').delete().eq('page_id', pageId)

  // Insert new sections
  for (const section of sections) {
    const { error } = await supabase.from('sections').insert(section)

    if (error) {
      console.error(
        `❌ Failed to insert section ${section.component_type}:`,
        error.message
      )
    } else {
      console.log(`✅ Inserted section: ${section.component_type}`)
    }
  }
}

async function main() {
  console.log('🚀 Starting Content Migration to Supabase...\n')
  console.log('=' .repeat(60))

  try {
    await migrateGlobalContent()
    await migrateHomepageSections()

    console.log('\n' + '='.repeat(60))
    console.log('✨ Migration Complete!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Global content migrated (navbar, footer, social, contact, config)')
    console.log('   ✅ Homepage sections migrated (7 sections)')
    console.log('\n💡 Next steps:')
    console.log('   1. Update components to fetch from Supabase')
    console.log('   2. Test components render correctly')
    console.log('   3. Verify CMS can edit content\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()


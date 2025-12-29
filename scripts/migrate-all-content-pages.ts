/**
 * Migration Script: Migrate All Content Pages to Database
 * 
 * Migrates content for Careers, Community Guidelines, Privacy, Safety, Terms pages.
 * 
 * Run: ts-node --project tsconfig.node.json scripts/migrate-all-content-pages.ts
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

async function migrateCareersPage() {
  console.log('\n💼 Migrating Careers page content...\n')

  const pageId = await getPageId('careers')
  if (!pageId) {
    console.error('❌ Careers page not found, skipping')
    return
  }

  // Check if already migrated
  const { data: existing } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', pageId)
    .single()

  if (existing) {
    console.log('⏭️  Careers page content already migrated')
    return
  }

  // Hero section
  await adminClient.from('sections').insert({
    page_id: pageId,
    component_type: 'hero',
    order_index: 1,
    content: {
      title: "Build the Future of Dating",
      subtitle: "Help us create meaningful connections for college students that change lives"
    },
    published: true,
  })

  // Coming soon section
  await adminClient.from('sections').insert({
    page_id: pageId,
    component_type: 'coming-soon',
    order_index: 2,
    content: {
      title: "We're Building Something Special",
      description: "We're currently in the development phase and will be posting job openings soon. If you're passionate about creating meaningful connections and want to be part of our journey, we'd love to hear from you!",
      email: "careers@qoupl.ai"
    },
    published: true,
  })

  // Values section
  await adminClient.from('sections').insert({
    page_id: pageId,
    component_type: 'values',
    order_index: 3,
    content: {
      values: [
        {
          icon: 'Heart',
          title: "Passion-Driven",
          description: "We're passionate about helping people find meaningful connections.",
          color: "bg-[#662D91]"
        },
        {
          icon: 'Users',
          title: "Collaborative",
          description: "We believe in the power of teamwork and diverse perspectives.",
          color: "bg-[#662D91]"
        },
        {
          icon: 'Zap',
          title: "Innovation",
          description: "We're always pushing boundaries and exploring new possibilities.",
          color: "bg-[#662D91]"
        },
        {
          icon: 'Code',
          title: "Excellence",
          description: "We're committed to delivering the highest quality in everything we do.",
          color: "bg-[#662D91]"
        }
      ]
    },
    published: true,
  })

  // Why join section
  await adminClient.from('sections').insert({
    page_id: pageId,
    component_type: 'why-join',
    order_index: 4,
    content: {
      items: [
        {
          title: "Make an Impact",
          description: "Help millions of people find meaningful connections and lasting relationships.",
          icon: "💜"
        },
        {
          title: "Cutting-Edge Tech",
          description: "Work with the latest AI and machine learning technologies in dating.",
          icon: "🚀"
        },
        {
          title: "Great Culture",
          description: "Join a diverse, inclusive team that values your unique perspective.",
          icon: "✨"
        },
        {
          title: "Growth Opportunities",
          description: "Grow your career with learning opportunities and new challenges.",
          icon: "📈"
        },
        {
          title: "Work-Life Balance",
          description: "We believe in working smart and taking care of our team.",
          icon: "⚖️"
        },
        {
          title: "Innovation First",
          description: "Bring your ideas to life and help shape the future of dating.",
          icon: "💡"
        }
      ]
    },
    published: true,
  })

  console.log('✅ Migrated Careers page content')
}

async function migrateContentPage(slug: string, pageName: string) {
  console.log(`\n📄 Migrating ${pageName} page content...\n`)

  const pageId = await getPageId(slug)
  if (!pageId) {
    console.error(`❌ ${pageName} page not found, skipping`)
    return
  }

  // Check if already migrated
  const { data: existing } = await adminClient
    .from('sections')
    .select('id')
    .eq('page_id', pageId)
    .eq('component_type', 'content')
    .single()

  if (existing) {
    console.log(`⏭️  ${pageName} page content already migrated`)
    return
  }

  // For content pages, we'll store the full HTML structure as JSON
  // The client component will render it
  // For now, we'll create a placeholder that indicates content should be migrated
  await adminClient.from('sections').insert({
    page_id: pageId,
    component_type: 'content',
    order_index: 1,
    content: {
      title: pageName,
      lastUpdated: "November 20, 2025",
      sections: [] // Will be populated with actual content
    },
    published: true,
  })

  console.log(`✅ Created ${pageName} page content structure (needs manual content migration)`)
}

async function main() {
  console.log('🚀 Starting All Content Pages Migration...\n')
  console.log('='.repeat(60))

  try {
    await migrateCareersPage()
    await migrateContentPage('community-guidelines', 'Community Guidelines')
    await migrateContentPage('privacy', 'Privacy Policy')
    await migrateContentPage('safety', 'Safety & Security')
    await migrateContentPage('terms', 'Terms of Service')

    console.log('\n' + '='.repeat(60))
    console.log('✨ All Content Pages Migration Complete!')
    console.log('\n💡 Note: Content pages (Community Guidelines, Privacy, Safety, Terms)')
    console.log('   have been created with structure. You may need to manually migrate')
    console.log('   the detailed content sections to the database.\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()


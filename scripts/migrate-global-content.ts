/**
 * Global Content Migration Script
 *
 * Migrates navbar, footer, and social links content to Supabase global_content table.
 *
 * Usage:
 *   npx ts-node --project tsconfig.node.json scripts/migrate-global-content.ts
 * OR
 *   npm run migrate:global
 */

import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { adminClient } from '../lib/supabase/admin'

/**
 * Navbar Content
 */
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

/**
 * Footer Content
 */
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
        { href: '/waitlist', label: 'Join Waitlist' },
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

/**
 * Social Links Content
 */
const socialLinksContent = {
  links: [
    { icon: 'Linkedin', url: 'https://www.linkedin.com/company/qoupl-ai/', label: 'LinkedIn' },
    { icon: 'Instagram', url: 'https://www.instagram.com/qoupl.ai?igsh=MWI1bDFqOHplYzY1Nw==', label: 'Instagram' },
  ],
}

/**
 * Main Migration Function
 */
async function migrateGlobalContent() {
  console.log('🌍 Starting global content migration...\n')

  try {
    // ========================================================================
    // MIGRATE NAVBAR CONTENT
    // ========================================================================
    console.log('📱 Migrating navbar content...')

    const { error: navbarError } = await adminClient
      .from('global_content')
      .upsert({
        key: 'navbar',
        content: navbarContent,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })

    if (navbarError) {
      console.error('❌ Error migrating navbar:', navbarError.message)
    } else {
      console.log('✅ Navbar content migrated successfully')
      console.log(`   - ${navbarContent.links.length} navigation links`)
      console.log(`   - Logo: ${navbarContent.logo.src}\n`)
    }

    // ========================================================================
    // MIGRATE FOOTER CONTENT
    // ========================================================================
    console.log('🦶 Migrating footer content...')

    const { error: footerError } = await adminClient
      .from('global_content')
      .upsert({
        key: 'footer',
        content: footerContent,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })

    if (footerError) {
      console.error('❌ Error migrating footer:', footerError.message)
    } else {
      console.log('✅ Footer content migrated successfully')
      console.log(`   - Brand description: ${footerContent.brand.description.substring(0, 50)}...`)
      console.log(`   - ${footerContent.columns.product.links.length} product links`)
      console.log(`   - ${footerContent.columns.company.links.length} company links`)
      console.log(`   - ${footerContent.columns.legal.links.length} legal links`)
      console.log(`   - Copyright: ${footerContent.copyright.company}\n`)
    }

    // ========================================================================
    // MIGRATE SOCIAL LINKS
    // ========================================================================
    console.log('🔗 Migrating social links...')

    const { error: socialError } = await adminClient
      .from('global_content')
      .upsert({
        key: 'social_links',
        content: socialLinksContent,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      })

    if (socialError) {
      console.error('❌ Error migrating social links:', socialError.message)
    } else {
      console.log('✅ Social links migrated successfully')
      socialLinksContent.links.forEach(link => {
        console.log(`   - ${link.label}: ${link.url}`)
      })
      console.log('')
    }

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('═'.repeat(70))
    console.log('✅ GLOBAL CONTENT MIGRATION COMPLETE')
    console.log('═'.repeat(70))
    console.log('Migrated:')
    console.log('  ✓ Navbar content (navigation links + logo)')
    console.log('  ✓ Footer content (brand, columns, copyright)')
    console.log('  ✓ Social links (LinkedIn, Instagram)')
    console.log('\nNext steps:')
    console.log('  - Verify content in Supabase dashboard')
    console.log('  - Components will automatically use this content')
    console.log('  - Run homepage migration: npm run migrate:homepage')
    console.log('═'.repeat(70))

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateGlobalContent()
  .then(() => {
    console.log('\n✅ Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })

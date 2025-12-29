/**
 * Ensure All Pages Exist and Are Published
 * 
 * Creates all required pages if they don't exist and ensures they're published.
 */

import * as dotenv from 'dotenv'
import { join } from 'path'

// Load environment variables BEFORE importing adminClient
dotenv.config({ path: join(process.cwd(), '.env.local') })

// Now import adminClient after env vars are loaded
import { adminClient } from '../lib/supabase/admin'

const requiredPages = [
  { slug: 'home', title: 'Home', description: 'Main landing page' },
  { slug: 'about', title: 'About Us', description: 'About qoupl' },
  { slug: 'faq', title: 'FAQ', description: 'Frequently Asked Questions' },
  { slug: 'pricing', title: 'Pricing', description: 'Pricing plans' },
  { slug: 'features', title: 'Features', description: 'Product features' },
  { slug: 'careers', title: 'Careers', description: 'Career opportunities' },
  { slug: 'community-guidelines', title: 'Community Guidelines', description: 'Community guidelines' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'Privacy policy' },
  { slug: 'safety', title: 'Safety & Security', description: 'Safety and security information' },
  { slug: 'terms', title: 'Terms of Service', description: 'Terms of service' },
]

async function ensurePage(page: { slug: string; title: string; description: string }) {
  // Check if page exists
  const { data: existing } = await adminClient
    .from('pages')
    .select('id, published')
    .eq('slug', page.slug)
    .single()

  if (existing) {
    // Update published status if needed
    if (!existing.published) {
      const { error } = await adminClient
        .from('pages')
        .update({ published: true })
        .eq('id', existing.id)

      if (error) {
        console.error(`❌ Failed to publish page ${page.slug}:`, error.message)
      } else {
        console.log(`✅ Published page: ${page.slug}`)
      }
    } else {
      console.log(`✓ Page already exists and published: ${page.slug}`)
    }
    return existing.id
  }

  // Create page if it doesn't exist
  const { data: newPage, error } = await adminClient
    .from('pages')
    .insert({
      slug: page.slug,
      title: page.title,
      description: page.description,
      published: true,
    })
    .select('id')
    .single()

  if (error) {
    console.error(`❌ Failed to create page ${page.slug}:`, error.message)
    return null
  }

  console.log(`✅ Created page: ${page.slug}`)
  return newPage.id
}

async function main() {
  console.log('🚀 Ensuring all pages exist and are published...\n')

  for (const page of requiredPages) {
    await ensurePage(page)
  }

  console.log('\n✨ All pages ensured!')
}

main().catch(console.error)


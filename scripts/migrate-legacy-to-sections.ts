/**
 * Migration Script: Legacy Tables → Sections
 * 
 * Migrates all content from legacy tables (blog_posts, faqs, features, pricing_plans)
 * to the unified sections table.
 * 
 * Run: ts-node --project tsconfig.node.json scripts/migrate-legacy-to-sections.ts
 */

import { adminClient } from '../lib/supabase/admin'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'

dotenv.config({ path: join(process.cwd(), '.env.local') })

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

async function migrateBlogPosts() {
  console.log('\n📰 Migrating blog_posts to sections...\n')

  const { data: blogPosts, error } = await adminClient
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch blog posts:', error.message)
    return
  }

  if (!blogPosts || blogPosts.length === 0) {
    console.log('⏭️  No blog posts to migrate')
    return
  }

  const blogPageId = await getPageId('blog')
  if (!blogPageId) {
    console.error('❌ Blog page not found, skipping blog posts migration')
    return
  }

  let migrated = 0
  let skipped = 0

  for (const post of blogPosts) {
    // Check if already migrated
    const { data: existing } = await adminClient
      .from('sections')
      .select('id')
      .eq('page_id', blogPageId)
      .eq('component_type', 'blog-post')
      .contains('content', { slug: post.slug })
      .single()

    if (existing) {
      console.log(`⏭️  Skipping blog post: ${post.title} (already migrated)`)
      skipped++
      continue
    }

    // Convert blog post to section
    const sectionData = {
      page_id: blogPageId,
      component_type: 'blog-post',
      order_index: 0, // Will be set based on publish_date
      content: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category_id: post.category_id,
        author: post.author,
        publish_date: post.publish_date,
        read_time: post.read_time,
        featured_image: post.featured_image,
      },
      published: post.published || false,
      created_at: post.created_at,
      updated_at: post.updated_at,
    }

    const { error: insertError } = await adminClient
      .from('sections')
      .insert(sectionData)

    if (insertError) {
      console.error(`❌ Failed to migrate blog post: ${post.title}`, insertError.message)
    } else {
      console.log(`✅ Migrated blog post: ${post.title}`)
      migrated++
    }
  }

  console.log(`\n📊 Blog Posts Migration Summary:`)
  console.log(`   ✅ Migrated: ${migrated}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   📦 Total: ${blogPosts.length}`)
}

async function migrateFAQs() {
  console.log('\n❓ Migrating faqs to sections...\n')

  const { data: faqs, error } = await adminClient
    .from('faqs')
    .select('*')
    .order('category_id, order_index', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch FAQs:', error.message)
    return
  }

  if (!faqs || faqs.length === 0) {
    console.log('⏭️  No FAQs to migrate')
    return
  }

  const faqPageId = await getPageId('faq')
  if (!faqPageId) {
    console.error('❌ FAQ page not found, skipping FAQs migration')
    return
  }

  // Group FAQs by category
  const faqsByCategory = new Map<string, typeof faqs>()
  for (const faq of faqs) {
    const categoryId = faq.category_id || 'uncategorized'
    if (!faqsByCategory.has(categoryId)) {
      faqsByCategory.set(categoryId, [])
    }
    faqsByCategory.get(categoryId)!.push(faq)
  }

  let migrated = 0
  let skipped = 0

  // Create one section per category with all FAQs in that category
  for (const [categoryId, categoryFaqs] of faqsByCategory.entries()) {
    // Check if already migrated
    const { data: existing } = await adminClient
      .from('sections')
      .select('id')
      .eq('page_id', faqPageId)
      .eq('component_type', 'faq-category')
      .contains('content', { category_id: categoryId })
      .single()

    if (existing) {
      console.log(`⏭️  Skipping FAQ category: ${categoryId} (already migrated)`)
      skipped++
      continue
    }

    const sectionData = {
      page_id: faqPageId,
      component_type: 'faq-category',
      order_index: categoryFaqs[0]?.order_index || 0,
      content: {
        category_id: categoryId,
        faqs: categoryFaqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          order_index: faq.order_index,
        })),
      },
      published: categoryFaqs.every((f) => f.published !== false),
      created_at: categoryFaqs[0]?.created_at,
      updated_at: categoryFaqs[categoryFaqs.length - 1]?.updated_at,
    }

    const { error: insertError } = await adminClient
      .from('sections')
      .insert(sectionData)

    if (insertError) {
      console.error(`❌ Failed to migrate FAQ category: ${categoryId}`, insertError.message)
    } else {
      console.log(`✅ Migrated FAQ category: ${categoryId} (${categoryFaqs.length} FAQs)`)
      migrated += categoryFaqs.length
    }
  }

  console.log(`\n📊 FAQs Migration Summary:`)
  console.log(`   ✅ Migrated: ${migrated} FAQs`)
  console.log(`   ⏭️  Skipped: ${skipped} categories`)
  console.log(`   📦 Total: ${faqs.length} FAQs`)
}

async function migrateFeatures() {
  console.log('\n✨ Migrating features to sections...\n')

  const { data: features, error } = await adminClient
    .from('features')
    .select('*')
    .order('category_id, order_index', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch features:', error.message)
    return
  }

  if (!features || features.length === 0) {
    console.log('⏭️  No features to migrate')
    return
  }

  const featuresPageId = await getPageId('features')
  if (!featuresPageId) {
    console.error('❌ Features page not found, skipping features migration')
    return
  }

  // Group features by category
  const featuresByCategory = new Map<string, typeof features>()
  for (const feature of features) {
    const categoryId = feature.category_id || 'uncategorized'
    if (!featuresByCategory.has(categoryId)) {
      featuresByCategory.set(categoryId, [])
    }
    featuresByCategory.get(categoryId)!.push(feature)
  }

  let migrated = 0
  let skipped = 0

  // Create one section per category
  for (const [categoryId, categoryFeatures] of featuresByCategory.entries()) {
    // Check if already migrated
    const { data: existing } = await adminClient
      .from('sections')
      .select('id')
      .eq('page_id', featuresPageId)
      .eq('component_type', 'feature-category')
      .contains('content', { category_id: categoryId })
      .single()

    if (existing) {
      console.log(`⏭️  Skipping feature category: ${categoryId} (already migrated)`)
      skipped++
      continue
    }

    const sectionData = {
      page_id: featuresPageId,
      component_type: 'feature-category',
      order_index: categoryFeatures[0]?.order_index || 0,
      content: {
        category_id: categoryId,
        features: categoryFeatures.map((feature) => ({
          id: feature.id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
          order_index: feature.order_index,
        })),
      },
      published: categoryFeatures.every((f) => f.published !== false),
      created_at: categoryFeatures[0]?.created_at,
      updated_at: categoryFeatures[categoryFeatures.length - 1]?.updated_at,
    }

    const { error: insertError } = await adminClient
      .from('sections')
      .insert(sectionData)

    if (insertError) {
      console.error(`❌ Failed to migrate feature category: ${categoryId}`, insertError.message)
    } else {
      console.log(`✅ Migrated feature category: ${categoryId} (${categoryFeatures.length} features)`)
      migrated += categoryFeatures.length
    }
  }

  console.log(`\n📊 Features Migration Summary:`)
  console.log(`   ✅ Migrated: ${migrated} features`)
  console.log(`   ⏭️  Skipped: ${skipped} categories`)
  console.log(`   📦 Total: ${features.length} features`)
}

async function migratePricingPlans() {
  console.log('\n💰 Migrating pricing_plans to sections...\n')

  const { data: pricingPlans, error } = await adminClient
    .from('pricing_plans')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('❌ Failed to fetch pricing plans:', error.message)
    return
  }

  if (!pricingPlans || pricingPlans.length === 0) {
    console.log('⏭️  No pricing plans to migrate')
    return
  }

  const pricingPageId = await getPageId('pricing')
  if (!pricingPageId) {
    console.error('❌ Pricing page not found, skipping pricing plans migration')
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
    console.log('⏭️  Pricing plans already migrated, skipping')
    return
  }

  // Create single section with all pricing plans
  const sectionData = {
    page_id: pricingPageId,
    component_type: 'pricing-plans',
    order_index: 0,
    content: {
      plans: pricingPlans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        billing_period: plan.billing_period,
        features: plan.features,
        is_popular: plan.is_popular,
        order_index: plan.order_index,
      })),
    },
    published: pricingPlans.every((p) => p.published !== false),
    created_at: pricingPlans[0]?.created_at,
    updated_at: pricingPlans[pricingPlans.length - 1]?.updated_at,
  }

  const { error: insertError } = await adminClient
    .from('sections')
    .insert(sectionData)

  if (insertError) {
    console.error('❌ Failed to migrate pricing plans:', insertError.message)
  } else {
    console.log(`✅ Migrated ${pricingPlans.length} pricing plans`)
  }

  console.log(`\n📊 Pricing Plans Migration Summary:`)
  console.log(`   ✅ Migrated: ${pricingPlans.length} plans`)
}

async function main() {
  console.log('🚀 Starting Legacy Tables → Sections Migration...\n')
  console.log('='.repeat(60))

  try {
    await migrateBlogPosts()
    await migrateFAQs()
    await migrateFeatures()
    await migratePricingPlans()

    console.log('\n' + '='.repeat(60))
    console.log('✨ Migration Complete!')
    console.log('\n💡 Next steps:')
    console.log('   1. Verify migrated data in sections table')
    console.log('   2. Update all queries to use sections')
    console.log('   3. Test CMS with new unified model')
    console.log('   4. Run migration to drop legacy tables\n')
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()


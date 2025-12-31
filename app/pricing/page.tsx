/**
 * Pricing Page - Server Component
 * Fetches pricing sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import PricingClient from './pricing-client'

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

export default async function Pricing() {
  // Fetch pricing sections from database
  const sections = await getPageSections('pricing')

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Pricing Page] Sections found:', sections.length)
    console.log('[Pricing Page] Section types:', sections.map(s => s.component_type))
  }

  // Extract all pricing-related sections
  const findSection = (type: string) => sections.find(s => s.component_type === type)
  
  const pricingHero = findSection('pricing-hero')
  const pricingPlans = findSection('pricing-plans')
  const freeMessages = findSection('free-messages')
  const messageBundles = findSection('message-bundles')
  const pricingInfo = findSection('pricing-info')
  const pricingFaq = findSection('pricing-faq')

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Pricing Page] Found sections:')
    console.log('  - Hero:', pricingHero ? 'Yes' : 'No')
    console.log('  - Plans:', pricingPlans ? 'Yes' : 'No')
    console.log('  - Free Messages:', freeMessages ? 'Yes' : 'No')
    console.log('  - Message Bundles:', messageBundles ? 'Yes' : 'No')
    console.log('  - Pricing Info:', pricingInfo ? 'Yes' : 'No')
    console.log('  - FAQ:', pricingFaq ? 'Yes' : 'No')
  }

  return (
    <PricingClient
      hero={pricingHero?.content}
      plans={pricingPlans?.content?.plans || []}
      freeMessages={freeMessages?.content}
      messageBundles={messageBundles?.content}
      pricingInfo={pricingInfo?.content}
      faq={pricingFaq?.content}
    />
  )
}

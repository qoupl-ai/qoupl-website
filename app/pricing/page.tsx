/**
 * Pricing Page - Server Component
 * Fetches pricing sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import PricingClient from './pricing-client'

export default async function Pricing() {
  // Fetch pricing sections from database
  const sections = await getPageSections('pricing')

  // Extract all pricing-related sections
  const pricingHero = sections.find(s => s.component_type === 'pricing-hero')
  const pricingPlans = sections.find(s => s.component_type === 'pricing-plans')
  const freeMessages = sections.find(s => s.component_type === 'free-messages')
  const messageBundles = sections.find(s => s.component_type === 'message-bundles')
  const pricingInfo = sections.find(s => s.component_type === 'pricing-info')
  const pricingFaq = sections.find(s => s.component_type === 'pricing-faq')

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

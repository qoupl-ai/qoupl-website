/**
 * Pricing Page - Server Component
 * Fetches pricing sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import PricingClient from './pricing-client'
import type {
  PricingHeroSectionData,
  PricingPlansSectionData,
  FreeMessagesSectionData,
  MessageBundlesSectionData,
  PricingInfoSectionData,
  PricingFaqSectionData,
} from '@/types/section'

export default async function Pricing() {
  // Fetch pricing sections from database
  const sections = await getPageSections('pricing')

  // Extract all pricing-related sections
  const pricingHero = sections.find(s => s.section_type === 'pricing-hero')
  const pricingPlans = sections.find(s => s.section_type === 'pricing-plans')
  const freeMessages = sections.find(s => s.section_type === 'free-messages')
  const messageBundles = sections.find(s => s.section_type === 'message-bundles')
  const pricingInfo = sections.find(s => s.section_type === 'pricing-info')
  const pricingFaq = sections.find(s => s.section_type === 'pricing-faq')

  return (
    <PricingClient
      hero={pricingHero?.content as PricingHeroSectionData | undefined}
      pricingPlans={pricingPlans?.content as PricingPlansSectionData | undefined}
      freeMessages={freeMessages?.content as FreeMessagesSectionData | undefined}
      messageBundles={messageBundles?.content as MessageBundlesSectionData | undefined}
      pricingInfo={pricingInfo?.content as PricingInfoSectionData | undefined}
      faq={pricingFaq?.content as PricingFaqSectionData | undefined}
    />
  )
}

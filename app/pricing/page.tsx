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
  const pricingHero = sections.find(s => s.section_type === 'pricing-hero')
  const pricingPlans = sections.find(s => s.section_type === 'pricing-plans')
  const freeMessages = sections.find(s => s.section_type === 'free-messages')
  const messageBundles = sections.find(s => s.section_type === 'message-bundles')
  const pricingInfo = sections.find(s => s.section_type === 'pricing-info')
  const pricingFaq = sections.find(s => s.section_type === 'pricing-faq')

  return (
    <PricingClient
      hero={pricingHero?.content as { title?: string; subtitle?: string; badge?: { icon?: string; text?: string } } | undefined}
      plans={((pricingPlans?.content as { plans?: Array<{ name: string; price: number; currency?: string; billing_period?: string; features: string[]; is_popular?: boolean; order_index?: number }> } | undefined)?.plans || [])}
      freeMessages={freeMessages?.content as { count?: number; title?: string; description?: string } | undefined}
      messageBundles={messageBundles?.content as { price_per_message?: number; gst_rate?: number; bundles?: Array<{ messages: number; popular: boolean }>; min_messages?: number; max_messages?: number; title?: string; subtitle?: string } | undefined}
      pricingInfo={pricingInfo?.content as { title?: string; items?: string[] } | undefined}
      faq={pricingFaq?.content as { title?: string; faqs?: Array<{ question: string; answer: string }>; cta?: { text?: string; link?: string } } | undefined}
    />
  )
}

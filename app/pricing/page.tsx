/**
 * Pricing Page - Server Component
 * Fetches pricing sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import PricingClient from './pricing-client'

export default async function Pricing() {
  // Fetch pricing sections from database
  const sections = await getPageSections('pricing')

  // Find pricing plans section
  const pricingSection = sections.find(s => s.component_type === 'pricing-plans')
  const plans = pricingSection?.content?.plans || []

  return <PricingClient plans={plans} />
}

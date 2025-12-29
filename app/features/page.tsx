/**
 * Features Page - Server Component
 * Fetches feature sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import FeaturesClient from './features-client'

export default async function Features() {
  // Fetch feature sections from database
  const sections = await getPageSections('features')

  // Find feature categories section
  const featuresSection = sections.find(s => s.component_type === 'feature-category')
  const categories = featuresSection?.content?.features || []

  return <FeaturesClient categories={categories} />
}

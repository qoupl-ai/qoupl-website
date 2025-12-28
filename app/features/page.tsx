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
  const featuresSection = sections.find(s => s.section_type === 'feature-category')
  const content = featuresSection?.content as { features?: Array<{
    id?: string;
    title: string;
    icon?: string;
    color?: string;
    image?: string;
    coupleImage?: string;
    features?: Array<{ id?: string; title: string; description: string }>;
  }> } | undefined
  const categories = content?.features || []

  return <FeaturesClient categories={categories} />
}

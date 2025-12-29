/**
 * Features Page - Server Component
 * Fetches feature sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import FeaturesClient from './features-client'

export default async function Features() {
  // Fetch feature sections from database
  const sections = await getPageSections('features')

  // Find feature categories section (check both column names)
  const featuresSection = sections.find(s => 
    (s.component_type === 'feature-category') || 
    ((s as any).section_type === 'feature-category')
  )
  const categories = featuresSection?.content?.features || []

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Features Page] Sections found:', sections.length)
    console.log('[Features Page] Feature section:', featuresSection ? 'Found' : 'Not found')
    console.log('[Features Page] Categories:', categories.length)
  }

  return <FeaturesClient categories={categories} />
}

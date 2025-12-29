/**
 * Features Page - Server Component
 * Fetches feature sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import FeaturesClient from './features-client'
import { featureCategorySectionSchema } from '@/lib/validation/section-schemas'
import type { FeatureCategorySectionData } from '@/types/section'

export default async function Features() {
  // Fetch feature sections from database
  const sections = await getPageSections('features')

  // Find feature categories section
  const featuresSection = sections.find(s => s.section_type === 'feature-category')
  const rawContent = (featuresSection?.content || {}) as Record<string, unknown>
  const parsed = featureCategorySectionSchema.safeParse({
    type: 'feature-category',
    order_index: featuresSection?.order_index ?? 0,
    published: featuresSection?.published ?? false,
    data: rawContent,
  })

  const data = parsed.success ? (parsed.data.data as FeatureCategorySectionData) : undefined

  if (!parsed.success && process.env.NODE_ENV !== 'production') {
    throw new Error(`Feature category data invalid: ${parsed.error.message}`)
  }

  return <FeaturesClient data={data} />
}

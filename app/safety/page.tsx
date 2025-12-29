/**
 * Safety & Security Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import type { ContentSectionData } from '@/types/section'
import SafetyClient from './safety-client'

export default async function SafetySecurity() {
  // Fetch safety sections from database
  const sections = await getPageSections('safety')

  // Find content section
  const contentSection = sections.find(s => s.section_type === 'content')
  const content = contentSection?.content as ContentSectionData | undefined

  if (!content && process.env.NODE_ENV !== 'production') {
    throw new Error('Safety page content is missing in CMS.')
  }

  return <SafetyClient content={content || {}} />
}

/**
 * Terms of Service Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import type { ContentSectionData } from '@/types/section'
import TermsClient from './terms-client'

export default async function TermsOfService() {
  // Fetch terms sections from database
  const sections = await getPageSections('terms')

  // Find content section
  const contentSection = sections.find(s => s.section_type === 'content')
  const content = contentSection?.content as ContentSectionData | undefined

  if (!content && process.env.NODE_ENV !== 'production') {
    throw new Error('Terms page content is missing in CMS.')
  }

  return <TermsClient content={content || {}} />
}

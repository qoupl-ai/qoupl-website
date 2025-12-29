/**
 * Community Guidelines Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import type { ContentSectionData } from '@/types/section'
import CommunityGuidelinesClient from './community-guidelines-client'

export default async function CommunityGuidelines() {
  // Fetch community guidelines sections from database
  const sections = await getPageSections('community-guidelines')

  // Find content section
  const contentSection = sections.find(s => s.section_type === 'content')
  const content = contentSection?.content as ContentSectionData | undefined

  if (!content && process.env.NODE_ENV !== 'production') {
    throw new Error('Community guidelines content is missing in CMS.')
  }

  return <CommunityGuidelinesClient content={content || {}} />
}

/**
 * Privacy Policy Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import type { ContentSectionData } from '@/types/section'
import PrivacyClient from './privacy-client'

export default async function PrivacyPolicy() {
  // Fetch privacy sections from database
  const sections = await getPageSections('privacy')

  // Find content section
  const contentSection = sections.find(s => s.section_type === 'content')
  const content = contentSection?.content as ContentSectionData | undefined

  if (!content && process.env.NODE_ENV !== 'production') {
    throw new Error('Privacy page content is missing in CMS.')
  }

  return <PrivacyClient content={content || {}} />
}

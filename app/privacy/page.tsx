/**
 * Privacy Policy Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import PrivacyClient from './privacy-client'

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

interface DatabaseSection {
  component_type?: string
  section_type?: string
  content?: Record<string, unknown>
}

export default async function PrivacyPolicy() {
  // Fetch privacy sections from database
  const sections = await getPageSections('privacy')

  // Find content section (check both column names)
  const contentSection = sections.find((s: DatabaseSection) =>
    (s.component_type === 'content') ||
    (s.section_type === 'content')
  )
  const content = contentSection?.content || {}

  return <PrivacyClient content={content} />
}

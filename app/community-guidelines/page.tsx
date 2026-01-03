/**
 * Community Guidelines Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import CommunityGuidelinesClient from './community-guidelines-client'

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

interface DatabaseSection {
  component_type?: string
  section_type?: string
  content?: Record<string, unknown>
}

export default async function CommunityGuidelines() {
  // Fetch community guidelines sections from database
  const sections = await getPageSections('community-guidelines')

  // Find content section (check both column names)
  const contentSection = sections.find(s => 
    (s.component_type === 'content') || 
    ((s as DatabaseSection).section_type === 'content')
  )
  const content = contentSection?.content || {}

  return <CommunityGuidelinesClient content={content} />
}

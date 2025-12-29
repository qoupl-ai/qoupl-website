/**
 * Safety & Security Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import SafetyClient from './safety-client'

export default async function SafetySecurity() {
  // Fetch safety sections from database
  const sections = await getPageSections('safety')

  // Find content section
  const contentSection = sections.find(s => s.component_type === 'content')
  const content = contentSection?.content || {}

  return <SafetyClient content={content} />
}

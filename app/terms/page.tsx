/**
 * Terms of Service Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import TermsClient from './terms-client'

export default async function TermsOfService() {
  // Fetch terms sections from database
  const sections = await getPageSections('terms')

  // Find content section
  const contentSection = sections.find(s => s.component_type === 'content')
  const content = contentSection?.content || {}

  return <TermsClient content={content} />
}

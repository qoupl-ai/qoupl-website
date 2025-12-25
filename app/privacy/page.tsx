/**
 * Privacy Policy Page - Server Component
 * Fetches content from database
 */

import { getPageSections } from '@/lib/supabase/content'
import PrivacyClient from './privacy-client'

export default async function PrivacyPolicy() {
  // Fetch privacy sections from database
  const sections = await getPageSections('privacy')

  // Find content section
  const contentSection = sections.find(s => s.component_type === 'content')
  const content = contentSection?.content || {}

  return <PrivacyClient content={content} />
}

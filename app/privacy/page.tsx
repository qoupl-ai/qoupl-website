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
  const contentSection = sections.find(s => s.section_type === 'content')
  const content = (contentSection?.content || {}) as { title?: string; lastUpdated?: string; sections?: unknown[] }

  return <PrivacyClient content={content} />
}

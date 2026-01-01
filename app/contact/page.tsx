/**
 * Contact Page - Server Component
 * Fetches contact info and page sections from database
 */

import { getContactInfo } from '@/lib/supabase/content'
import { getPageSections } from '@/lib/supabase/content'
import ContactClient from './contact-client'

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

export default async function Contact() {
  // Fetch contact info from global_content
  const contactInfo = await getContactInfo()
  
  // Fetch contact page sections
  const sections = await getPageSections('contact')
  
  // Find hero/content section
  const heroSection = sections.find(s => s.component_type === 'hero' || s.component_type === 'content')
  const pageContent = heroSection?.content || {}

  return <ContactClient contactInfo={contactInfo} pageContent={pageContent} />
}

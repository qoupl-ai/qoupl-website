/**
 * About Page - Server Component
 * Fetches about page sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import AboutClient from './about-client'

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

export default async function AboutUs() {
  // Fetch about page sections from database
  const sections = await getPageSections('about')

  // Transform sections data
  const aboutData = {
    sections: sections.map(section => ({
      type: section.component_type,
      content: section.content,
    })),
  }

  return <AboutClient data={aboutData} />
}

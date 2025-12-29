/**
 * Careers Page - Server Component
 * Fetches careers page sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import CareersClient from './careers-client'

export default async function Careers() {
  // Fetch careers page sections from database
  const sections = await getPageSections('careers')

  // Transform sections data
  const careersData = {
    sections: sections.map(section => ({
      type: section.component_type,
      content: section.content,
    })),
  }

  return <CareersClient data={careersData} />
}

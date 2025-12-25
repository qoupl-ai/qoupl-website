/**
 * FAQ Page - Server Component
 * Fetches FAQ sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import FAQClient from './faq-client'

export default async function FAQ() {
  // Fetch FAQ sections from database
  const sections = await getPageSections('faq')

  // Transform sections data to FAQ format
  const faqs = sections
    .filter(section => section.component_type === 'faq-category')
    .map(section => ({
      category: section.content.category_id || 'General',
      questions: section.content.faqs || [],
    }))

  // Fallback to empty array if no FAQs found
  const faqData = faqs.length > 0 ? faqs : []

  return <FAQClient faqs={faqData} />
}

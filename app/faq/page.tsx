/**
 * FAQ Page - Server Component
 * Fetches FAQ sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import FAQClient from './faq-client'

// Enable ISR with 3-hour revalidation
export const revalidate = 10800;

// Category ID to display name mapping
const categoryNameMap: Record<string, string> = {
  'getting-started': 'Getting Started',
  'matching-discovery': 'Matching & Discovery',
  'messaging-communication': 'Messaging & Communication',
  'safety-privacy': 'Safety & Privacy',
  'premium-features': 'Premium Features',
  'profile-account': 'Profile & Account',
  'technical-support': 'Technical Support',
  'success-tips': 'Success & Tips',
}

export default async function FAQ() {
  // Fetch FAQ sections from database
  const sections = await getPageSections('faq')

  // Transform sections data to FAQ format
  const faqs = sections
    .filter(section => section.component_type === 'faq-category')
    .map(section => {
      const categoryId = section.content.category_id || 'general'
      return {
        category: categoryNameMap[categoryId] || categoryId,
        questions: (section.content.faqs || []).map((faq: any) => ({
          q: faq.question || faq.q,
          a: faq.answer || faq.a,
        })),
      }
    })

  // Fallback to empty array if no FAQs found
  const faqData = faqs.length > 0 ? faqs : []

  return <FAQClient faqs={faqData} />
}

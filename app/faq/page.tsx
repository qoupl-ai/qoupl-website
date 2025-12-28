/**
 * FAQ Page - Server Component
 * Fetches FAQ sections from database
 */

import { getPageSections } from '@/lib/supabase/content'
import FAQClient from './faq-client'

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
    .filter(section => section.section_type === 'faq-category')
    .map(section => {
      const content = section.content as Record<string, unknown>
      const categoryId = (typeof content['category_id'] === 'string' ? content['category_id'] : 'general')
      const faqsArray = Array.isArray(content['faqs']) ? content['faqs'] : []
      return {
        category: categoryNameMap[categoryId] || categoryId,
        questions: faqsArray.map((faq: unknown) => {
          const faqObj = faq as Record<string, unknown>
          return {
            q: (typeof faqObj['question'] === 'string' ? faqObj['question'] : null) || 
               (typeof faqObj['q'] === 'string' ? faqObj['q'] : ''),
            a: (typeof faqObj['answer'] === 'string' ? faqObj['answer'] : null) || 
               (typeof faqObj['a'] === 'string' ? faqObj['a'] : ''),
          }
        }),
      }
    })

  // Fallback to empty array if no FAQs found
  const faqData = faqs.length > 0 ? faqs : []

  return <FAQClient faqs={faqData} />
}

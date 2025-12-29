/**
 * FAQ Page - Server Component
 * Fetches FAQ sections from database
 */

import { getGlobalContentTyped, getPageSections } from '@/lib/supabase/content'
import type { FaqUiContentData } from '@/lib/validation/global-content-schemas'
import FAQClient from './faq-client'

export default async function FAQ() {
  // Fetch FAQ sections from database
  const sections = await getPageSections('faq')
  const faqUi = await getGlobalContentTyped<FaqUiContentData>('faq_ui')

  if (!faqUi && process.env.NODE_ENV !== 'production') {
    throw new Error('FAQ UI content is missing in CMS.')
  }

  // Transform sections data to FAQ format
  const faqs = sections
    .filter(section => section.section_type === 'faq-category')
    .map(section => {
      const content = section.content as Record<string, unknown>
      const categoryId = (typeof content['category_id'] === 'string' ? content['category_id'] : '')
      const categoryLabel = (typeof content['category_label'] === 'string' ? content['category_label'] : '')

      if (!categoryLabel && categoryId && process.env.NODE_ENV !== 'production') {
        throw new Error(`FAQ category label is missing for category \"${categoryId}\".`)
      }
      const faqsArray = Array.isArray(content['faqs']) ? content['faqs'] : []
      return {
        category: categoryLabel || categoryId,
        questions: faqsArray.map((faq: unknown) => {
          const faqObj = faq as Record<string, unknown>
          return {
            q: (typeof faqObj['question'] === 'string' ? faqObj['question'] : null) || 
               (typeof faqObj['q'] === 'string' ? faqObj['q'] : ''),
            a: (typeof faqObj['answer'] === 'string' ? faqObj['answer'] : null) || 
               (typeof faqObj['a'] === 'string' ? faqObj['a'] : ''),
            order_index: (typeof faqObj['order_index'] === 'number' ? faqObj['order_index'] : 0),
            show: faqObj['show'] !== false,
          }
        })
        .filter((item) => item.show && (item.q.length > 0 || item.a.length > 0))
        .sort((a, b) => a.order_index - b.order_index),
      }
    })
    .filter((category) => category.category.length > 0 && category.questions.length > 0)

  // Fallback to empty array if no FAQs found
  const faqData = faqs.length > 0 ? faqs : []

  return <FAQClient faqs={faqData} ui={faqUi || {}} />
}

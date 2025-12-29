/**
 * Contact Page - Server Component
 * Fetches contact page sections from database
 */

import type { ZodTypeAny } from 'zod'
import { getPageSections } from '@/lib/supabase/content'
import ContactClient from './contact-client'
import {
  contactHeroSectionSchema,
  contactInfoSectionSchema,
  contactInfoDetailsSectionSchema,
} from '@/lib/validation/section-schemas'
import type {
  ContactHeroSectionData,
  ContactInfoSectionData,
  ContactInfoDetailsSectionData,
} from '@/types/section'

export default async function ContactPage() {
  // Fetch contact page sections from database
  const sections = await getPageSections('contact')

  const parseSection = <T,>(
    section: (typeof sections)[number] | undefined,
    schema: ZodTypeAny,
    type: string,
    required = false
  ): T | undefined => {
    if (!section) {
      if (required && process.env.NODE_ENV !== 'production') {
        throw new Error(`Contact page is missing required "${type}" section.`)
      }
      return undefined
    }

    const parsed = schema.safeParse({
      type,
      order_index: section.order_index ?? 0,
      published: section.published ?? false,
      data: (section.content || {}) as Record<string, unknown>,
    })

    if (!parsed.success) {
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Contact page "${type}" section data invalid: ${parsed.error.message}`)
      }
      return undefined
    }

    return parsed.data.data as T
  }

  const contactHero = parseSection<ContactHeroSectionData>(
    sections.find((section) => section.section_type === 'contact-hero'),
    contactHeroSectionSchema,
    'contact-hero',
    true
  )
  const contactInfo = parseSection<ContactInfoSectionData>(
    sections.find((section) => section.section_type === 'contact-info'),
    contactInfoSectionSchema,
    'contact-info',
    true
  )
  const contactInfoDetails = parseSection<ContactInfoDetailsSectionData>(
    sections.find((section) => section.section_type === 'contact-info-details'),
    contactInfoDetailsSectionSchema,
    'contact-info-details',
    true
  )

  return <ContactClient hero={contactHero} contactInfo={contactInfo} contactInfoDetails={contactInfoDetails} />
}

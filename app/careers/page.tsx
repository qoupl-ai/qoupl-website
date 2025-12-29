/**
 * Careers Page - Server Component
 * Fetches careers page sections from database
 */

import type { ZodTypeAny } from 'zod'
import { getPageSections } from '@/lib/supabase/content'
import {
  heroSectionSchema,
  comingSoonSectionSchema,
  valuesSectionSchema,
  whyJoinSectionSchema,
} from '@/lib/validation/section-schemas'
import type {
  HeroSectionData,
  ComingSoonSectionData,
  ValuesSectionData,
  WhyJoinSectionData,
} from '@/types/section'
import CareersClient from './careers-client'

export default async function Careers() {
  // Fetch careers page sections from database
  const sections = await getPageSections('careers')

  const parseSection = <T,>(
    section: (typeof sections)[number] | undefined,
    schema: ZodTypeAny,
    type: string,
    required = false
  ): T | undefined => {
    if (!section) {
      if (required && process.env.NODE_ENV !== 'production') {
        throw new Error(`Careers page is missing required \"${type}\" section.`)
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
        throw new Error(`Careers page \"${type}\" section data invalid: ${parsed.error.message}`)
      }
      return undefined
    }

    return parsed.data.data as T
  }

  const heroSection = sections.find((section) => section.section_type === 'hero')
  const comingSoonSection = sections.find((section) => section.section_type === 'coming-soon')
  const valuesSection = sections.find((section) => section.section_type === 'values')
  const whyJoinSection = sections.find((section) => section.section_type === 'why-join')

  const hero = parseSection<HeroSectionData>(heroSection, heroSectionSchema, 'hero', true)
  const comingSoon = parseSection<ComingSoonSectionData>(comingSoonSection, comingSoonSectionSchema, 'coming-soon', true)
  const values = parseSection<ValuesSectionData>(valuesSection, valuesSectionSchema, 'values', true)
  const whyJoin = parseSection<WhyJoinSectionData>(whyJoinSection, whyJoinSectionSchema, 'why-join', true)

  const careersData = {
    sections: [
      hero ? { type: 'hero', content: hero } : null,
      comingSoon ? { type: 'coming-soon', content: comingSoon } : null,
      values ? { type: 'values', content: values } : null,
      whyJoin ? { type: 'why-join', content: whyJoin } : null,
    ].filter((section): section is { type: string; content: unknown } => !!section),
  }

  return <CareersClient data={careersData} />
}

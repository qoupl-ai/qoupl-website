/**
 * About Page - Server Component
 * Fetches about page sections from database
 */

import type { ZodTypeAny } from 'zod'
import { getPageSections } from '@/lib/supabase/content'
import AboutClient from './about-client'
import {
  heroSectionSchema,
  valuesSectionSchema,
  timelineSectionSchema,
  whyJoinSectionSchema,
  appDownloadSectionSchema,
} from '@/lib/validation/section-schemas'
import type {
  HeroSectionData,
  ValuesSectionData,
  TimelineSectionData,
  WhyJoinSectionData,
  AppDownloadSectionData,
} from '@/types/section'

export default async function AboutUs() {
  // Fetch about page sections from database
  const sections = await getPageSections('about')

  const parseSection = <T,>(
    section: (typeof sections)[number] | undefined,
    schema: ZodTypeAny,
    type: string,
    required = false
  ): T | undefined => {
    if (!section) {
      if (required && process.env.NODE_ENV !== 'production') {
        throw new Error(`About page is missing required "${type}" section.`)
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
        throw new Error(`About page "${type}" section data invalid: ${parsed.error.message}`)
      }
      return undefined
    }

    return parsed.data.data as T
  }

  const heroSection = sections.find((section) => section.section_type === 'hero')
  const timelineSection = sections.find((section) => section.section_type === 'timeline')
  const whyJoinSection = sections.find((section) => section.section_type === 'why-join')
  const ctaSection = sections.find((section) => section.section_type === 'app-download')
  const valuesSections = sections.filter((section) => section.section_type === 'values')

  const hero = parseSection<HeroSectionData>(heroSection, heroSectionSchema, 'hero', true)
  const timeline = parseSection<TimelineSectionData>(timelineSection, timelineSectionSchema, 'timeline', true)
  const whyJoin = parseSection<WhyJoinSectionData>(whyJoinSection, whyJoinSectionSchema, 'why-join', true)
  const cta = parseSection<AppDownloadSectionData>(ctaSection, appDownloadSectionSchema, 'app-download', true)

  const parsedValues = valuesSections
    .map((section) => parseSection<ValuesSectionData>(section, valuesSectionSchema, 'values'))
    .filter((value): value is ValuesSectionData => !!value)

  const missionVision = parsedValues.find((value) => value.useMissionVisionLayout === true)
  const values = parsedValues.find((value) => value.useMissionVisionLayout !== true)

  if (!missionVision && process.env.NODE_ENV !== 'production') {
    throw new Error('About page is missing a Values section configured for Mission & Vision.')
  }

  if (!values && process.env.NODE_ENV !== 'production') {
    throw new Error('About page is missing a Values section for core values.')
  }

  return (
    <AboutClient
      hero={hero}
      missionVision={missionVision}
      values={values}
      timeline={timeline}
      whyJoin={whyJoin}
      cta={cta}
    />
  )
}

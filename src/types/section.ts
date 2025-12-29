/**
 * Section Types
 * 
 * Type definitions for page sections/components.
 * Mirrors the database schema exactly.
 * 
 * Sections are stored in the `sections` table with:
 * - section_type: string (e.g., 'hero', 'features', 'gallery')
 * - content: JSONB (type-specific data structure)
 */

import { z } from 'zod'

// ISO 8601 datetime regex pattern (matches: YYYY-MM-DDTHH:mm:ss.sssZ or variations)
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/

// UUID v4 regex pattern (matches: 8-4-4-4-12 hexadecimal characters)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Helper for datetime string validation (replaces deprecated .datetime())
const datetimeString = () => z.string().regex(isoDateTimeRegex, 'Invalid ISO 8601 datetime format')

// Helper for UUID string validation (replaces deprecated .uuid())
const uuidString = () => z.string().regex(uuidRegex, 'Invalid UUID format')
import type { Section as DatabaseSection } from '@/lib/supabase/database.types'

// ============================================================================
// Database Types (re-exported for convenience)
// ============================================================================

export type Section = DatabaseSection

// ============================================================================
// Base Section Schema (mirrors DB structure)
// ============================================================================

export const baseSectionSchema = z.object({
  id: uuidString(),
  page_id: uuidString(),
  section_type: z.string().min(1),
  order_index: z.number().int().min(0),
  content: z.record(z.string(), z.unknown()),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
  created_by: uuidString().nullable(),
  updated_by: uuidString().nullable(),
})

// ============================================================================
// Section Type Definitions
// ============================================================================

export type SectionType =
  | 'hero'
  | 'blog-post'
  | 'faq-category'
  | 'feature-category'
  | 'pricing-plans'
  | 'pricing-hero'
  | 'free-messages'
  | 'message-bundles'
  | 'pricing-info'
  | 'pricing-faq'
  | 'contact-hero'
  | 'contact-info'
  | 'contact-info-details'
  | 'how-it-works'
  | 'gallery'
  | 'testimonials'
  | 'app-download'
  | 'coming-soon'
  | 'timeline'
  | 'why-join'
  | 'content'
  | 'values'

// ============================================================================
// Section Content Data Types
// ============================================================================

// Hero Section
export interface HeroSectionData {
  title: string
  tagline?: string
  subtitle?: string
  image?: string
  background_image?: string
  images?: {
    women?: string[]
    men?: string[]
  }
  cta?: {
    text?: string
    buttonText?: string
    link?: string
    subtext?: string
    badge?: string
  }
}

// Blog Post Section
export interface BlogPostSectionData {
  title: string
  slug: string
  excerpt: string
  content: string
  category_id?: string
  author?: string
  publish_date?: string
  read_time?: number
  featured_image?: string
}

// FAQ Category Section
export interface FaqCategorySectionData {
  category_id: string
  faqs: Array<{
    question: string
    answer: string
    order_index?: number
  }>
}

// Feature Category Section
export interface FeatureCategorySectionData {
  category_id: string
  features: Array<{
    title: string
    description: string
    icon?: string
    order_index?: number
  }>
}

// Pricing Plans Section
export interface PricingPlansSectionData {
  plans: Array<{
    name: string
    price: number
    currency?: string
    billing_period?: string
    features: string[]
    is_popular?: boolean
    order_index?: number
  }>
}

// Pricing Hero Section
export interface PricingHeroSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
}

// Free Messages Section
export interface FreeMessagesSectionData {
  count?: number
  title?: string
  description?: string
}

// Message Bundles Section
export interface MessageBundlesSectionData {
  price_per_message?: number
  gst_rate?: number
  bundles: Array<{
    messages: number
    popular?: boolean
  }>
  min_messages?: number
  max_messages?: number
  title?: string
  subtitle?: string
}

// Pricing Info Section
export interface PricingInfoSectionData {
  title?: string
  items: string[]
}

// Pricing FAQ Section
export interface PricingFaqSectionData {
  title?: string
  faqs: Array<{
    question: string
    answer: string
  }>
  cta?: {
    text?: string
    link?: string
  }
}

// Contact Hero Section
export interface ContactHeroSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
}

// Contact Info Section
export interface ContactInfoSectionData {
  title?: string
  items?: Array<{
    icon?: string
    title?: string
    details?: string
    link?: string | null
  }>
}

// Contact Info Details Section
export interface ContactInfoDetailsSectionData {
  title?: string
  description?: string
  items?: Array<{
    icon?: string
    title?: string
    description?: string
  }>
  faq_link?: {
    text?: string
    url?: string
  }
}

// How It Works Section
export interface HowItWorksSectionData {
  title?: string
  steps: Array<{
    step: string
    title: string
    description: string
    image?: string
  }>
}

// Gallery Section
export interface GallerySectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
  images: Array<{
    image: string
    alt?: string
    title?: string
    story?: string
  }>
  cta?: {
    text?: string
    highlight?: string
  }
}

// Testimonials Section
export interface TestimonialsSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
  testimonials: Array<{
    name: string
    image?: string
    text: string
    location?: string
    rating?: number
    date?: string
  }>
  stats?: {
    text?: string
    icon?: string
  }
}

// App Download Section
export interface AppDownloadSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
  benefits?: string[]
  cta?: {
    text?: string
    subtext?: string
  }
  platforms?: Array<{
    name: string
    icon?: string
    coming?: boolean
  }>
  stats?: {
    text?: string
    count?: string
    suffix?: string
  }
  images?: {
    decorative?: string[]
  }
}

// Coming Soon Section
export interface ComingSoonSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
  }
  cta?: {
    text?: string
  }
  platforms?: Array<{
    name: string
    icon?: string
    coming?: boolean
  }>
  stats?: {
    text?: string
    count?: string
  }
  screenshots?: string[]
}

// Timeline Section
export interface TimelineSectionData {
  timeline: Array<{
    year: string
    event: string
    description: string
  }>
}

// Why Join Section
export interface WhyJoinSectionData {
  items: Array<{
    title: string
    description: string
    icon: string
  }>
}

// Values Section
export interface ValuesSectionData {
  values: Array<{
    icon: string
    title: string
    description: string
    color?: string
  }>
}

// Generic Content Section
export type ContentSectionData = Record<string, unknown>

// ============================================================================
// Union Type for All Section Data
// ============================================================================

export type SectionData =
  | HeroSectionData
  | BlogPostSectionData
  | FaqCategorySectionData
  | FeatureCategorySectionData
  | PricingPlansSectionData
  | PricingHeroSectionData
  | FreeMessagesSectionData
  | MessageBundlesSectionData
  | PricingInfoSectionData
  | PricingFaqSectionData
  | ContactHeroSectionData
  | ContactInfoSectionData
  | ContactInfoDetailsSectionData
  | HowItWorksSectionData
  | GallerySectionData
  | TestimonialsSectionData
  | AppDownloadSectionData
  | ComingSoonSectionData
  | TimelineSectionData
  | WhyJoinSectionData
  | ValuesSectionData
  | ContentSectionData

// ============================================================================
// Typed Section (with proper content type)
// ============================================================================

export interface TypedSection<T extends SectionType = SectionType> {
  id: string
  page_id: string
  section_type: T
  order_index: number
  content: SectionData
  published: boolean
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
}

// ============================================================================
// Helper: Type-safe content access
// ============================================================================

export function assertSectionType<T extends SectionType>(
  section: Section,
  type: T
): section is Section & { section_type: T; content: Record<string, unknown> } {
  return section.section_type === type
}


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
  | 'product-features'
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
  titleHighlight?: string
  tagline?: string
  subtitle?: string
  description?: string
  showTagline?: boolean
  showSubtitle?: boolean
  showDescription?: boolean
  badge?: {
    text?: string
    icon?: string
    show?: boolean
  }
  stats?: Array<{
    text?: string
    icon?: string
    show?: boolean
  }>
  images?: {
    women?: Array<{
      image?: string
      alt?: string
    }>
    men?: Array<{
      image?: string
      alt?: string
    }>
    grid?: Array<{
      image?: string
      alt?: string
    }>
  }
  cta?: {
    text?: string
    buttonText?: string
    link?: string
    subtext?: string
    badge?: string
    icon?: string
    show?: boolean
    showBadge?: boolean
    showSubtext?: boolean
  }
  decorative?: {
    icon?: string
    show?: boolean
    showParticles?: boolean
  }
  floatingBadge?: {
    value?: string
    label?: string
    icon?: string
    show?: boolean
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
  category_label?: string
  faqs: Array<{
    question: string
    answer: string
    order_index?: number
    show?: boolean
  }>
}

// Feature Category Section
export interface FeatureCategorySectionData {
  hero?: {
    title?: string
    titleHighlight?: string
    subtitle?: string
    showTitle?: boolean
    showSubtitle?: boolean
  }
  features: Array<{
    title: string
    icon?: string
    color?: string
    image?: string
    imageAlt?: string
    show?: boolean
    features?: Array<{
      title: string
      description: string
      icon?: string
      show?: boolean
    }>
  }>
  cta?: {
    title?: string
    subtitle?: string
    buttonText?: string
    show?: boolean
  }
}

// Product Features Section
export interface ProductFeaturesSectionData {
  title?: string
  subtitle?: string
  showTitle?: boolean
  showSubtitle?: boolean
  highlightIcon?: string
  features: Array<{
    icon?: string
    title: string
    description: string
    highlights?: string[]
    image?: string
    imageAlt?: string
    color?: string
    showHighlights?: boolean
    show?: boolean
  }>
}

// Pricing Plans Section
export interface PricingPlansSectionData {
  plans: Array<{
    icon?: string
    name: string
    price: number
    currency?: string
    billing_period?: string
    description?: string
    features: string[]
    featureIcon?: string
    showFeatures?: boolean
    is_popular?: boolean
    order_index?: number
  }>
}

// Pricing Hero Section
export interface PricingHeroSectionData {
  title?: string
  titleHighlight?: string
  subtitle?: string
  showTitle?: boolean
  showSubtitle?: boolean
  badge?: {
    icon?: string
    text?: string
    show?: boolean
  }
}

// Free Messages Section
export interface FreeMessagesSectionData {
  count?: number
  title?: string
  description?: string
  icon?: string
  show?: boolean
  showIcon?: boolean
}

// Message Bundles Section
export interface MessageBundlesSectionData {
  price_per_message?: number
  gst_rate?: number
  currencySymbol?: string
  icon?: string
  showIcon?: boolean
  show?: boolean
  bundles: Array<{
    messages: number
    popular?: boolean
    label?: string
    show?: boolean
  }>
  min_messages?: number
  max_messages?: number
  title?: string
  subtitle?: string
  labels?: {
    popular?: string
    messages?: string
    customBundleTitle?: string
    customBundleSubtitle?: string
    quantityLabel?: string
    basePriceLabel?: string
    gstLabel?: string
    totalLabel?: string
    purchaseLabel?: string
  }
}

// Pricing Info Section
export interface PricingInfoSectionData {
  title?: string
  items: string[]
  icon?: string
  itemIcon?: string
  show?: boolean
  showIcon?: boolean
  showItemIcon?: boolean
}

// Pricing FAQ Section
export interface PricingFaqSectionData {
  title?: string
  faqs: Array<{
    question: string
    answer: string
    show?: boolean
  }>
  cta?: {
    text?: string
    link?: string
    buttonText?: string
    show?: boolean
  }
}

// Contact Hero Section
export interface ContactHeroSectionData {
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
    show?: boolean
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
    show?: boolean
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
    show?: boolean
  }>
  faq_link?: {
    text?: string
    url?: string
    icon?: string
    title?: string
    description?: string
    show?: boolean
  }
  form?: {
    title?: string
    required_indicator?: string
    name_label?: string
    name_placeholder?: string
    email_label?: string
    email_placeholder?: string
    subject_label?: string
    subject_placeholder?: string
    message_label?: string
    message_placeholder?: string
    submit_text?: string
    submit_icon?: string
    sending_text?: string
    success_title?: string
    success_message?: string
    success_icon?: string
    error_message?: string
    toast_success?: string
    toast_error?: string
    show?: boolean
  }
}

// How It Works Section
export interface HowItWorksSectionData {
  title?: string
  titleHighlight?: string
  showTitle?: boolean
  steps: Array<{
    step: string
    title: string
    description: string
    image?: string
    imageAlt?: string
    showImage?: boolean
    showBadge?: boolean
  }>
}

// Gallery Section
export interface GallerySectionData {
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
    show?: boolean
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
    show?: boolean
  }
  successBadge?: {
    text?: string
    show?: boolean
  }
  icons?: {
    badge?: string
    story?: string
  }
}

// Testimonials Section
export interface TestimonialsSectionData {
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
    show?: boolean
  }
  testimonials: Array<{
    name: string
    image?: string
    imageAlt?: string
    text: string
    location?: string
    rating?: number
    date?: string
    showRating?: boolean
  }>
  stats?: {
    text?: string
    icon?: string
    show?: boolean
  }
  icons?: {
    quote?: string
    heart?: string
    rating?: string
  }
}

// App Download Section
export interface AppDownloadSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
    show?: boolean
  }
  benefits?: Array<{
    text?: string
    icon?: string
    showIcon?: boolean
  }>
  showBenefits?: boolean
  cta?: {
    text?: string
    subtext?: string
    icon?: string
    show?: boolean
    showSubtext?: boolean
    secondaryText?: string
    secondaryLink?: string
    secondaryIcon?: string
    showSecondary?: boolean
  }
  card?: {
    title?: string
    subtitle?: string
    icon?: string
    show?: boolean
    platformsLabel?: string
    showPlatforms?: boolean
    statsPrefix?: string
    statsHighlight?: string
    statsSuffix?: string
    showStats?: boolean
  }
  platforms?: Array<{
    label?: string
    name?: string
    iconImage?: string
    iconAlt?: string
    coming?: boolean
    show?: boolean
  }>
  images?: {
    decorative?: Array<{
      image?: string
      alt?: string
    }>
  }
}

// Coming Soon Section
export interface ComingSoonSectionData {
  title?: string
  subtitle?: string
  badge?: {
    icon?: string
    text?: string
    show?: boolean
  }
  cta?: {
    text?: string
    icon?: string
    link?: string
    show?: boolean
  }
  callout?: {
    title?: string
    description?: string
    show?: boolean
  }
  footer_note?: string
  platforms?: Array<{
    label?: string
    name?: string
    iconImage?: string
    iconAlt?: string
    coming?: boolean
    show?: boolean
  }>
  showPlatforms?: boolean
  stats?: {
    prefix?: string
    highlight?: string
    suffix?: string
    icon?: string
    show?: boolean
  }
  screenshots?: Array<{
    image?: string
    alt?: string
  }>
  showScreenshots?: boolean
}

// Timeline Section
export interface TimelineSectionData {
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: {
    text?: string
    icon?: string
    show?: boolean
  }
  itemIcon?: string
  showItemIcon?: boolean
  timeline: Array<{
    year: string
    event: string
    description: string
    show?: boolean
  }>
}

// Why Join Section
export interface WhyJoinSectionData {
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: {
    text?: string
    icon?: string
    show?: boolean
  }
  items: Array<{
    title: string
    description: string
    icon: string
    color?: string
    show?: boolean
  }>
}

// Values Section
export interface ValuesSectionData {
  useMissionVisionLayout?: boolean
  title?: string
  titleHighlight?: string
  subtitle?: string
  badge?: {
    text?: string
    icon?: string
    show?: boolean
  }
  values: Array<{
    icon: string
    label?: string
    labelIcon?: string
    title: string
    description: string
    body?: string[]
    color?: string
    show?: boolean
  }>
}

// Generic Content Section
export interface ContentSectionData {
  key?: string
  title?: string
  icon?: string
  showIcon?: boolean
  lastUpdated?: string
  sections?: Array<{
    heading?: string
    content?: string
    items?: Array<{
      text?: string
      icon?: string
      show?: boolean
    }>
    isImportant?: boolean
    show?: boolean
  }>
}

// ============================================================================
// Union Type for All Section Data
// ============================================================================

export type SectionData =
  | HeroSectionData
  | BlogPostSectionData
  | FaqCategorySectionData
  | FeatureCategorySectionData
  | ProductFeaturesSectionData
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

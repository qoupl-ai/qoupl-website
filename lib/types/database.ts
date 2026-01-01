/**
 * Database Content Types
 *
 * Type definitions for content fetched from Supabase.
 * These represent the shape of data in JSONB columns.
 */

// Generic Section Content (base type)
export interface SectionContent {
  [key: string]: unknown
}

// About Page Section Content
export interface AboutSectionContent extends SectionContent {
  title?: string
  subtitle?: string
  description?: string
  badge?: {
    icon?: string
    text?: string
  }
  image?: string
  story?: {
    title?: string
    text?: string
  }
  values?: Array<{
    icon?: string
    title: string
    description: string
  }>
  team?: Array<{
    name: string
    role: string
    image?: string
  }>
  whyChooseUs?: Array<{
    icon?: string
    title: string
    description: string
  }>
  cta?: {
    title?: string
    description?: string
    buttonText?: string
    buttonLink?: string
  }
}

// Blog Post Content
export interface BlogPostContent extends SectionContent {
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

// FAQ Section Content
export interface FAQSectionContent extends SectionContent {
  title?: string
  description?: string
  faqs: Array<{
    question: string
    answer: string
    order_index?: number
  }>
}

// Features Section Content
export interface FeaturesSectionContent extends SectionContent {
  title?: string
  description?: string
  categories: Array<{
    id?: string
    title: string
    icon?: string
    color?: string
    image?: string
    coupleImage?: string
    features?: Array<{
      icon?: string
      title: string
      description: string
    }>
  }>
}

// Pricing Section Content
export interface PricingSectionContent extends SectionContent {
  title?: string
  subtitle?: string
  plans?: Array<{
    name: string
    price: number
    currency?: string
    billing_period?: string
    features: string[]
    is_popular?: boolean
    order_index?: number
  }>
}

// Careers Section Content
export interface CareersSectionContent extends SectionContent {
  title?: string
  description?: string
  positions?: Array<{
    id?: string
    title: string
    department: string
    location: string
    type: string
    description: string
    requirements?: string[]
    responsibilities?: string[]
  }>
  benefits?: Array<{
    icon?: string
    title: string
    description: string
  }>
}

// Legal Page Content (Terms, Privacy, etc.)
export interface LegalSectionContent extends SectionContent {
  title?: string
  lastUpdated?: string
  sections?: Array<{
    title: string
    content: string
    subsections?: Array<{
      title: string
      content: string
    }>
  }>
}

// Generic Page Section from database
export interface PageSection {
  id: string
  page_id: string
  component_type: string
  content: SectionContent
  order_index: number
  published: boolean
  created_at?: string
  updated_at?: string
}

// Typed Page Section (with specific content type)
export interface TypedPageSection<T extends SectionContent = SectionContent> extends Omit<PageSection, 'content'> {
  content: T
}

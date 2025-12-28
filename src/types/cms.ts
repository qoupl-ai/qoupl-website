/**
 * CMS Types
 * 
 * Type definitions for CMS entities: pages, global content, blog, FAQs, features, pricing.
 * Mirrors the database schema exactly.
 */

import { z } from 'zod'
import type {
  Page as DatabasePage,
  GlobalContent as DatabaseGlobalContent,
  BlogPost as DatabaseBlogPost,
  BlogCategory as DatabaseBlogCategory,
  Faq as DatabaseFaq,
  FaqCategory as DatabaseFaqCategory,
  Feature as DatabaseFeature,
  FeatureCategory as DatabaseFeatureCategory,
  PricingPlan as DatabasePricingPlan,
  ContentHistory as DatabaseContentHistory,
} from '@/lib/supabase/database.types'

// ============================================================================
// Helper Functions
// ============================================================================

// ISO 8601 datetime regex pattern (matches: YYYY-MM-DDTHH:mm:ss.sssZ or variations)
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/

// UUID v4 regex pattern (matches: 8-4-4-4-12 hexadecimal characters)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Helper for datetime string validation (replaces deprecated .datetime())
const datetimeString = () => z.string().regex(isoDateTimeRegex, 'Invalid ISO 8601 datetime format')

// Helper for UUID string validation (replaces deprecated .uuid())
const uuidString = () => z.string().regex(uuidRegex, 'Invalid UUID format')

// ============================================================================
// Database Types (re-exported for convenience)
// ============================================================================

export type Page = DatabasePage
export type GlobalContent = DatabaseGlobalContent
export type BlogPost = DatabaseBlogPost
export type BlogCategory = DatabaseBlogCategory
export type Faq = DatabaseFaq
export type FaqCategory = DatabaseFaqCategory
export type Feature = DatabaseFeature
export type FeatureCategory = DatabaseFeatureCategory
export type PricingPlan = DatabasePricingPlan
export type ContentHistory = DatabaseContentHistory

// ============================================================================
// Page Schemas
// ============================================================================

export const pageSchema = z.object({
  id: uuidString(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
  created_by: uuidString().nullable(),
  updated_by: uuidString().nullable(),
})

export const pageInsertSchema = pageSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: uuidString().optional(),
  created_at: datetimeString().optional(),
  updated_at: datetimeString().optional(),
})

export const pageUpdateSchema = pageSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// Global Content Schemas
// ============================================================================

export const globalContentSchema = z.object({
  id: uuidString(),
  key: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  updated_at: datetimeString(),
  updated_by: uuidString().nullable(),
})

export const globalContentInsertSchema = globalContentSchema.omit({
  id: true,
  updated_at: true,
}).extend({
  id: uuidString().optional(),
  updated_at: datetimeString().optional(),
})

export const globalContentUpdateSchema = globalContentSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// Blog Schemas
// ============================================================================

export const blogCategorySchema = z.object({
  id: uuidString(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  order_index: z.number().int().min(0),
  created_at: z.string().datetime(),
})

export const blogPostSchema = z.object({
  id: uuidString(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().nullable(),
  content: z.string().nullable(),
  category_id: uuidString().nullable(),
  author: z.string().nullable(),
  publish_date: datetimeString().nullable(),
  read_time: z.number().int().positive().nullable(),
  featured_image: z.string().nullable(),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
  created_by: uuidString().nullable(),
  updated_by: uuidString().nullable(),
})

export const blogPostInsertSchema = blogPostSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: uuidString().optional(),
  created_at: datetimeString().optional(),
  updated_at: datetimeString().optional(),
})

export const blogPostUpdateSchema = blogPostSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// FAQ Schemas
// ============================================================================

export const faqCategorySchema = z.object({
  id: uuidString(),
  name: z.string().min(1),
  slug: z.string().min(1),
  order_index: z.number().int().min(0),
  created_at: z.string().datetime(),
})

export const faqSchema = z.object({
  id: uuidString(),
  category_id: uuidString(),
  question: z.string().min(1),
  answer: z.string().min(1),
  order_index: z.number().int().min(0),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
  created_by: uuidString().nullable(),
  updated_by: uuidString().nullable(),
})

export const faqInsertSchema = faqSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: uuidString().optional(),
  created_at: datetimeString().optional(),
  updated_at: datetimeString().optional(),
})

export const faqUpdateSchema = faqSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// Feature Schemas
// ============================================================================

export const featureCategorySchema = z.object({
  id: uuidString(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  image_path: z.string().nullable(),
  order_index: z.number().int().min(0),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
})

export const featureSchema = z.object({
  id: uuidString(),
  category_id: uuidString(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().nullable(),
  order_index: z.number().int().min(0),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
  created_by: uuidString().nullable(),
  updated_by: uuidString().nullable(),
})

export const featureInsertSchema = featureSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: uuidString().optional(),
  created_at: datetimeString().optional(),
  updated_at: datetimeString().optional(),
})

export const featureUpdateSchema = featureSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// Pricing Plan Schemas
// ============================================================================

export const pricingPlanSchema = z.object({
  id: uuidString(),
  plan_type: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  currency: z.string().default('INR'),
  billing_period: z.string().nullable(),
  features: z.array(z.string()).default([]),
  is_popular: z.boolean().default(false),
  order_index: z.number().int().min(0),
  published: z.boolean(),
  created_at: datetimeString(),
  updated_at: datetimeString(),
  created_by: uuidString().nullable(),
  updated_by: uuidString().nullable(),
})

export const pricingPlanInsertSchema = pricingPlanSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: uuidString().optional(),
  created_at: datetimeString().optional(),
  updated_at: datetimeString().optional(),
})

export const pricingPlanUpdateSchema = pricingPlanSchema.partial().extend({
  id: uuidString(),
})

// ============================================================================
// Content History Schemas
// ============================================================================

export const contentHistorySchema = z.object({
  id: uuidString(),
  entity_type: z.string().min(1),
  entity_id: uuidString(),
  action: z.string().min(1),
  snapshot: z.record(z.string(), z.unknown()).nullable(),
  performed_by: uuidString().nullable(),
  performed_at: datetimeString(),
})

// ============================================================================
// Global Content Type Definitions
// ============================================================================

export interface NavbarContent {
  links: Array<{ href: string; label: string }>
  logo: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export interface FooterContent {
  brand: {
    description: string
    logo: {
      src: string
      alt: string
      width: number
      height: number
    }
  }
  columns: {
    product: {
      title: string
      links: Array<{ href: string; label: string }>
    }
    company: {
      title: string
      links: Array<{ href: string; label: string }>
    }
    legal: {
      title: string
      links: Array<{ href: string; label: string }>
    }
  }
  copyright: {
    text: string
    company: string
  }
}

export interface SocialLink {
  icon: string
  url: string
  label?: string
}

export interface SocialLinks {
  links: SocialLink[]
}

export interface ContactInfo {
  email: string
  phone: string
  address: string
  support_email: string
}

export interface SiteConfig {
  waitlist_count: number
  tagline: string
  subtitle: string
}

// ============================================================================
// Type Inference from Schemas
// ============================================================================

export type PageInput = z.infer<typeof pageInsertSchema>
export type PageUpdate = z.infer<typeof pageUpdateSchema>
export type GlobalContentInput = z.infer<typeof globalContentInsertSchema>
export type GlobalContentUpdate = z.infer<typeof globalContentUpdateSchema>
export type BlogPostInput = z.infer<typeof blogPostInsertSchema>
export type BlogPostUpdate = z.infer<typeof blogPostUpdateSchema>
export type FaqInput = z.infer<typeof faqInsertSchema>
export type FaqUpdate = z.infer<typeof faqUpdateSchema>
export type FeatureInput = z.infer<typeof featureInsertSchema>
export type FeatureUpdate = z.infer<typeof featureUpdateSchema>
export type PricingPlanInput = z.infer<typeof pricingPlanInsertSchema>
export type PricingPlanUpdate = z.infer<typeof pricingPlanUpdateSchema>
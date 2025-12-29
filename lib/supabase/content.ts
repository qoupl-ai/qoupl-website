/**
 * Content Fetching Helpers
 * 
 * Functions to fetch content from Supabase tables:
 * - global_content (navbar, footer, social links, etc.)
 * - sections (page sections/components)
 */

import { createClient } from '@/lib/supabase/server'
import { getStorageUrl } from '@/lib/supabase/storage-url'
import type { Section } from '@/types/section'
import { getGlobalContentSchema, type GlobalContentKey } from '@/lib/validation/global-content-schemas'

// ============================================================================
// Global Content Helpers
// ============================================================================

export async function getGlobalContent(key: string): Promise<Record<string, unknown> | null> {
  const supabase = await createClient()
  
  try {
    // Use maybeSingle() instead of single() to handle missing rows gracefully
    const { data, error } = await supabase
      .from('global_content')
      .select('content')
      .eq('key', key)
      .maybeSingle()

    if (error) {
      // Log error but don't throw - return null for graceful fallback
      console.warn(`[getGlobalContent] Key "${key}" not found or error:`, error.message)
      return null
    }

    // Return null if no data found (key doesn't exist in database)
    if (!data || !data.content) {
      return null
    }

    return data.content
  } catch (error) {
    // Catch any unexpected errors
    console.error(`[getGlobalContent] Unexpected error for key "${key}":`, error)
    return null
  }
}

export async function getGlobalContentTyped<T>(key: GlobalContentKey): Promise<T | null> {
  const content = await getGlobalContent(key)
  if (!content) return null

  const schema = getGlobalContentSchema(key)
  if (!schema) return content as T

  const parsed = schema.safeParse(content)
  if (!parsed.success) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Global content "${key}" is invalid: ${parsed.error.message}`)
    }
    return null
  }

  return parsed.data as T
}

export async function getNavbarContent(): Promise<NavbarContent | null> {
  return await getGlobalContentTyped<NavbarContent>('navbar')
}

export async function getFooterContent() {
  return await getGlobalContentTyped<FooterContent>('footer')
}

export async function getSocialLinks(): Promise<SocialLinks | null> {
  return await getGlobalContentTyped<SocialLinks>('social_links')
}

export async function getContactInfo(): Promise<Record<string, unknown> | null> {
  return await getGlobalContentTyped<Record<string, unknown>>('contact_info')
}

export async function getSiteConfig(): Promise<Record<string, unknown> | null> {
  return await getGlobalContentTyped<Record<string, unknown>>('site_config')
}

// ============================================================================
// Section Helpers
// ============================================================================

export async function getPageSections(pageSlug: string): Promise<Section[]> {
  const supabase = await createClient()

  try {
    // Get page ID - don't filter by published here, let RLS handle it
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', pageSlug)
      .maybeSingle()

    if (pageError) {
      console.error(`[getPageSections] Error fetching page ${pageSlug}:`, pageError.message, pageError)
      return []
    }

    if (!page) {
      console.warn(`[getPageSections] Page not found: ${pageSlug}`)
      return []
    }

    // Get sections for this page - RLS will filter by published automatically
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (sectionsError) {
      console.error(`[getPageSections] Error fetching sections for ${pageSlug}:`, sectionsError.message, sectionsError)
      return []
    }

    // Filter by published manually as a fallback (RLS should handle this, but just in case)
    const publishedSections = (sections || []).filter((s: any) => {
      if (!s.section_type) {
        console.error(`[getPageSections] Section ${s.id} is missing section_type field. Please run database migration.`)
        return false
      }
      return s.published === true
    })
    
    if (publishedSections.length === 0 && (sections || []).length > 0) {
      console.warn(`[getPageSections] Found ${(sections || []).length} sections for ${pageSlug}, but none are published`)
    }

    return publishedSections as Section[]
  } catch (error) {
    console.error(`[getPageSections] Unexpected error for ${pageSlug}:`, error)
    return []
  }
}

export async function getSectionByType(
  pageSlug: string,
  sectionType: string
): Promise<Section | undefined> {
  const sections = await getPageSections(pageSlug)
  return sections.find((s) => s.section_type === sectionType)
}

// ============================================================================
// Helper: Process image paths to full URLs
// ============================================================================

export function processImagePath(path: string, bucket?: string): string {
  if (!path) return ''
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // If path includes bucket, extract it
  if (path.includes('/')) {
    const parts = path.split('/')
    const bucketName = bucket || parts[0] || 'hero-images'
    const imagePath = parts.slice(1).join('/')
    return getStorageUrl(bucketName, imagePath)
  }

  // Default bucket if not specified
  const defaultBucket = bucket || 'hero-images'
  return getStorageUrl(defaultBucket, path)
}

// ============================================================================
// Type Definitions
// ============================================================================

export interface NavbarContent {
  links: Array<{ href: string; label: string; show?: boolean }>
  logo: {
    image: string
    alt: string
    width: number
    height: number
  }
  mobile_toggle?: {
    open_icon: string
    close_icon: string
    aria_label: string
    show: boolean
  }
}

export interface FooterContent {
  brand: {
    show?: boolean
    description: string
    logo: {
      image: string
      alt: string
      width: number
      height: number
    }
  }
  columns: {
    product: {
      show?: boolean
      title: string
      links: Array<{ href: string; label: string }>
    }
    company: {
      show?: boolean
      title: string
      links: Array<{ href: string; label: string }>
    }
    legal: {
      show?: boolean
      title: string
      links: Array<{ href: string; label: string }>
    }
  }
  copyright: {
    show?: boolean
    primary_prefix?: string
    company: string
    year?: string
    show_year?: boolean
    primary_suffix?: string
    secondary_text?: string
    show_secondary?: boolean
  }
  theme_toggle?: {
    show?: boolean
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

export interface SiteConfig {
  waitlist_count: number
  tagline: string
  subtitle: string
}

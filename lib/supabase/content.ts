/**
 * Content Fetching Helpers
 * 
 * Functions to fetch content from Supabase tables:
 * - global_content (navbar, footer, social links, etc.)
 * - sections (page sections/components)
 */

import { createClient } from '@/lib/supabase/server'
import { getStorageUrl } from '@/lib/supabase/storage-url'

// ============================================================================
// Global Content Helpers
// ============================================================================

export async function getGlobalContent(key: string): Promise<any> {
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

export async function getNavbarContent(): Promise<NavbarContent | null> {
  const content = await getGlobalContent('navbar')
  // Ensure content matches NavbarContent structure
  if (content && typeof content === 'object' && 'links' in content) {
    return content as NavbarContent
  }
  return null
}

export async function getFooterContent() {
  return await getGlobalContent('footer')
}

export async function getSocialLinks() {
  return await getGlobalContent('social_links')
}

export async function getContactInfo() {
  return await getGlobalContent('contact_info')
}

export async function getSiteConfig() {
  return await getGlobalContent('site_config')
}

// ============================================================================
// Section Helpers
// ============================================================================

export async function getPageSections(pageSlug: string) {
  const supabase = await createClient()

  // Get page ID
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', pageSlug)
    .single()

  if (pageError || !page) {
    console.error(`Error fetching page ${pageSlug}:`, pageError?.message)
    return []
  }

  // Get sections for this page
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('published', true)
    .order('order_index', { ascending: true })

  if (sectionsError) {
    console.error(`Error fetching sections for ${pageSlug}:`, sectionsError.message)
    return []
  }

  return sections || []
}

export async function getSectionByType(pageSlug: string, componentType: string) {
  const sections = await getPageSections(pageSlug)
  return sections.find((s) => s.component_type === componentType)
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
    const bucketName = bucket || parts[0]
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

export interface SocialLinks {
  linkedin: string
  instagram: string
}

export interface SiteConfig {
  waitlist_count: number
  tagline: string
  subtitle: string
}


import { createClient } from './server'
import type { Feature, Testimonial, FAQ, Step, GalleryImage, SiteContent, BlogPost, Pricing } from './types'

// Fetch all active features
export async function getFeatures(): Promise<Feature[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('features')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching features:', error)
    return []
  }
  return data || []
}

// Fetch all active testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
  return data || []
}

// Fetch all active FAQs, optionally by category
export async function getFAQs(category?: string): Promise<FAQ[]> {
  const supabase = await createClient()
  let query = supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
  return data || []
}

// Fetch all active steps
export async function getSteps(): Promise<Step[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching steps:', error)
    return []
  }
  return data || []
}

// Fetch all active gallery images
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }
  return data || []
}

// Fetch site content by key
export async function getSiteContent(key: string): Promise<string | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    console.error('Error fetching site content:', error)
    return null
  }
  return data?.value || null
}

// Fetch multiple site content values
export async function getSiteContentBatch(keys: string[]): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', keys)

  if (error) {
    console.error('Error fetching site content:', error)
    return {}
  }

  return (data || []).reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, string>)
}

// Fetch all published blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  return data || []
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  return data
}

// Fetch all active pricing options
export async function getPricing(): Promise<Pricing[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching pricing:', error)
    return []
  }
  return data || []
}

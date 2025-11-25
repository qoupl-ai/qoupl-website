// Database Types for Supabase

export interface Waitlist {
  id: string
  name: string
  email: string
  phone: string | null
  gender: string | null
  age: number | null
  looking_for: string | null
  created_at: string
  status: 'pending' | 'contacted' | 'converted'
}

export interface SiteContent {
  id: string
  key: string
  value: string
  page: string
  updated_at: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  highlights: string[]
  image_url: string | null
  color: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  location: string | null
  rating: number
  date_info: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'account' | 'safety' | 'premium' | 'technical'
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author: string
  category: string
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Pricing {
  id: string
  name: string
  price: number
  currency: string
  description: string | null
  features: string[] | null
  is_popular: boolean
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Step {
  id: string
  step_number: string
  title: string
  description: string
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface GalleryImage {
  id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

// Insert types (for creating new records)
export type WaitlistInsert = Omit<Waitlist, 'id' | 'created_at' | 'status'>
export type SiteContentInsert = Omit<SiteContent, 'id' | 'updated_at'>
export type FeatureInsert = Omit<Feature, 'id' | 'created_at'>
export type TestimonialInsert = Omit<Testimonial, 'id' | 'created_at'>
export type FAQInsert = Omit<FAQ, 'id' | 'created_at'>
export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
export type PricingInsert = Omit<Pricing, 'id' | 'created_at'>
export type StepInsert = Omit<Step, 'id' | 'created_at'>
export type GalleryImageInsert = Omit<GalleryImage, 'id' | 'created_at'>

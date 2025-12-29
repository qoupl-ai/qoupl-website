/**
 * Get public URL for a file in Supabase Storage
 * This is a pure function that works in both client and server components
 * Safe to import in client components
 */
export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    return ''
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Get full public URL for structured data (SEO, Open Graph, etc.)
 * Returns absolute URL with domain
 */
export function getStorageUrlAbsolute(bucket: string, path: string): string {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    return ''
  }

  // Extract domain from Supabase URL or use default
  const url = new URL(supabaseUrl)
  return `${url.protocol}//${url.host}/storage/v1/object/public/${bucket}/${path}`
}

const STORAGE_BUCKETS = [
  'hero-images',
  'blog-images',
  'couple-photos',
  'app-screenshots',
  'user-uploads',
  'brand-assets',
]

export function resolveStorageUrl(path?: string): string {
  if (!path) return ''
  const trimmed = path.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.includes('/storage/v1/object/public/') ? trimmed : ''
  }

  if (!trimmed.includes('/')) {
    return ''
  }

  const [bucket, ...rest] = trimmed.split('/').filter(Boolean)
  if (!bucket || rest.length === 0 || !STORAGE_BUCKETS.includes(bucket)) {
    return ''
  }

  return getStorageUrl(bucket, rest.join('/'))
}

/**
 * Get public URL for a file in Supabase Storage
 * This is a pure function that works in both client and server components
 * Safe to import in client components
 */
export function getStorageUrl(bucket: string, path: string): string {
  // Hardcode the Supabase URL for client-side usage
  // This is safe because it's a public URL
  const supabaseUrl = 'https://agbuefpfkgknbboeeyqa.supabase.co'

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

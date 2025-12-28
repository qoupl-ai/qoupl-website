/**
 * Server Component Wrapper for Footer
 * Fetches footer content from Supabase and passes to client component
 */

import { getFooterContent, getSocialLinks } from '@/lib/supabase/content'
import FooterClient from '../footer-client'

export default async function Footer() {
  const footerContent = await getFooterContent()
  const socialLinks = await getSocialLinks()

  if (!footerContent || !socialLinks) {
    console.error('Footer content not found in CMS. Please ensure __global__ page has footer and social_links sections.')
    // Return minimal fallback to prevent module instantiation errors
    return (
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Loading footer...</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <FooterClient
      footerContent={footerContent}
      socialLinks={socialLinks}
    />
  )
}

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
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Footer content is missing in CMS.')
    }
    return null
  }

  return (
    <FooterClient
      footerContent={footerContent}
      socialLinks={socialLinks}
    />
  )
}

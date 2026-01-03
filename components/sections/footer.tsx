/**
 * Server Component Wrapper for Footer
 * Fetches footer content from Supabase and passes to client component
 */

import { getFooterContent, getSocialLinks, type FooterContent, type SocialLinks } from '@/lib/supabase/content'
import FooterClient from '../footer-client'

export default async function Footer() {
  let footerContent = await getFooterContent()
  const socialLinks = await getSocialLinks()

  // Ensure waitlist link is always /waitlist (not /#waitlist)
  if (footerContent?.columns?.product?.links) {
    footerContent.columns.product.links = footerContent.columns.product.links.map((link: { href: string; label: string }) => 
      link.label === 'Join Waitlist' ? { ...link, href: '/waitlist' } : link
    )
  }


  const defaultSocialLinks: SocialLinks = {
    links: [
      { icon: 'Linkedin', url: 'https://www.linkedin.com/company/qoupl-ai/', label: 'LinkedIn' },
      { icon: 'Instagram', url: 'https://www.instagram.com/qoupl.ai?igsh=MWI1bDFqOHplYzY1Nw==', label: 'Instagram' },
    ],
  }

  return (
    <FooterClient
      footerContent={footerContent || defaultFooterContent}
      socialLinks={socialLinks || defaultSocialLinks}
    />
  )
}

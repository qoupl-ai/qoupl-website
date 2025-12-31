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

  // Fallback to default content if not found in database
  const defaultFooterContent: FooterContent = {
    brand: {
      description: 'The exclusive dating app for college students. Find your perfect match with qoupl.',
      logo: {
        src: '/images/quoupl.svg',
        alt: 'qoupl',
        width: 120,
        height: 40,
      },
    },
    columns: {
      product: {
        title: 'Product',
        links: [
          { href: '/features', label: 'Features' },
          { href: '/pricing', label: 'Pricing' },
          { href: '/faq', label: 'FAQ' },
          { href: '/waitlist', label: 'Join Waitlist' },
        ],
      },
      company: {
        title: 'Company',
        links: [
          { href: '/about', label: 'About Us' },
          { href: '/blog', label: 'Blog' },
          { href: '/careers', label: 'Careers' },
          { href: '/contact', label: 'Contact' },
        ],
      },
      legal: {
        title: 'Legal',
        links: [
          { href: '/privacy', label: 'Privacy Policy' },
          { href: '/terms', label: 'Terms of Service' },
          { href: '/community-guidelines', label: 'Community Guidelines' },
          { href: '/safety', label: 'Safety & Security' },
        ],
      },
    },
    copyright: {
      text: 'Made for meaningful connections',
      company: 'qoupl by Xencus Technologies Private Limited',
    },
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

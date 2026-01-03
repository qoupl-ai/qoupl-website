/**
 * Server Component Wrapper for Navbar
 * Fetches navbar content from Supabase and passes to client component
 */

import { getNavbarContent, type NavbarContent } from '@/lib/supabase/content'
import NavbarClient from './navbar-client'

export default async function Navbar() {
  const navbarContent = await getNavbarContent()

  // Fallback to default content if not found in database
  const defaultContent: NavbarContent = {
    links: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/safety', label: 'Safety & Security' },
      { href: '/community-guidelines', label: 'Community Guidelines' },
      { href: '/faq', label: 'FAQ' },
    ],
    logo: {
      src: '/images/quoupl.svg',
      alt: 'qoupl',
      width: 120,
      height: 40,
    },
  }

  // Merge navbar content with defaults, ensuring logo is never empty
  const content: NavbarContent = navbarContent 
    ? {
        ...navbarContent,
        logo: {
          src: navbarContent.logo?.src && navbarContent.logo.src.trim() !== '' 
            ? navbarContent.logo.src 
            : defaultContent.logo.src,
          alt: navbarContent.logo?.alt || defaultContent.logo.alt,
          width: navbarContent.logo?.width || defaultContent.logo.width,
          height: navbarContent.logo?.height || defaultContent.logo.height,
        },
        links: navbarContent.links && navbarContent.links.length > 0
          ? navbarContent.links
          : defaultContent.links,
      }
    : defaultContent

  return <NavbarClient content={content} />
}

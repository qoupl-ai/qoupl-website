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
      { href: '/features', label: 'Features' },
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

  const content = navbarContent || defaultContent

  return <NavbarClient content={content} />
}

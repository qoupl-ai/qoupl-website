/**
 * Server Component Wrapper for Navbar
 * Fetches navbar content from Supabase and passes to client component
 */

import { getNavbarContent } from '@/lib/supabase/content'
import NavbarClient from './navbar-client'

export default async function Navbar() {
  const navbarContent = await getNavbarContent()

  if (!navbarContent) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Navbar content is missing in CMS.')
    }
    return null
  }

  return <NavbarClient content={navbarContent} />
}

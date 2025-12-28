/**
 * Server Component Wrapper for Navbar
 * Fetches navbar content from Supabase and passes to client component
 */

import { getNavbarContent } from '@/lib/supabase/content'
import NavbarClient from './navbar-client'

export default async function Navbar() {
  const navbarContent = await getNavbarContent()

  if (!navbarContent) {
    console.error('Navbar content not found in CMS. Please ensure __global__ page has navbar section.')
    // Return minimal fallback to prevent module instantiation errors
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading navigation...</span>
          </div>
        </div>
      </nav>
    )
  }

  return <NavbarClient content={navbarContent} />
}

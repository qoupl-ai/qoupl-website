/**
 * Homepage - Server Component
 * 
 * Fetches sections from Supabase and renders dynamically.
 * Splash screen remains client-side for animations.
 */

import { getPageSections } from '@/lib/supabase/content'
import { SectionsRenderer } from '@/lib/components/registry'
import Navbar from '@/components/navbar'
import Footer from '@/components/sections/footer'
import SplashScreenClient from '@/components/splash-screen-client'
import { StructuredData, organizationSchema, websiteSchema, webApplicationSchema } from '@/components/structured-data'

export default async function Home() {
  // Fetch sections for home page
  const sections = await getPageSections('home')
  if (sections.length === 0 && process.env.NODE_ENV !== 'production') {
    throw new Error('Homepage has no published sections in CMS.')
  }

  return (
    <div className="relative min-h-screen">
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <StructuredData data={webApplicationSchema} />

      {/* Main content */}
      <div className="min-h-screen">
        <Navbar />
        
        {/* Render sections dynamically from database */}
        {sections.length > 0 && <SectionsRenderer sections={sections} />}
        
        <Footer />
      </div>

      {/* Splash Screen - Client component for animations */}
      <SplashScreenClient />
    </div>
  )
}

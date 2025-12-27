"use client";

/**
 * Homepage Fallback - Client Component
 * 
 * Renders hardcoded sections if database is empty.
 * This ensures the site works even before migration.
 */

import dynamic from 'next/dynamic'

// Dynamic imports with ssr: false (allowed in client components)
const AnimatedHero = dynamic(() => import('@/components/sections/animated-hero'), { ssr: false })
const HowItWorks = dynamic(() => import('@/components/sections/how-it-works'), { ssr: false })
const ProductFeatures = dynamic(() => import('@/components/sections/product-features'), { ssr: false })
const Gallery = dynamic(() => import('@/components/sections/gallery'), { ssr: false })
const Testimonials = dynamic(() => import('@/components/sections/testimonials'), { ssr: false })
const AppDownload = dynamic(() => import('@/components/sections/app-download'), { ssr: false })
const ComingSoon = dynamic(() => import('@/components/sections/coming-soon'), { ssr: false })

export default function HomepageFallback() {
  return (
    <>
      <AnimatedHero data={{}} />
      <HowItWorks data={{}} />
      <ProductFeatures data={{}} />
      <Gallery data={{}} />
      <Testimonials data={{}} />
      <AppDownload data={{}} />
      <ComingSoon data={{}} />
    </>
  )
}


/**
 * Component Registry
 * 
 * Maps section types to React components.
 * This enables dynamic rendering of sections based on database content.
 */

import dynamic from 'next/dynamic'

// Import section components (lazy-loaded for performance)
const HeroSection = dynamic(() => import('@/components/sections/animated-hero'), {
  ssr: true,
})

const HowItWorksSection = dynamic(() => import('@/components/sections/how-it-works'), {
  ssr: true,
})

const ProductFeaturesSection = dynamic(() => import('@/components/sections/product-features'), {
  ssr: true,
})

const GallerySection = dynamic(() => import('@/components/sections/gallery'), {
  ssr: true,
})

const TestimonialsSection = dynamic(() => import('@/components/sections/testimonials'), {
  ssr: true,
})

const AppDownloadSection = dynamic(() => import('@/components/sections/app-download'), {
  ssr: true,
})

// Coming Soon section merged into app-download - no longer needed
// const ComingSoonSection = dynamic(() => import('@/components/sections/coming-soon'), {
//   ssr: true,
// })

// Type definition for section data
export interface SectionData {
  id: string
  component_type: string
  order_index: number
  content: Record<string, any>
  published: boolean
}

// Component registry mapping
const componentRegistry: Record<
  string,
  React.ComponentType<{ data: Record<string, any> }>
> = {
  'hero': HeroSection,
  'how-it-works': HowItWorksSection,
  'product-features': ProductFeaturesSection,
  'gallery': GallerySection,
  'testimonials': TestimonialsSection,
  'app-download': AppDownloadSection,
  'coming-soon': AppDownloadSection, // Merged into app-download - use same component
  // Add more section types as needed
}

/**
 * Get component for a section type
 */
export function getSectionComponent(type: string) {
  return componentRegistry[type] || null
}

/**
 * Render a section dynamically based on its type
 */
export function SectionRenderer({ section }: { section: SectionData }) {
  const Component = getSectionComponent(section.component_type)

  if (!Component) {
    console.warn(`Unknown section type: ${section.component_type}`)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Unknown section type: <code>{section.component_type}</code>
          </p>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(section.content, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  // Pass data prop (components will use it when updated, fallback to hardcoded for now)
  // Components currently have hardcoded content but accept data prop for future updates
  // When components are updated to use data prop, they will automatically use database content
  return <Component data={section.content} />
}

/**
 * Render multiple sections in order
 */
export function SectionsRenderer({ sections }: { sections: SectionData[] }) {
  const sortedSections = [...sections].sort(
    (a, b) => a.order_index - b.order_index
  )

  // Filter out "coming-soon" sections since they're merged into "app-download"
  const filteredSections = sortedSections.filter((s) => {
    if (!s.published) return false;
    // Skip "coming-soon" sections - they're merged into "app-download"
    if (s.component_type === 'coming-soon') return false;
    return true;
  });

  return (
    <>
      {filteredSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}


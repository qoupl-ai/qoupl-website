/**
 * Component Registry
 * 
 * Maps section types to React components using the contracts system.
 * This enables dynamic rendering of sections based on database content.
 * 
 * All rendering happens server-side in Next.js App Router.
 */

import { getSectionContract } from '@/contracts/registry'
import type { Section } from '@/types/section'

// Type definition for section data (matches DB Section type)
export type SectionData = Section

/**
 * Get component for a section type from contracts
 * Returns the renderer component which is already wrapped for SSR
 */
export function getSectionComponent(type: string) {
  const contract = getSectionContract(type)
  if (!contract) {
    return null
  }
  // Return the renderer component from the contract
  // All renderers are wrapped for server-side rendering
  return contract.renderer
}

/**
 * Render a section dynamically based on its type
 * This is a server component - all data is fetched server-side
 */
export function SectionRenderer({ section }: { section: SectionData }) {
  const sectionType = section.section_type

  if (!sectionType) {
    console.error('Section missing section_type field:', section)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Section missing section_type field. Please ensure database migration has been run.
          </p>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(section, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  const Component = getSectionComponent(sectionType)

  if (!Component) {
    console.warn(`Unknown section type: ${sectionType}`)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Unknown section type: <code>{sectionType}</code>
          </p>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(section.content, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  // Render component with data - all components support SSR via dynamic imports
  return <Component data={section.content} />
}

/**
 * Render multiple sections in order
 * Server component - all data is pre-fetched server-side
 */
export function SectionsRenderer({ sections }: { sections: SectionData[] }) {
  // Sort sections by order_index
  const sortedSections = [...sections].sort(
    (a, b) => a.order_index - b.order_index
  )

  // Filter to only published sections
  const publishedSections = sortedSections.filter((s) => s.published)

  return (
    <>
      {publishedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </>
  )
}

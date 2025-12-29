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
import { getSectionSchema } from '@/lib/validation/section-schemas'
import { normalizeContentData } from '@/components/cms/section-editor/helpers'

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
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Section is missing section_type. Please ensure the database migration has been run.')
    }
    return null
  }

  const contract = getSectionContract(sectionType)
  const Component = contract?.renderer

  if (!Component) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Unknown section type: ${sectionType}`)
    }
    return null
  }

  const contractSchema = contract?.schema
  const normalizedContent = normalizeContentData(section.content as Record<string, unknown>, sectionType)
  const parsed = contractSchema
    ? contractSchema.safeParse(normalizedContent)
    : getSectionSchema(sectionType).safeParse({
        type: sectionType,
        data: normalizedContent,
        order_index: section.order_index ?? 0,
        published: section.published ?? false,
      })
  if (!parsed.success) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`Invalid data for section type \"${sectionType}\": ${parsed.error.message}`)
    }
    return null
  }

  // Render component with data - all components support SSR via dynamic imports
  return <Component data={contractSchema ? parsed.data : parsed.data.data} />
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

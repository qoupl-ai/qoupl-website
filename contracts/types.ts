/**
 * Section Contract Types
 * 
 * Defines the formal contract interface for all section types.
 * Each section type must implement this contract to ensure consistency.
 */

import { z } from 'zod'
import { ComponentType } from 'react'

/**
 * Generic Section Contract Interface
 * 
 * @template T - The data type for this section's content
 */
export interface SectionContract<T = Record<string, unknown>> {
  /**
   * Unique identifier for this section type
   */
  type: string

  /**
   * Zod schema for validating section content data
   * This validates the `content` field stored in the database
   */
  schema: z.ZodSchema<T>

  /**
   * Default data structure for this section type
   * Used when creating new sections
   */
  defaultData: T

  /**
   * React component for editing this section in the CMS
   * Receives: { value: T, onChange: (data: T) => void }
   */
  editor: ComponentType<{
    value: T
    onChange: (data: T) => void
    sectionId?: string
  }>

  /**
   * React component for rendering this section
   * Receives: { data: T }
   */
  renderer: ComponentType<{ data: T }>

  /**
   * Metadata about this section type
   */
  metadata: {
    /**
     * Human-readable label (e.g., "Hero Section")
     */
    label: string

    /**
     * Description of what this section type does
     */
    description: string

    /**
     * Icon name or identifier (optional)
     */
    icon?: string

    /**
     * Category for grouping in UI (optional)
     */
    category?: string
  }
}

/**
 * Registry type for all section contracts
 * Uses `any` for the generic parameter to allow different section types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionContractRegistry = Record<string, SectionContract<any>>


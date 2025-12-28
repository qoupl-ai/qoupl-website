/**
 * Schema Resolver
 * 
 * Resolves Zod schemas from section contracts for form validation.
 */

import * as z from 'zod'
import { getSectionContract } from '@/contracts/registry'
import { getSectionSchema } from '@/lib/validation/section-schemas'

// Base section schema (common fields)
const baseSectionSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  order_index: z.number().int().min(0),
  published: z.boolean(),
})

/**
 * Get full section schema for form validation
 * Uses contract schema if available, falls back to validation schemas
 */
export function getFullSectionSchema(sectionType: string): z.ZodSchema {
  // Try to get schema from contract first
  const contract = getSectionContract(sectionType)
  if (contract) {
    return baseSectionSchema.extend({
      data: contract.schema,
    })
  }

  // Fallback to validation schemas
  const validationSchema = getSectionSchema(sectionType)
  if (validationSchema) {
    return validationSchema
  }

  // Ultimate fallback
  return baseSectionSchema.extend({
    data: z.record(z.string(), z.unknown()),
  })
}

/**
 * Get data schema only (for extracting field definitions)
 */
export function getDataSchema(sectionType: string): z.ZodSchema {
  const contract = getSectionContract(sectionType)
  if (contract) {
    return contract.schema
  }

  const fullSchema = getSectionSchema(sectionType) as { shape?: { data?: z.ZodSchema } } | null
  if (fullSchema && fullSchema.shape && 'data' in fullSchema.shape) {
    return fullSchema.shape.data as z.ZodSchema
  }

  return z.record(z.string(), z.unknown())
}

/**
 * Get default data for a section type
 */
export function getDefaultData(sectionType: string): Record<string, unknown> {
  const contract = getSectionContract(sectionType)
  if (contract) {
    return contract.defaultData as Record<string, unknown>
  }
  return {}
}

/**
 * Normalize content data from database format to form format
 * Currently just returns the data as-is, but can be extended for transformations
 */
export function normalizeContentData(
  content: Record<string, unknown>,
  _sectionType: string
): Record<string, unknown> {
  // For now, just return the content as-is
  // This function can be extended to handle format conversions if needed
  return content || {}
}


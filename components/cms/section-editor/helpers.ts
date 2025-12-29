/**
 * Helper Utilities
 * 
 * Type coercion and utility functions for section editor.
 */

/**
 * Type-safe coercion helpers
 */
export const asString = (value: unknown): string => {
  return typeof value === 'string' ? value : ''
}

export const asNumber = (value: unknown): number => {
  return typeof value === 'number' ? value : 0
}

export const asArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? (value as T[]) : []
}

export const asBoolean = (value: unknown): boolean => {
  return typeof value === 'boolean' ? value : false
}

/**
 * Normalize content data for form initialization
 */
export function normalizeContentData(
  content: Record<string, unknown> | null | undefined,
  sectionType: string
): Record<string, unknown> {
  if (!content) return {}

  const normalized = { ...content }

  // Special handling for hero section images structure
  if (sectionType === 'hero' && normalized['images'] && typeof normalized['images'] === 'object' && !Array.isArray(normalized['images'])) {
    const images = normalized['images'] as Record<string, unknown>
    normalized['images'] = {
      women: Array.isArray(images['women']) ? images['women'] : [],
      men: Array.isArray(images['men']) ? images['men'] : [],
      ...images,
    }
  }

  return normalized
}

/**
 * Get human-readable label from field path
 */
export function getFieldLabel(path: string): string {
  const parts = path.split('.')
  const lastPart = parts[parts.length - 1] ?? 'Field'
  
  // Convert camelCase to Title Case
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

/**
 * Check if a field is optional in a Zod schema
 */
export function isFieldOptional(schema: unknown): boolean {
  if (!schema || typeof schema !== 'object') return true
  
  // Check if it's a ZodOptional
  if ('_def' in schema && 'typeName' in (schema as { _def: { typeName?: string } })._def) {
    const typeName = (schema as { _def: { typeName: string } })._def.typeName
    return typeName === 'ZodOptional' || typeName === 'ZodDefault'
  }
  
  return true
}


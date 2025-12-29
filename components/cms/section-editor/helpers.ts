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
    const toImageObjects = (value: unknown) => {
      if (!Array.isArray(value)) return []
      return value.map((item) => {
        if (typeof item === 'string') {
          return { image: item, alt: '' }
        }
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const record = item as Record<string, unknown>
          return {
            image: typeof record['image'] === 'string' ? record['image'] : '',
            alt: typeof record['alt'] === 'string' ? record['alt'] : '',
          }
        }
        return { image: '', alt: '' }
      })
    }
    normalized['images'] = {
      ...images,
      women: toImageObjects(images['women']),
      men: toImageObjects(images['men']),
      grid: toImageObjects(images['grid']),
    }
  }

  if (sectionType === 'pricing-faq') {
    const legacyText = normalized['cta_text']
    const legacyLink = normalized['cta_link']
    const existingCta = normalized['cta']

    if ((!existingCta || typeof existingCta !== 'object') && (legacyText || legacyLink)) {
      normalized['cta'] = {
        text: typeof legacyText === 'string' ? legacyText : '',
        link: typeof legacyLink === 'string' ? legacyLink : '',
        buttonText: '',
        show: true,
      }
    }

    if (existingCta && typeof existingCta === 'object' && !Array.isArray(existingCta)) {
      const ctaRecord = existingCta as Record<string, unknown>
      const legacyTitle = ctaRecord['title']
      if (!ctaRecord['text'] && typeof legacyTitle === 'string') {
        ctaRecord['text'] = legacyTitle
      }
      normalized['cta'] = ctaRecord
    }

    delete normalized['cta_text']
    delete normalized['cta_link']
  }

  if (sectionType === 'content') {
    const sections = Array.isArray(normalized['sections']) ? normalized['sections'] : []
    normalized['sections'] = sections.map((section) => {
      if (!section || typeof section !== 'object' || Array.isArray(section)) {
        return { heading: '', content: '', items: [] }
      }

      const record = section as Record<string, unknown>
      const items = Array.isArray(record['items']) ? record['items'] : []
      const normalizedItems = items.map((item) => {
        if (typeof item === 'string') {
          return { text: item, icon: '', show: true }
        }
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          const itemRecord = item as Record<string, unknown>
          return {
            text: typeof itemRecord['text'] === 'string' ? itemRecord['text'] : '',
            icon: typeof itemRecord['icon'] === 'string' ? itemRecord['icon'] : '',
            show: typeof itemRecord['show'] === 'boolean' ? itemRecord['show'] : true,
          }
        }
        return { text: '', icon: '', show: true }
      })

      return {
        ...record,
        items: normalizedItems,
      }
    })
  }

  return normalized
}

/**
 * Get human-readable label from field path
 */
export function getFieldLabel(path: string): string {
  const parts = path.split('.')
  const lastPart = parts[parts.length - 1] ?? 'Field'

  const normalizedKey = lastPart
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase()

  const labelOverrides: Record<string, string> = {
    cta: 'Call to action',
    href: 'Link',
    url: 'URL',
    link: 'Link',
    aria_label: 'Accessibility label',
    alt: 'Alt text',
    id: 'ID',
    order_index: 'Order',
  }

  if (labelOverrides[normalizedKey]) {
    return labelOverrides[normalizedKey]
  }

  const readable = lastPart
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()

  return readable.replace(/^./, (str) => str.toUpperCase())
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

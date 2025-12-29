/**
 * Schema Walker
 * 
 * Traverses a Zod schema and renders all fields dynamically.
 */

'use client'

import React, { useMemo, useState } from 'react'
import * as z from 'zod'
import { renderField } from './field-renderers'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Button } from '@/components/ui/button'

interface SchemaWalkerProps<T extends FieldValues> {
  control: Control<T>
  schema: z.ZodSchema
  basePath: FieldPath<T>
  bucket?: string
  pages?: Array<{ slug: string; title: string }>
}

/**
 * Walk through a Zod schema and render all fields
 */
export function SchemaWalker<T extends FieldValues>({
  control,
  schema,
  basePath,
  bucket,
  pages,
}: SchemaWalkerProps<T>): React.ReactElement {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const groups = useMemo(() => {
    const grouped: Record<'content' | 'cta' | 'media' | 'advanced', Array<{ key: string; schema: z.ZodSchema }>> = {
      content: [],
      cta: [],
      media: [],
      advanced: [],
    }

    const schemaShape = extractSchemaShape(schema)
    Object.entries(schemaShape).forEach(([key, fieldSchema]) => {
      const group = getFieldGroup(key, fieldSchema)
      grouped[group].push({ key, schema: fieldSchema as z.ZodSchema })
    })

    return grouped
  }, [schema])

  const renderGroup = (
    groupLabel: string,
    items: Array<{ key: string; schema: z.ZodSchema }>,
    options?: { collapsible?: boolean; expanded?: boolean; onToggle?: () => void }
  ) => {
    if (items.length === 0) return null

    const content = items.map(({ key, schema: fieldSchema }) => {
      const fieldPath = `${basePath}.${key}` as FieldPath<T>

      // CRITICAL FIX: Unwrap optional objects before passing to renderField
      let unwrappedSchema = fieldSchema as z.ZodSchema
      if ('_def' in fieldSchema) {
        const def = (fieldSchema as any)._def
        if (def.typeName === 'ZodOptional' && def.innerType && '_def' in def.innerType) {
          const innerDef = def.innerType._def
          if (innerDef.typeName === 'ZodObject') {
            unwrappedSchema = def.innerType as z.ZodSchema
            console.log('SchemaWalker: Unwrapped optional object for', key, {
              originalType: def.typeName,
              unwrappedType: innerDef.typeName
            })
          }
        }
      }

      if (key === 'cta' || key === 'images') {
        const zodType = getZodTypeForDebug(unwrappedSchema)
        console.log('SchemaWalker: Rendering field', {
          key,
          fieldPath,
          zodType,
          schemaType: (unwrappedSchema as any)?._def?.typeName,
          wasOptional: (fieldSchema as any)?._def?.typeName === 'ZodOptional'
        })
      }

      return (
        <div key={key}>
          {renderField({
            control,
            name: fieldPath,
            schema: unwrappedSchema,
            bucket,
            pages,
          })}
        </div>
      )
    })

    const collapsible = options?.collapsible
    const isExpanded = options?.expanded ?? true

    return (
      <div className="space-y-3 border rounded-lg p-4 cms-card-bg cms-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold cms-text-primary">{groupLabel}</h3>
          {collapsible && options?.onToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={options.onToggle}
              className="h-7 px-2 text-xs cms-text-secondary"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
          )}
        </div>
        {isExpanded && <div className="space-y-4">{content}</div>}
      </div>
    )
  }

  const contentGroup = renderGroup('Content', groups.content)
  const ctaGroup = renderGroup('CTA / Actions', groups.cta)
  const mediaGroup = renderGroup('Media', groups.media)
  const advancedGroup = renderGroup('Advanced', groups.advanced, {
    collapsible: true,
    expanded: showAdvanced,
    onToggle: () => setShowAdvanced((prev) => !prev),
  })

  const hasAnyFields =
    groups.content.length > 0 ||
    groups.cta.length > 0 ||
    groups.media.length > 0 ||
    groups.advanced.length > 0

  if (!hasAnyFields) {
    return (
      <div className="p-4 rounded-md border cms-card-bg cms-border">
        <p className="text-sm cms-text-secondary">
          No fields found for this section type. The schema may be empty or not properly defined.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {contentGroup}
      {ctaGroup}
      {mediaGroup}
      {advancedGroup}
    </div>
  )
}

/**
 * Extract shape from Zod schema (handles optional, default, etc.)
 */
function extractSchemaShape(schema: unknown): Record<string, z.ZodSchema> {
  if (!schema || typeof schema !== 'object') {
    return {}
  }

  // Handle ZodObject
  if ('_def' in schema) {
    const def = (schema as { 
      _def: { 
        typeName?: string
        shape?: () => Record<string, z.ZodSchema> | Record<string, z.ZodSchema>
        innerType?: unknown
        schema?: Record<string, z.ZodSchema>
      } 
    })._def

    // Unwrap optional/default/nullable/effects recursively
    if (def.typeName === 'ZodOptional' || def.typeName === 'ZodDefault' || def.typeName === 'ZodNullable') {
      return extractSchemaShape(def.innerType)
    }
    
    // Unwrap ZodEffects
    if (def.typeName === 'ZodEffects' && def.schema) {
      return extractSchemaShape(def.schema)
    }

    // Get shape from ZodObject
    if (def.typeName === 'ZodObject') {
      try {
        // Try shape() function first
        if (def.shape && typeof def.shape === 'function') {
          const shape = def.shape()
          if (shape && typeof shape === 'object') {
            return shape
          }
        }
        // Try direct shape property
        if (def.shape && typeof def.shape === 'object') {
          return def.shape as Record<string, z.ZodSchema>
        }
        // Try schema property (some Zod versions)
        if (def.schema && typeof def.schema === 'object') {
          return def.schema
        }
      } catch (error) {
        console.error('Error extracting shape from ZodObject:', error)
        return {}
      }
    }
  }

  // Try direct shape access (for ZodObject instances)
  if ('shape' in schema) {
    const shape = (schema as { shape: Record<string, z.ZodSchema> | (() => Record<string, z.ZodSchema>) }).shape
    if (typeof shape === 'function') {
      try {
        return shape()
      } catch {
        return {}
      }
    }
    if (typeof shape === 'object') {
      return shape
    }
  }

  return {}
}

/**
 * Helper to get Zod type for debugging
 */
function getZodTypeForDebug(schema: unknown): string {
  if (!schema || typeof schema !== 'object') return 'unknown'
  
  if ('_def' in schema) {
    const def = (schema as { _def: { typeName?: string; innerType?: unknown; schema?: unknown } })._def
    
    if (def.typeName === 'ZodOptional' || def.typeName === 'ZodDefault' || def.typeName === 'ZodNullable') {
      return `${def.typeName}(${getZodTypeForDebug(def.innerType)})`
    }
    
    if (def.typeName === 'ZodEffects' && def.schema) {
      return `ZodEffects(${getZodTypeForDebug(def.schema)})`
    }
    
    return def.typeName || 'unknown'
  }
  
  return 'unknown'
}

function getFieldGroup(
  key: string,
  schema: z.ZodSchema
): 'content' | 'cta' | 'media' | 'advanced' {
  const lowerKey = key.toLowerCase()
  const zodType = getZodTypeForDebug(schema)

  if (zodType.includes('ZodBoolean')) {
    return 'advanced'
  }

  if (lowerKey.includes('cta') || lowerKey.includes('action') || lowerKey.includes('button') || lowerKey.includes('link') || lowerKey.includes('url') || lowerKey.includes('href') || lowerKey.includes('submit')) {
    return 'cta'
  }

  if (lowerKey.includes('image') || lowerKey.includes('icon') || lowerKey.includes('logo') || lowerKey.includes('media') || lowerKey.includes('screenshot') || lowerKey.includes('photo') || lowerKey.includes('background')) {
    return 'media'
  }

  if (lowerKey.startsWith('show') || lowerKey.startsWith('enable') || lowerKey.startsWith('is')) {
    return 'advanced'
  }

  return 'content'
}

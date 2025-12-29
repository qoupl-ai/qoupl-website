/**
 * Schema Walker
 * 
 * Traverses a Zod schema and renders all fields dynamically.
 */

'use client'

import React from 'react'
import * as z from 'zod'
import { renderField } from './field-renderers'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface SchemaWalkerProps<T extends FieldValues> {
  control: Control<T>
  schema: z.ZodSchema
  basePath: FieldPath<T>
  bucket?: string
}

/**
 * Walk through a Zod schema and render all fields
 */
export function SchemaWalker<T extends FieldValues>({
  control,
  schema,
  basePath,
  bucket,
}: SchemaWalkerProps<T>): React.ReactElement {
  const fields: React.ReactNode[] = []

  // Extract schema shape
  const schemaShape = extractSchemaShape(schema)
  
  // Render each field
  Object.entries(schemaShape).forEach(([key, fieldSchema]) => {
    const fieldPath = `${basePath}.${key}` as FieldPath<T>
    
    // CRITICAL FIX: Unwrap optional objects before passing to renderField
    // If the schema is ZodOptional wrapping ZodObject, unwrap it
    let unwrappedSchema = fieldSchema as z.ZodSchema
    if ('_def' in fieldSchema) {
      const def = (fieldSchema as any)._def
      if (def.typeName === 'ZodOptional' && def.innerType && '_def' in def.innerType) {
        const innerDef = def.innerType._def
        if (innerDef.typeName === 'ZodObject') {
          // Unwrap the optional to get the object schema
          unwrappedSchema = def.innerType as z.ZodSchema
          console.log('SchemaWalker: Unwrapped optional object for', key, { 
            originalType: def.typeName,
            unwrappedType: innerDef.typeName
          })
        }
      }
    }
    
    // Debug logging for problematic fields
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
    
    fields.push(
      <div key={key}>
        {renderField({
          control,
          name: fieldPath,
          schema: unwrappedSchema, // Use unwrapped schema
          bucket,
        })}
      </div>
    )
  })

  // If no fields, show a message
  if (fields.length === 0) {
    return (
      <div className="p-4 rounded-md border cms-card-bg cms-border">
        <p className="text-sm cms-text-secondary">
          No fields found for this section type. The schema may be empty or not properly defined.
        </p>
      </div>
    )
  }

  return <>{fields}</>
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


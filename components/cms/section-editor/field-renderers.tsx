/**
 * Dynamic Field Renderers
 * 
 * Renders form fields based on Zod schema definitions.
 */

'use client'

import React from 'react'
import * as z from 'zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUploadField } from '@/components/cms/image-upload-field'
import { MultiImageUploadField } from '@/components/cms/multi-image-upload-field'
import { PageSelector } from '@/components/cms/page-selector'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { asString, asArray, asBoolean, getFieldLabel } from './helpers'
import { IconSelector } from '@/components/cms/icon-selector'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface FieldRendererProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  schema: z.ZodSchema
  label?: string
  description?: string
  bucket?: string
  pages?: Array<{ slug: string; title: string }>
}

/**
 * Render a single field based on its Zod schema
 */
export function renderField<T extends FieldValues>({
  control,
  name,
  schema,
  label,
  description,
  bucket,
  pages,
}: FieldRendererProps<T>): React.ReactNode {
  const fieldLabel = label || getFieldLabel(name as string)
  const zodType = getZodType(schema)
  const fieldName = name as string

  // Debug logging for problematic fields
  if (fieldName.includes('cta') || fieldName.includes('images')) {
    const schemaDef = (schema as any)?._def
    console.log('renderField: Processing field', {
      fieldName,
      zodType,
      schemaType: schemaDef?.typeName,
      innerType: schemaDef?.innerType?._def?.typeName,
      hasDef: '_def' in schema,
      fullSchema: schema
    })
  }

  // FIRST: Check if it's an object by structure (shape property)
  // This works even when typeName is undefined
  if ('shape' in schema || ('_def' in schema && (schema as any)._def?.shape)) {
    if (fieldName.includes('cta') || fieldName.includes('images')) {
      console.log('renderField: Detected object by shape property, routing to renderObjectFields', { fieldName })
    }
    return renderObjectFields(control, name, schema, bucket, pages)
  }
  
  // SECOND: Check if it's an optional object BEFORE checking other types
  // This is critical because getZodType returns 'ZodOptional' for optional objects
  // We need to check the actual schema structure, not rely on getZodType
  if ('_def' in schema) {
    const def = (schema as any)._def
    // Check if it's ZodOptional
    if (def.typeName === 'ZodOptional' && def.innerType) {
      const innerType = def.innerType
      // Check if inner type is an object by structure
      if (innerType && (('shape' in innerType) || ('_def' in innerType && innerType._def?.shape))) {
        if (fieldName.includes('cta') || fieldName.includes('images')) {
          console.log('renderField: Detected optional object by shape, routing to renderObjectFields', { fieldName })
        }
        return renderObjectFields(control, name, schema, bucket, pages)
      }
      // Also check by typeName
      if (innerType && '_def' in innerType) {
        const innerDef = innerType._def
        if (innerDef?.typeName === 'ZodObject') {
          console.log('renderField: Detected optional object FIRST, routing to renderObjectFields', { 
            fieldName,
            outerType: def.typeName,
            innerType: innerDef.typeName
          })
          return renderObjectFields(control, name, schema, bucket, pages)
        }
      }
    }
    // Also check if it's directly a ZodObject (in case unwrapping already happened)
    if (def.typeName === 'ZodObject') {
      if (fieldName.includes('cta') || fieldName.includes('images')) {
        console.log('renderField: Detected direct ZodObject, routing to renderObjectFields', { fieldName })
      }
      return renderObjectFields(control, name, schema, bucket, pages)
    }
  }

  // Handle arrays
  if (zodType === 'ZodArray' || zodType === 'array') {
    return renderArrayField(control, name, schema, fieldLabel, description, bucket, pages)
  }

  // Handle objects (nested) - check for both 'ZodObject' and 'object'
  if (zodType === 'ZodObject' || zodType === 'object') {
    if (fieldName.includes('cta') || fieldName.includes('images')) {
      console.log('renderField: Routing to renderObjectFields', { fieldName, zodType })
    }
    return renderObjectFields(control, name, schema, bucket, pages)
  }

  // Handle primitives
  switch (zodType) {
    case 'ZodString':
    case 'string':
      // SAFETY CHECK: Before rendering as string, verify it's actually a string schema
      // If the schema structure shows it's an object, route to object renderer instead
      if ('_def' in schema) {
        const def = (schema as any)._def
        // Check if it's actually an object masquerading as a string
        if (def.typeName === 'ZodObject' || 
            (def.typeName === 'ZodOptional' && def.innerType && '_def' in def.innerType && def.innerType._def.typeName === 'ZodObject')) {
          console.error('renderField: String case received object schema! Routing to renderObjectFields', { fieldName, defType: def.typeName })
          return renderObjectFields(control, name, schema, bucket, pages)
        }
      }
      return renderStringField(control, name, fieldLabel, description, bucket, schema, pages)
    case 'ZodNumber':
    case 'number':
      return renderNumberField(control, name, fieldLabel, description)
    case 'ZodBoolean':
    case 'boolean':
      return renderBooleanField(control, name, fieldLabel, description)
    case 'ZodOptional': {
      // CRITICAL: Check if optional wraps an object - if so, render as object
      if ('_def' in schema) {
        const def = (schema as any)._def
        if (def.innerType && '_def' in def.innerType) {
          const innerDef = def.innerType._def
          if (innerDef?.typeName === 'ZodObject') {
            console.log('renderField: Found optional object in switch case, routing to renderObjectFields', { fieldName, zodType })
            return renderObjectFields(control, name, schema, bucket, pages)
          }
        }
      }
      // If optional wraps something else, unwrap and try again
      if ('_def' in schema && (schema as any)._def?.innerType) {
        const innerSchema = (schema as any)._def.innerType
        return renderField({
          control,
          name,
          schema: innerSchema,
          label: fieldLabel,
          description,
          bucket,
          pages,
        })
      }
      // Fall through to default - return string field as fallback
      console.warn('Unknown zod type:', zodType, 'for field:', name, 'schema type:', (schema as any)?._def?.typeName)
      return renderStringField(control, name, fieldLabel, description, bucket, schema, pages)
    }
    default:
      // Final check: is this an optional object that wasn't caught?
      if ('_def' in schema) {
        const def = (schema as any)._def
        if (def.typeName === 'ZodOptional' && def.innerType) {
          // Check by structure first
          if (('shape' in def.innerType) || ('_def' in def.innerType && def.innerType._def?.shape)) {
            console.log('renderField: Found optional object in default case (by shape), routing to renderObjectFields', { fieldName, zodType })
            return renderObjectFields(control, name, schema, bucket, pages)
          }
          // Check by typeName
          if ('_def' in def.innerType) {
            const innerDef = def.innerType._def
            if (innerDef?.typeName === 'ZodObject') {
              console.log('renderField: Found optional object in default case, routing to renderObjectFields', { fieldName, zodType })
              return renderObjectFields(control, name, schema, bucket, pages)
            }
          }
        }
        // Check if def itself has shape (direct ZodObject without typeName)
        if (def.shape || (def.typeName === undefined && 'shape' in schema)) {
          console.log('renderField: Found object by shape in default case, routing to renderObjectFields', { fieldName, zodType })
          return renderObjectFields(control, name, schema, bucket, pages)
        }
      }
      // Check if schema itself has shape property (direct ZodObject)
      if ('shape' in schema) {
        console.log('renderField: Found object by direct shape property in default case, routing to renderObjectFields', { fieldName, zodType })
        return renderObjectFields(control, name, schema, bucket, pages)
      }
      // For unknown types, try to render as string as fallback
      console.warn('Unknown zod type:', zodType, 'for field:', name, 'schema type:', (schema as any)?._def?.typeName)
      return renderStringField(control, name, fieldLabel, description, bucket, schema, pages)
  }
}

/**
 * Get Zod type name from schema (recursively unwraps optional/default/nullable/effects)
 */
function getZodType(schema: unknown): string {
  if (!schema || typeof schema !== 'object') return 'unknown'
  
  // Check for structural indicators first (when typeName is missing)
  if ('shape' in schema || ('_def' in schema && (schema as any)._def?.shape)) {
    return 'ZodObject'
  }
  if ('element' in schema || ('_def' in schema && (schema as any)._def?.element)) {
    return 'ZodArray'
  }
  
  if ('_def' in schema) {
    const def = (schema as { 
      _def: { 
        typeName?: string
        innerType?: unknown
        schema?: unknown // For ZodEffects
        shape?: unknown
        element?: unknown
      } 
    })._def
    
    // Unwrap optional/default/nullable/effects recursively
    if (def.typeName === 'ZodOptional' || def.typeName === 'ZodDefault' || def.typeName === 'ZodNullable') {
      return getZodType(def.innerType)
    }
    
    // Unwrap ZodEffects
    if (def.typeName === 'ZodEffects' && def.schema) {
      return getZodType(def.schema)
    }
    
    // Check for structural indicators in _def
    if (def.shape) {
      return 'ZodObject'
    }
    if (def.element) {
      return 'ZodArray'
    }
    
    return def.typeName || 'unknown'
  }
  
  return 'unknown'
}

/**
 * Render string field
 */
function renderStringField<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  label: string,
  description?: string,
  bucket?: string,
  schema?: z.ZodSchema,
  pages?: Array<{ slug: string; title: string }>
): React.ReactNode {
  const fieldName = name as string
  
  // CRITICAL SAFETY CHECK: If schema is actually an object, route to renderObjectFields
  // This catches cases where getZodType returned 'unknown' but the schema is actually an object
  if (schema) {
    if ('shape' in schema || ('_def' in schema && (schema as any)._def?.shape)) {
      console.warn('renderStringField: Schema is actually an object, routing to renderObjectFields', { fieldName })
      return renderObjectFields(control, name, schema, bucket, pages)
    }
    // Check if it's an optional object
    if ('_def' in schema) {
      const def = (schema as any)._def
      if (def.typeName === 'ZodOptional' && def.innerType) {
        if (('shape' in def.innerType) || ('_def' in def.innerType && def.innerType._def?.shape)) {
          console.warn('renderStringField: Schema is actually an optional object, routing to renderObjectFields', { fieldName })
          return renderObjectFields(control, name, schema, bucket, pages)
        }
      }
    }
  }
  
  // Check if it's an image field - but only if the schema is actually a string
  // Don't treat object fields as image fields even if they have "image" in the name
  const zodType = schema ? getZodType(schema) : 'string'
  const isImageField = (fieldName.includes('image') || fieldName.includes('Image')) && 
    (zodType === 'string' || zodType === 'ZodString')
  
  if (isImageField) {
    return (
      <FormField
        key={fieldName}
        control={control}
        name={name}
        render={({ field }) => {
          // Ensure value is always a string - if it's an object, this is a bug
          let stringValue = ''
          if (typeof field.value === 'string') {
            stringValue = field.value
          } else if (field.value === null || field.value === undefined) {
            stringValue = ''
          } else if (typeof field.value === 'object' && field.value !== null) {
            // If it's an object, convert to empty string and correct the form value
            console.warn('ImageUploadField received object value for string field, converting to empty string', { 
              fieldName, 
              value: field.value,
            })
            stringValue = ''
            // Correct the form value
            setTimeout(() => {
              field.onChange('')
            }, 0)
          } else {
            stringValue = String(field.value)
          }
          
          return (
            <FormItem>
              <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                {label}
              </FormLabel>
              <FormControl>
                <ImageUploadField
                  value={stringValue}
                  onChange={field.onChange}
                  bucket={bucket || 'hero-images'}
                  label=""
                  description={description}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  }

  const isIconField = /icon/i.test(fieldName)

  if (isIconField) {
    return (
      <FormField
        key={fieldName}
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
              {label}
            </FormLabel>
            <FormControl>
              <IconSelector
                value={asString(field.value)}
                onChange={(value) => field.onChange(value)}
                label={label}
              />
            </FormControl>
            {description && (
              <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  const fieldKey = fieldName.split('.').pop() || ''
  const normalizedKey = fieldKey
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase()
  const isLinkField =
    normalizedKey === 'href' ||
    normalizedKey === 'url' ||
    normalizedKey === 'link' ||
    normalizedKey.endsWith('_link') ||
    normalizedKey.endsWith('_url')

  // Check if it's a URL/link field
  if (isLinkField) {
    return (
      <FormField
        key={fieldName}
        control={control}
        name={name}
        render={({ field }) => {
          const stringValue = asString(field.value)
          return (
            <FormItem>
              <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                {label}
              </FormLabel>
              <FormControl>
                {pages && pages.length > 0 ? (
                  <PageSelector
                    value={stringValue}
                    onChange={field.onChange}
                    pages={pages}
                    placeholder={description}
                  />
                ) : (
                  <Input {...field} placeholder={description} value={stringValue} />
                )}
              </FormControl>
              {description && (
                <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                  {description}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  }

  // Default string field (textarea for longer content)
  const isLongField = fieldName.includes('content') || fieldName.includes('description') || fieldName.includes('excerpt') || fieldName.includes('answer')
  
  return (
    <FormField
      key={fieldName}
      control={control}
      name={name}
      render={({ field }) => {
        // CRITICAL: If value is an object, convert to empty string and log warning
        // This can happen when setNestedFormValues sets object values for string fields
        if (field.value !== null && field.value !== undefined && typeof field.value === 'object' && !Array.isArray(field.value)) {
          console.warn('renderStringField: Received object value for string field, converting to empty string', {
            fieldName,
            value: field.value,
            schemaType: (schema as any)?._def?.typeName,
          })
          // Immediately correct the form value
          setTimeout(() => {
            field.onChange('')
          }, 0)
        }
        
        // Ensure value is always a string for Input/Textarea
        // Handle objects (return empty string) and convert primitives
        const stringValue = typeof field.value === 'string' 
          ? field.value 
          : (field.value === null || field.value === undefined || typeof field.value === 'object')
            ? '' 
            : String(field.value)
        
        return (
          <FormItem>
            <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>
              {label}
            </FormLabel>
            <FormControl>
              {isLongField ? (
                <Textarea 
                  {...field} 
                  value={stringValue}
                  rows={3} 
                />
              ) : (
                <Input 
                  {...field} 
                  value={stringValue}
                />
              )}
            </FormControl>
            {description && (
              <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

/**
 * Render number field
 */
function renderNumberField<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  label: string,
  description?: string
): React.ReactNode {
  return (
    <FormField
      key={name as string}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              value={typeof field.value === 'number' ? field.value : (field.value === null || field.value === undefined ? 0 : Number(field.value) || 0)}
              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
            />
          </FormControl>
          {description && (
            <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/**
 * Render boolean field
 */
function renderBooleanField<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  label: string,
  description?: string
): React.ReactNode {
  return (
    <FormField
      key={name as string}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between p-4 rounded-lg border cms-card-bg cms-border">
          <div className="space-y-1 leading-none">
            <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
              {label}
            </FormLabel>
            {description && (
              <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                {description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <Switch checked={asBoolean(field.value)} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

/**
 * Render array field
 */
function renderArrayField<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  schema: z.ZodSchema,
  label: string,
  description?: string,
  bucket?: string,
  pages?: Array<{ slug: string; title: string }>
): React.ReactNode {
  const fieldName = name as string
  const arraySchema = schema as z.ZodArray<z.ZodSchema>
  const itemSchema = arraySchema._def.type as unknown as z.ZodSchema

  // Check if it's an image array (including nested paths like data.images.women)
  const isImageArray = fieldName.includes('image') || fieldName.includes('Image') || fieldName.includes('screenshots') || 
                       fieldName.includes('women') || fieldName.includes('men')
  
  if (isImageArray && getZodType(itemSchema) === 'string') {
    return (
      <FormField
        key={fieldName}
        control={control}
        name={name}
        render={({ field }) => {
          // Ensure value is always an array
          const fieldValue = Array.isArray(field.value) ? field.value : []
          // Determine bucket based on field name
          let imageBucket = bucket || 'hero-images'
          if (fieldName.includes('women') || fieldName.includes('men')) {
            imageBucket = 'couple-photos'
          } else if (fieldName.includes('screenshots')) {
            imageBucket = 'app-screenshots'
          }
          
          return (
            <FormItem>
              <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                {label}
              </FormLabel>
              <FormControl>
                <MultiImageUploadField
                  value={fieldValue}
                  onChange={field.onChange}
                  bucket={imageBucket}
                  label=""
                  description={description}
                  maxImages={20}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  }

  // Check if it's an array of strings (simple list)
  if (getZodType(itemSchema) === 'string') {
    return renderStringArrayField(control, name, label, description)
  }

  // Array of objects - render as expandable list
  return renderObjectArrayField(control, name, itemSchema as z.ZodSchema, label, description, bucket, pages)
}

/**
 * Render array of strings
 */
function renderStringArrayField<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  label: string,
  description?: string
): React.ReactNode {
  return (
    <FormField
      key={name as string}
      control={control}
      name={name}
      render={({ field }) => {
        const items = asArray<string>(field.value)
        return (
          <FormItem>
            <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>
              {label}
            </FormLabel>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => {
                        if (index === 0) return
                        const newItems = [...items]
                        const temp = newItems[index - 1]
                        newItems[index - 1] = newItems[index]
                        newItems[index] = temp ?? ''
                        field.onChange(newItems)
                      }}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={index === items.length - 1}
                      onClick={() => {
                        if (index >= items.length - 1) return
                        const newItems = [...items]
                        const temp = newItems[index + 1]
                        newItems[index + 1] = newItems[index]
                        newItems[index] = temp ?? ''
                        field.onChange(newItems)
                      }}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = e.target.value
                      field.onChange(newItems)
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== index)
                      field.onChange(newItems)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => field.onChange([...items, ''])}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            {description && (
              <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

/**
 * Render array of objects
 */
function renderObjectArrayField<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  itemSchema: z.ZodSchema,
  label: string,
  description?: string,
  bucket?: string,
  pages?: Array<{ slug: string; title: string }>
): React.ReactNode {
  return (
    <FormField
      key={name as string}
      control={control}
      name={name}
      render={({ field }) => {
        const items = asArray<Record<string, unknown>>(field.value)
        const objectSchema = itemSchema as z.ZodObject<z.ZodRawShape>
        let shape: Record<string, z.ZodSchema> = {}
        const shapeDef = (objectSchema as any)?._def?.shape
        if (typeof shapeDef === 'function') {
          shape = shapeDef()
        } else if (shapeDef && typeof shapeDef === 'object') {
          shape = shapeDef as Record<string, z.ZodSchema>
        }

        return (
          <FormItem>
            <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>
              {label}
            </FormLabel>
            <div className="space-y-4 border rounded-lg p-4">
              {items.map((_, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium cms-text-primary">Item {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => {
                          if (index === 0) return
                          const newItems = [...items]
                          const temp = newItems[index - 1]
                          newItems[index - 1] = newItems[index]
                          newItems[index] = temp ?? {}
                          field.onChange(newItems)
                        }}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={index === items.length - 1}
                        onClick={() => {
                          if (index >= items.length - 1) return
                          const newItems = [...items]
                          const temp = newItems[index + 1]
                          newItems[index + 1] = newItems[index]
                          newItems[index] = temp ?? {}
                          field.onChange(newItems)
                        }}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newItems = items.filter((_: unknown, i: number) => i !== index)
                          field.onChange(newItems)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {Object.entries(shape).map(([key, schema]) => {
                    const fieldPath = `${name}.${index}.${key}` as FieldPath<T>
                    return (
                      <div key={key}>
                        {renderField({
                          control,
                          name: fieldPath,
                          schema: schema as z.ZodSchema,
                          bucket,
                          pages,
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const defaultItem: Record<string, unknown> = {}
                  Object.keys(shape).forEach((key) => {
                    defaultItem[key] = undefined
                  })
                  field.onChange([...items, defaultItem])
                }}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add {label.slice(0, -1)}
              </Button>
            </div>
            {description && (
              <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

/**
 * Render nested object fields
 */
function renderObjectFields<T extends FieldValues>(
  control: Control<T>,
  name: FieldPath<T>,
  schema: z.ZodSchema,
  bucket?: string,
  pages?: Array<{ slug: string; title: string }>
): React.ReactNode {
  // Unwrap optional/default/nullable/effects schema recursively
  let currentSchema: any = schema
  let objectSchema: z.ZodObject<z.ZodRawShape> | null = null
  
  // Recursively unwrap until we find the ZodObject
  while (currentSchema && '_def' in currentSchema) {
    const def = currentSchema._def
    if (def.typeName === 'ZodObject') {
      objectSchema = currentSchema as z.ZodObject<z.ZodRawShape>
      break
    } else if (def.typeName === 'ZodOptional' || def.typeName === 'ZodDefault' || def.typeName === 'ZodNullable') {
      currentSchema = def.innerType
    } else if (def.typeName === 'ZodEffects' && def.schema) {
      currentSchema = def.schema
    } else {
      break
    }
  }
  
  if (!objectSchema) {
    console.error('Could not extract ZodObject from schema:', { fieldName: name, schema })
    return (
      <div className="p-2 rounded border border-red-500 bg-red-50 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">
          Error: Could not render object field. Schema type mismatch.
        </p>
      </div>
    )
  }
  
  // Get shape from the object schema
  let shape: Record<string, z.ZodSchema> = {}
  try {
    const shapeDef = (objectSchema as any)?._def?.shape
    if (typeof shapeDef === 'function') {
      shape = shapeDef()
    } else if (shapeDef && typeof shapeDef === 'object') {
      shape = shapeDef as Record<string, z.ZodSchema>
    }
  } catch (error) {
    console.error('Error extracting shape from object schema:', error, { fieldName: name })
  }
  
  const fieldName = name as string

  // Default object rendering - wrap in FormField to properly handle the object value
  return (
    <FormField
      key={fieldName}
      control={control}
      name={name}
      render={({ field }) => {
        // Ensure we have an object value, not a string
        let objectValue: Record<string, unknown> = {}
        if (field.value === null || field.value === undefined) {
          objectValue = {}
        } else if (typeof field.value === 'object' && !Array.isArray(field.value)) {
          objectValue = field.value as Record<string, unknown>
        } else {
          // If value is not an object, log error and use empty object
          console.error('renderObjectFields: Expected object value but got:', {
            fieldName,
            value: field.value,
            valueType: typeof field.value,
            isArray: Array.isArray(field.value)
          })
          objectValue = {}
        }
        
        // Debug for CTA and Images
        if (fieldName.includes('cta') || fieldName.includes('images')) {
          console.log('renderObjectFields: Rendering object field', {
            fieldName,
            objectValue,
            shapeKeys: Object.keys(shape)
          })
        }
        
        return (
          <FormItem>
            <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
              {getFieldLabel(fieldName)}
            </FormLabel>
            <div className="space-y-4 border rounded-lg p-4">
              {Object.entries(shape).map(([key, fieldSchema]) => {
                const fieldPath = `${name}.${key}` as FieldPath<T>
                // Unwrap optional schemas before rendering
                let unwrappedFieldSchema = fieldSchema as z.ZodSchema
                if ('_def' in fieldSchema) {
                  const def = (fieldSchema as any)._def
                  if (def.typeName === 'ZodOptional' && def.innerType) {
                    unwrappedFieldSchema = def.innerType as z.ZodSchema
                  }
                }
                return (
                  <div key={key}>
                    {renderField({
                      control,
                      name: fieldPath,
                      schema: unwrappedFieldSchema,
                      bucket,
                      pages,
                    })}
                  </div>
                )
              })}
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

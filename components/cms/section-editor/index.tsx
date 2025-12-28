/**
 * Section Editor Orchestrator
 * 
 * Main component that orchestrates the contract-driven section editor.
 * Replaces the monolithic section-editor.tsx with a schema-driven approach.
 */

'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  createSection,
  updateSection,
  type CreateSectionInput,
  type UpdateSectionInput,
} from '@/app/actions/section-actions'
import { getSectionContract, getSectionTypes } from '@/contracts/registry'
import { getFullSectionSchema, getDefaultData } from './schema-resolver'
import { normalizeContentData } from './helpers'
import { SchemaWalker } from './schema-walker'
import type { Section } from '@/types/section'

interface SectionEditorProps {
  pageId: string
  section?: Section | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SectionEditor({
  pageId,
  section,
  open,
  onOpenChange,
}: SectionEditorProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const isEditing = !!section
  const sectionType = section?.section_type || 'hero'

  // Get schema for this section type
  const schema = getFullSectionSchema(sectionType)

  // Type-safe resolver wrapper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolver = zodResolver(schema as any) as Resolver<any>

  // Initialize form with proper default values
  const getFormData = () => {
    const defaultData = getDefaultData(sectionType)
    
    if (section?.content) {
      const normalized = normalizeContentData(section.content as Record<string, unknown>, sectionType)
      console.log('SectionEditor: Loading content', {
        sectionId: section.id,
        sectionType,
        originalContent: section.content,
        normalizedContent: normalized,
      })
      
      // Merge normalized content with defaults to ensure all fields exist
      const mergedData = {
        ...defaultData,
        ...normalized,
      }
      
      return {
        type: sectionType,
        order_index: section.order_index ?? 0,
        published: section.published ?? false,
        data: mergedData,
      }
    }
    return {
      type: sectionType,
      order_index: 0,
      published: false,
      data: defaultData,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver,
    defaultValues: getFormData(),
  })

  // Helper function to recursively set all nested form values
  const setNestedFormValues = (obj: Record<string, unknown>, prefix: string) => {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldPath = `${prefix}.${key}` as any
      
      if (value === null || value === undefined) {
        form.setValue(fieldPath, value, { 
          shouldValidate: false, 
          shouldDirty: false,
          shouldTouch: false,
        })
      } else if (Array.isArray(value)) {
        // For arrays, set the whole array
        form.setValue(fieldPath, value, { 
          shouldValidate: false, 
          shouldDirty: false,
          shouldTouch: false,
        })
      } else if (typeof value === 'object') {
        // For objects, recursively set nested values
        setNestedFormValues(value as Record<string, unknown>, fieldPath)
        // Also set the whole object to ensure it's available
        form.setValue(fieldPath, value, { 
          shouldValidate: false, 
          shouldDirty: false,
          shouldTouch: false,
        })
      } else {
        // For primitives, set directly
        form.setValue(fieldPath, value, { 
          shouldValidate: false, 
          shouldDirty: false,
          shouldTouch: false,
        })
      }
    })
  }

  // Reset form when dialog opens or section changes
  useEffect(() => {
    if (!open) return

    const formData = getFormData()
    console.log('SectionEditor: Resetting form with data', formData)
    
    // Use setTimeout to ensure form is ready
    const timer = setTimeout(() => {
      // Reset form with new values
      form.reset(formData, {
        keepDefaultValues: false,
        keepValues: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      })
      
      // Recursively set all nested values to ensure they're properly bound
      if (formData.data && typeof formData.data === 'object') {
        setNestedFormValues(formData.data as Record<string, unknown>, 'data')
      }
    }, 50)
    
    return () => clearTimeout(timer)
  }, [open, section?.id ?? '', sectionType, form]) // Use empty string fallback to keep array size consistent

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      const data = values.data as Record<string, unknown>

      if (isEditing && section) {
        const input: UpdateSectionInput = {
          id: section.id,
          content: data,
          published: values.published as boolean,
          order_index: values.order_index as number,
        }
        await updateSection(input)
        toast.success('Section updated successfully')
      } else {
        const input: CreateSectionInput = {
          page_id: pageId,
          type: values.type as string,
          data,
          published: values.published as boolean,
          order_index: values.order_index as number,
        }
        await createSection(input)
        toast.success('Section created successfully')
      }

      onOpenChange(false)
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      toast.error('Failed to save section', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      })
    }
  }

  // Get available section types from contracts
  const availableTypes = getSectionTypes()
  const sectionContracts = availableTypes.map((type) => {
    const contract = getSectionContract(type)
    return { type, label: contract?.metadata.label || type, contract }
  })

  // Determine bucket based on section type
  const getBucket = (): string => {
    if (sectionType === 'hero' || sectionType === 'how-it-works') return 'hero-images'
    if (sectionType === 'gallery') return 'couple-photos'
    if (sectionType === 'app-download' || sectionType === 'coming-soon') return 'app-screenshots'
    if (sectionType === 'blog-post') return 'blog-images'
    return 'hero-images'
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        key={section?.id || 'new-section'} // Force re-render when section changes
        className="max-w-4xl max-h-[90vh] overflow-y-auto cms-card cms-border"
        style={{
          fontFamily: "'Google Sans Flex', system-ui, sans-serif",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="cms-text-primary"
            style={{
              fontWeight: '600',
              fontSize: '18px',
              lineHeight: '1.4',
            }}
          >
            {isEditing ? 'Edit Section' : 'Create Section'}
          </DialogTitle>
          <DialogDescription
            className="cms-text-secondary"
            style={{
              fontSize: '13px',
              lineHeight: '1.5',
            }}
          >
            {isEditing
              ? `Update section content and settings. (Type: ${sectionType})`
              : 'Create a new section for this page.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Section Type Selector (only when creating) */}
            {!isEditing && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Section Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                      <FormControl>
                        <SelectTrigger className="cms-card cms-border cms-text-primary">
                          <SelectValue placeholder="Select section type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="cms-card cms-border">
                        {sectionContracts.map(({ type, label }) => (
                          <SelectItem key={type} value={type} className="cms-text-primary">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Choose the type of section you want to create
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Hidden type field when editing */}
            {isEditing && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} disabled={isEditing} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Hidden order_index field */}
            <FormField
              control={form.control}
              name="order_index"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Dynamically render fields from schema */}
            {(() => {
              try {
                const schemaObj = schema as z.ZodObject<z.ZodRawShape>
                const schemaShape = (schemaObj as any).shape || {}
                if (!schemaShape || !('data' in schemaShape)) {
                  throw new Error('Schema does not have data property')
                }
                const dataSchema = schemaShape['data'] as z.ZodSchema
                if (!dataSchema) {
                  throw new Error('Data schema is undefined')
                }
                return (
                  <SchemaWalker
                    control={form.control}
                    schema={dataSchema}
                    basePath="data"
                    bucket={getBucket()}
                  />
                )
              } catch (error) {
                // Fallback for unknown schema types
                console.error('Error rendering section editor:', error)
                console.error('Section type:', sectionType)
                console.error('Schema:', schema)
                return (
                  <div className="p-4 rounded-md border cms-card-bg cms-border">
                    <p className="text-sm cms-text-secondary">
                      Visual editor not available for section type: <strong className="cms-text-primary">{sectionType}</strong>
                    </p>
                    <p className="text-xs mt-2 cms-text-secondary">
                      Error: {error instanceof Error ? error.message : 'Unknown error'}
                    </p>
                    <p className="text-xs mt-2 cms-text-secondary">
                      Please contact the development team to add support for this section type.
                    </p>
                  </div>
                )
              }
            })()}

            {/* Published toggle */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 rounded-lg border cms-card-bg cms-border">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Publish Section
                    </FormLabel>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      {field.value
                        ? 'This section will be visible on the website'
                        : 'This section will be saved as a draft'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 cms-card cms-border cms-text-secondary"
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || isPending}
                className="h-10 px-5"
                style={{
                  backgroundColor: (form.formState.isSubmitting || isPending)
                    ? 'rgba(102, 45, 145, 0.5)'
                    : (form.watch('published') as boolean)
                      ? '#662D91'
                      : 'transparent',
                  borderColor: (form.watch('published') as boolean) ? '#662D91' : 'transparent',
                  color: (form.watch('published') as boolean) ? '#ffffff' : 'inherit',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {(form.formState.isSubmitting || isPending)
                  ? 'Saving...'
                  : form.watch('published')
                    ? (isEditing ? 'Save and Publish' : 'Create and Publish')
                    : (isEditing ? 'Save as Draft' : 'Create Draft')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


/**
 * Unified Section Editor
 * 
 * Type-based section editor that adapts to different section types.
 * Replaces blog-dialog, faq-dialog, feature-dialog, pricing-dialog.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  createSection,
  updateSection,
  type CreateSectionInput,
  type UpdateSectionInput,
} from '@/app/actions/section-actions'

// Base section schema
const baseSectionSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  order_index: z.number().int().min(0),
  published: z.boolean(),
})

// Type-specific schemas
const sectionSchemas: Record<string, z.ZodSchema> = {
  'hero': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      tagline: z.string(),
      subtitle: z.string(),
      cta: z.object({
        text: z.string(),
        buttonText: z.string(),
      }).optional(),
    }),
  }),
  'blog-post': baseSectionSchema.extend({
    data: z.object({
      title: z.string().min(5),
      slug: z.string().min(3),
      excerpt: z.string().min(20),
      content: z.string().min(50),
      author: z.string().optional(),
      publish_date: z.string().optional(),
      read_time: z.number().int().optional(),
      featured_image: z.string().optional(),
    }),
  }),
  'faq-category': baseSectionSchema.extend({
    data: z.object({
      category_id: z.string(),
      faqs: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })),
    }),
  }),
  'feature-category': baseSectionSchema.extend({
    data: z.object({
      category_id: z.string(),
      features: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })),
    }),
  }),
  'pricing-plans': baseSectionSchema.extend({
    data: z.object({
      plans: z.array(z.object({
        name: z.string(),
        price: z.number(),
        features: z.array(z.string()),
      })),
    }),
  }),
}

interface SectionEditorProps {
  pageId: string
  section?: {
    id: string
    component_type: string
    order_index: number
    content: any
    published: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SectionEditor({
  pageId,
  section,
  open,
  onOpenChange,
}: SectionEditorProps) {
  const router = useRouter()
  const isEditing = !!section
  const sectionType = section?.component_type || 'hero'

  // Get schema for this section type, fallback to base
  const schema = sectionSchemas[sectionType] || baseSectionSchema.extend({
    data: z.record(z.any()),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: sectionType,
      order_index: section?.order_index || 0,
      published: section?.published ?? false,
      data: section?.content || {},
    },
  })

  useEffect(() => {
    if (section) {
      form.reset({
        type: section.component_type,
        order_index: section.order_index,
        published: section.published,
        data: section.content,
      })
    }
  }, [section, form])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      if (isEditing && section) {
        const updateData: UpdateSectionInput = {
          type: values.type,
          order_index: values.order_index,
          data: values.data,
          published: values.published,
        }
        await updateSection(section.id, updateData)
        toast.success('Section updated successfully')
      } else {
        const createData: CreateSectionInput = {
          page_id: pageId,
          type: values.type,
          order_index: values.order_index,
          data: values.data,
          published: values.published,
        }
        await createSection(createData)
        toast.success('Section created successfully')
      }

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save section')
    }
  }

  // Render type-specific fields
  const renderTypeSpecificFields = () => {
    switch (sectionType) {
      case 'hero':
        return (
          <>
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )

      case 'blog-post':
        return (
          <>
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )

      default:
        return (
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data (JSON)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={JSON.stringify(field.value, null, 2)}
                    onChange={(e) => {
                      try {
                        field.onChange(JSON.parse(e.target.value))
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    rows={10}
                  />
                </FormControl>
                <FormDescription>
                  Enter section data as JSON
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#212121',
          borderColor: '#2a2a2a',
          fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif"
        }}
      >
        <DialogHeader>
          <DialogTitle
            style={{ 
              color: '#ffffff', 
              fontWeight: '600', 
              fontSize: '18px',
              lineHeight: '1.4'
            }}
          >
            {isEditing ? 'Edit Section' : 'Create Section'}
          </DialogTitle>
          <DialogDescription
            style={{ 
              color: '#898989', 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {isEditing
              ? 'Update section content and settings.'
              : 'Create a new section for this page.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEditing} />
                  </FormControl>
                  <FormDescription>
                    Section type (hero, blog-post, faq-category, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_index"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Index</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Display order (lower numbers appear first)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {renderTypeSpecificFields()}

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Published</FormLabel>
                    <FormDescription>
                      Published sections are visible on the website
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5"
                style={{
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                  color: '#898989',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="h-10 px-5"
                style={{
                  backgroundColor: form.formState.isSubmitting ? '#171717' : '#212121',
                  borderColor: '#2a2a2a',
                  color: form.formState.isSubmitting ? '#5a5a5a' : '#898989',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {form.formState.isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update'
                    : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


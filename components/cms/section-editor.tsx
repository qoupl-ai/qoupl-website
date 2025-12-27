/**
 * Unified Section Editor
 * 
 * Type-based section editor that adapts to different section types.
 * Replaces blog-dialog, faq-dialog, feature-dialog, pricing-dialog.
 */

'use client'

import { useState, useEffect, useTransition } from 'react'
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
import { ImageUploadField } from '@/components/cms/image-upload-field'
import { MultiImageUploadField } from '@/components/cms/multi-image-upload-field'
import { IconSelector } from '@/components/cms/icon-selector'
import { ColorPicker } from '@/components/cms/color-picker'
import { Plus, Trash2 } from 'lucide-react'
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
      image: z.string().optional(),
      background_image: z.string().optional(),
      images: z.object({
        women: z.array(z.string()).optional(),
        men: z.array(z.string()).optional(),
      }).optional(),
      cta: z.object({
        text: z.string(),
        buttonText: z.string(),
        link: z.string().optional(),
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
  'values': baseSectionSchema.extend({
    data: z.object({
      values: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
        color: z.string().optional(),
      })),
    }),
  }),
  'how-it-works': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      steps: z.array(z.object({
        step: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
      })),
    }),
  }),
  'product-features': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      features: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
        highlights: z.array(z.string()).optional(),
        image: z.string().optional(),
        color: z.string().optional(),
      })),
    }),
  }),
  'gallery': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      images: z.array(z.object({
        image: z.string(),
        alt: z.string().optional(),
        title: z.string().optional(),
        story: z.string().optional(),
      })),
      cta: z.object({
        text: z.string(),
        highlight: z.string().optional(),
      }).optional(),
    }),
  }),
  'testimonials': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      testimonials: z.array(z.object({
        name: z.string(),
        image: z.string(),
        text: z.string(),
        location: z.string().optional(),
        rating: z.number().optional(),
        date: z.string().optional(),
      })),
      stats: z.object({
        text: z.string(),
        icon: z.string().optional(),
      }).optional(),
    }),
  }),
  'app-download': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      benefits: z.array(z.string()).optional(),
      cta: z.object({
        text: z.string(),
        subtext: z.string().optional(),
      }).optional(),
      platforms: z.array(z.object({
        name: z.string(),
        icon: z.string(),
        coming: z.boolean().optional(),
      })),
      stats: z.object({
        text: z.string(),
        count: z.string().optional(),
        suffix: z.string().optional(),
      }).optional(),
      images: z.object({
        decorative: z.array(z.string()).optional(),
      }).optional(),
    }),
  }),
  'coming-soon': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      cta: z.object({
        text: z.string(),
      }).optional(),
      platforms: z.array(z.object({
        name: z.string(),
        icon: z.string(),
        coming: z.boolean().optional(),
      })),
      stats: z.object({
        text: z.string(),
        count: z.string().optional(),
      }).optional(),
      screenshots: z.array(z.string()).optional(),
    }),
  }),
  'timeline': baseSectionSchema.extend({
    data: z.object({
      timeline: z.array(z.object({
        year: z.string(),
        event: z.string(),
        description: z.string(),
      })),
    }),
  }),
  'why-join': baseSectionSchema.extend({
    data: z.object({
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })),
    }),
  }),
  'content': baseSectionSchema.extend({
    data: z.record(z.any()),
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
  const [isPending, startTransition] = useTransition()
  const isEditing = !!section
  const sectionType = section?.component_type || 'hero'

  // Get schema for this section type, fallback to base
  const schema = sectionSchemas[sectionType] || baseSectionSchema.extend({
    data: z.record(z.any()),
  })

  // Helper to get default data based on section type
  const getDefaultData = () => {
    if (!section?.content) return {}
    
    const content = { ...section.content }
    
    // Only add images structure for hero sections
    if (sectionType === 'hero' && content.images) {
      content.images = {
        women: Array.isArray(content.images.women) ? content.images.women : [],
        men: Array.isArray(content.images.men) ? content.images.men : [],
        ...content.images,
      }
    }
    
    return content
  }

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: sectionType,
      order_index: section?.order_index || 0,
      published: section?.published ?? false,
      data: getDefaultData(),
    },
  })

  useEffect(() => {
    if (section && open) {
      const defaultData = getDefaultData()
      form.reset({
        type: section.component_type,
        order_index: section.order_index,
        published: section.published,
        data: defaultData,
      })
    }
  }, [section, open, form, sectionType])

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
        toast.success('Section updated successfully', {
          description: 'Changes have been saved and will appear immediately.',
        })
      } else {
        const createData: CreateSectionInput = {
          page_id: pageId,
          type: values.type,
          order_index: values.order_index,
          data: values.data,
          published: values.published,
        }
        await createSection(createData)
        toast.success('Section created successfully', {
          description: 'Your new section has been added.',
        })
      }

      onOpenChange(false)
      
      // Use startTransition for better UX during refresh
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      toast.error('Failed to save section', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      })
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Tagline</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Hero Image</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      bucket="hero-images"
                      label=""
                      description="Main image displayed in the hero section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.background_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Background Image (Optional)</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      bucket="hero-images"
                      label=""
                      description="Background image for the hero section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.images.women"
              render={({ field }) => {
                // Ensure we have an array
                const fieldValue = Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])
                
                return (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Women Carousel Images</FormLabel>
                    <FormControl>
                      <MultiImageUploadField
                        value={fieldValue}
                        onChange={field.onChange}
                        bucket="hero-images"
                        label=""
                        description="Images for the carousel (women profiles)"
                        maxImages={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="data.images.men"
              render={({ field }) => {
                // Ensure we have an array
                const fieldValue = Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])
                
                return (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Men Carousel Images</FormLabel>
                    <FormControl>
                      <MultiImageUploadField
                        value={fieldValue}
                        onChange={field.onChange}
                        bucket="hero-images"
                        label=""
                        description="Images for the carousel (men profiles)"
                        maxImages={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="data.cta.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Call to Action Text (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Get Started" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.cta.buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Button Text (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Sign Up Now" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.cta.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Button Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., /signup" />
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Slug</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Excerpt</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.featured_image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      bucket="blog-images"
                      label="Featured Image"
                      description="Main image for the blog post"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Author</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Author name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.read_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Read Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )

      case 'faq-category':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Category ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., general" />
                  </FormControl>
                  <FormDescription style={{ color: '#898989', fontSize: '12px' }}>
                    Category identifier for grouping FAQs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                FAQs
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentFaqs = form.getValues('data.faqs') || []
                  form.setValue('data.faqs', [...currentFaqs, { question: '', answer: '' }])
                }}
                className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add FAQ
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.faqs"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((faq: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            FAQ #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFaqs = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newFaqs)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.faqs.${index}.question`}
                          render={({ field: questionField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Question
                              </FormLabel>
                              <FormControl>
                                <Input {...questionField} placeholder="Enter question" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.faqs.${index}.answer`}
                          render={({ field: answerField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Answer
                              </FormLabel>
                              <FormControl>
                                <Textarea {...answerField} rows={3} placeholder="Enter answer" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No FAQs added yet. Click "Add FAQ" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
          </div>
        )

      case 'feature-category':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Category ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., core-features" />
                  </FormControl>
                  <FormDescription style={{ color: '#898989', fontSize: '12px' }}>
                    Category identifier for grouping features
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Features
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentFeatures = form.getValues('data.features') || []
                  form.setValue('data.features', [...currentFeatures, { title: '', description: '', icon: '' }])
                }}
                className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Feature
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.features"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Feature #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFeatures = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newFeatures)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Feature title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Feature description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.icon`}
                          render={({ field: iconField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Icon
                              </FormLabel>
                              <FormControl>
                                <IconSelector
                                  value={iconField.value}
                                  onChange={iconField.onChange}
                                  label="Icon"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No features added yet. Click "Add Feature" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
          </div>
        )

      case 'pricing-plans':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <label style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Pricing Plans
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentPlans = form.getValues('data.plans') || []
                  form.setValue('data.plans', [...currentPlans, { name: '', price: 0, features: [] }])
                }}
                className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Plan
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.plans"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((plan: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Plan #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlans = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newPlans)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.plans.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Plan Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="e.g., Basic, Pro" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.plans.${index}.price`}
                            render={({ field: priceField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...priceField}
                                    onChange={(e) => priceField.onChange(parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium" style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                              Features
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentFeatures = plan.features || []
                                const updatedPlans = [...field.value]
                                updatedPlans[index].features = [...currentFeatures, '']
                                field.onChange(updatedPlans)
                              }}
                              className="h-6 px-2 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          {(plan.features || []).map((feature: string, featureIndex: number) => (
                            <div key={featureIndex} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const updatedPlans = [...field.value]
                                  updatedPlans[index].features[featureIndex] = e.target.value
                                  field.onChange(updatedPlans)
                                }}
                                placeholder="Feature description"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedPlans = [...field.value]
                                  updatedPlans[index].features = plan.features.filter(
                                    (_: string, i: number) => i !== featureIndex
                                  )
                                  field.onChange(updatedPlans)
                                }}
                                className="h-9 w-9 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a] shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No pricing plans added yet. Click "Add Plan" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
          </div>
        )

      case 'values':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <label style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Values
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentValues = form.getValues('data.values') || []
                  form.setValue('data.values', [...currentValues, { icon: '', title: '', description: '', color: 'bg-[#662D91]' }])
                }}
                className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Value
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.values"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((value: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Value #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newValues = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newValues)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.values.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <IconSelector
                                    value={iconField.value}
                                    onChange={iconField.onChange}
                                    label="Icon"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.values.${index}.color`}
                            render={({ field: colorField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Color
                                </FormLabel>
                                <FormControl>
                                  <ColorPicker
                                    value={colorField.value}
                                    onChange={colorField.onChange}
                                    label="Color"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.values.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Value title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.values.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Value description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No values added yet. Click "Add Value" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
          </div>
        )

      case 'how-it-works':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Steps
              </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentSteps = form.getValues('data.steps') || []
                    form.setValue('data.steps', [...currentSteps, { step: '', title: '', description: '', image: '' }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.steps"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((step: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Step #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newSteps = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newSteps)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.steps.${index}.step`}
                            render={({ field: stepField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Step Number
                                </FormLabel>
                                <FormControl>
                                  <Input {...stepField} placeholder="e.g., 01" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.steps.${index}.image`}
                            render={({ field: imageField }) => (
                              <FormItem>
                                <FormControl>
                                  <ImageUploadField
                                    value={imageField.value}
                                    onChange={imageField.onChange}
                                    bucket="app-screenshots"
                                    label="Step Image"
                                    description="Image for this step"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.steps.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Step title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.steps.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={3} placeholder="Step description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No steps added yet. Click "Add Step" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
          </div>
        )

      case 'product-features':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Features
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentFeatures = form.getValues('data.features') || []
                    form.setValue('data.features', [...currentFeatures, { icon: '', title: '', description: '', highlights: [], image: '', color: 'bg-[#662D91]' }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Feature
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.features"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Feature #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFeatures = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newFeatures)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.features.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <IconSelector
                                    value={iconField.value}
                                    onChange={iconField.onChange}
                                    label="Icon"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.features.${index}.color`}
                            render={({ field: colorField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Color
                                </FormLabel>
                                <FormControl>
                                  <ColorPicker
                                    value={colorField.value}
                                    onChange={colorField.onChange}
                                    label="Color"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Feature title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Feature description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.image`}
                          render={({ field: imageField }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploadField
                                  value={imageField.value}
                                  onChange={imageField.onChange}
                                  bucket="couple-photos"
                                  label="Feature Image"
                                  description="Image for this feature"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium" style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                              Highlights
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentHighlights = feature.highlights || []
                                const updatedFeatures = [...field.value]
                                updatedFeatures[index].highlights = [...currentHighlights, '']
                                field.onChange(updatedFeatures)
                              }}
                              className="h-6 px-2 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          {(feature.highlights || []).map((highlight: string, highlightIndex: number) => (
                            <div key={highlightIndex} className="flex gap-2">
                              <Input
                                value={highlight}
                                onChange={(e) => {
                                  const updatedFeatures = [...field.value]
                                  updatedFeatures[index].highlights[highlightIndex] = e.target.value
                                  field.onChange(updatedFeatures)
                                }}
                                placeholder="Highlight text"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFeatures = [...field.value]
                                  updatedFeatures[index].highlights = feature.highlights.filter(
                                    (_: string, i: number) => i !== highlightIndex
                                  )
                                  field.onChange(updatedFeatures)
                                }}
                                className="h-9 w-9 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a] shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No features added yet. Click "Add Feature" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <IconSelector
                        value={field.value}
                        onChange={field.onChange}
                        label="Badge Icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Love Stories" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Gallery Images
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentImages = form.getValues('data.images') || []
                    form.setValue('data.images', [...currentImages, { image: '', alt: '', title: '', story: '' }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Image
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.images"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((image: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Image #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newImages = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newImages)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.images.${index}.image`}
                          render={({ field: imageField }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploadField
                                  value={imageField.value}
                                  onChange={imageField.onChange}
                                  bucket="couple-photos"
                                  label="Image"
                                  description="Gallery image"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.images.${index}.title`}
                            render={({ field: titleField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Title
                                </FormLabel>
                                <FormControl>
                                  <Input {...titleField} placeholder="e.g., Sarah & Raj" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.images.${index}.alt`}
                            render={({ field: altField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Alt Text
                                </FormLabel>
                                <FormControl>
                                  <Input {...altField} placeholder="Image alt text" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.images.${index}.story`}
                          render={({ field: storyField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Story
                              </FormLabel>
                              <FormControl>
                                <Textarea {...storyField} rows={2} placeholder="Love story description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No images added yet. Click "Add Image" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Call to Action (Optional)
              </FormLabel>
              <FormField
                control={form.control}
                name="data.cta.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>CTA Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Be part of something beautiful." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.cta.highlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>Highlight Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Your story could be next." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case 'testimonials':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Heart" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Beta User Success Stories" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Testimonials
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentTestimonials = form.getValues('data.testimonials') || []
                    form.setValue('data.testimonials', [...currentTestimonials, { name: '', image: '', text: '', location: '', rating: 5, date: '' }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Testimonial
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.testimonials"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((testimonial: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Testimonial #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTestimonials = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newTestimonials)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="User name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.location`}
                            render={({ field: locationField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Location
                                </FormLabel>
                                <FormControl>
                                  <Input {...locationField} placeholder="e.g., Mumbai, Maharashtra" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.rating`}
                            render={({ field: ratingField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Rating (1-5)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...ratingField}
                                    onChange={(e) => ratingField.onChange(parseInt(e.target.value) || 5)}
                                    min={1}
                                    max={5}
                                    placeholder="5"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.date`}
                            render={({ field: dateField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Date
                                </FormLabel>
                                <FormControl>
                                  <Input {...dateField} placeholder="e.g., Beta User" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.testimonials.${index}.image`}
                          render={({ field: imageField }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploadField
                                  value={imageField.value}
                                  onChange={imageField.onChange}
                                  bucket="hero-images"
                                  label="Profile Image"
                                  description="User profile image"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.testimonials.${index}.text`}
                          render={({ field: textField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Testimonial Text
                              </FormLabel>
                              <FormControl>
                                <Textarea {...textField} rows={3} placeholder="Testimonial content" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No testimonials added yet. Click "Add Testimonial" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.stats.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Join 10,000+ people waiting" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Icon</FormLabel>
                    <FormControl>
                      <IconSelector
                        value={field.value}
                        onChange={field.onChange}
                        label="Stats Icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case 'app-download':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sparkles" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Coming Soon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Benefits
              </FormLabel>
              <FormField
                control={form.control}
                name="data.benefits"
                render={({ field }) => (
                  <div className="space-y-2">
                    {(field.value || []).map((benefit: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={benefit}
                          onChange={(e) => {
                            const updatedBenefits = [...(field.value || [])]
                            updatedBenefits[index] = e.target.value
                            field.onChange(updatedBenefits)
                          }}
                          placeholder="Benefit description"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedBenefits = (field.value || []).filter((_: string, i: number) => i !== index)
                            field.onChange(updatedBenefits)
                          }}
                          className="h-9 w-9 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a] shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentBenefits = field.value || []
                        field.onChange([...currentBenefits, ''])
                      }}
                      className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Benefit
                    </Button>
                  </div>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Call to Action
              </FormLabel>
              <FormField
                control={form.control}
                name="data.cta.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>CTA Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Join the Waitlist" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.cta.subtext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>CTA Subtext</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Limited spots available" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Platforms
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentPlatforms = form.getValues('data.platforms') || []
                    form.setValue('data.platforms', [...currentPlatforms, { name: '', icon: '', coming: true }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Platform
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.platforms"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((platform: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Platform #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlatforms = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newPlatforms)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Platform Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="e.g., App Store" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <Input {...iconField} placeholder="e.g., 🍎 or Apple" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No platforms added yet. Click "Add Platform" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="data.stats.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Join" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Count</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 10,000+" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Suffix</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., on the waitlist" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.images.decorative"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUploadField
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      bucket="couple-photos"
                      label="Decorative Images"
                      description="Decorative images for the section"
                      maxImages={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'coming-soon':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Title</FormLabel>
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
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sparkles" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Launching Soon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.cta.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>CTA Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Join Waitlist Now" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Platforms
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentPlatforms = form.getValues('data.platforms') || []
                    form.setValue('data.platforms', [...currentPlatforms, { name: '', icon: '', coming: true }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Platform
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.platforms"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((platform: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Platform #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlatforms = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newPlatforms)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Platform Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="e.g., App Store" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <Input {...iconField} placeholder="e.g., Apple or Smartphone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No platforms added yet. Click "Add Platform" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.stats.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., people already on the waitlist" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500' }}>Stats Count</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 10,000+" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.screenshots"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUploadField
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      bucket="app-screenshots"
                      label="Screenshots"
                      description="App screenshots to display"
                      maxImages={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'timeline':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Timeline Events
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentTimeline = form.getValues('data.timeline') || []
                    form.setValue('data.timeline', [...currentTimeline, { year: '', event: '', description: '' }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Event
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.timeline"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((event: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Event #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTimeline = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newTimeline)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.timeline.${index}.year`}
                            render={({ field: yearField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Year
                                </FormLabel>
                                <FormControl>
                                  <Input {...yearField} placeholder="e.g., 2024" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.timeline.${index}.event`}
                            render={({ field: eventField }) => (
                              <FormItem>
                                <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                  Event Title
                                </FormLabel>
                                <FormControl>
                                  <Input {...eventField} placeholder="e.g., qoupl Founded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.timeline.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Event description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No timeline events added yet. Click "Add Event" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        )

      case 'why-join':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                  Join Reasons
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentItems = form.getValues('data.items') || []
                    form.setValue('data.items', [...currentItems, { title: '', description: '', icon: '' }])
                  }}
                  className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.items"
                render={({ field }) => (
                  <div className="space-y-3">
                    {(field.value || []).map((item: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: '#898989' }}>
                            Item #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = field.value.filter((_: any, i: number) => i !== index)
                              field.onChange(newItems)
                            }}
                            className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.items.${index}.icon`}
                          render={({ field: iconField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Icon (Emoji or Text)
                              </FormLabel>
                              <FormControl>
                                <Input {...iconField} placeholder="e.g., 💜 or Heart" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.items.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Item title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.items.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Item description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(!field.value || field.value.length === 0) && (
                      <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                        No items added yet. Click "Add Item" to get started.
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        )

      case 'content':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Page Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Privacy Policy" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.lastUpdated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>Last Updated</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., December 2024" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                Content Sections
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentSections = form.getValues('data.sections') || []
                  form.setValue('data.sections', [...currentSections, { heading: '', content: '', items: [] }])
                }}
                className="h-8 px-3 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Section
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.sections"
              render={({ field }) => (
                <div className="space-y-3">
                  {(field.value || []).map((section: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: '#898989' }}>
                          Section #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newSections = field.value.filter((_: any, i: number) => i !== index)
                            field.onChange(newSections)
                          }}
                          className="h-7 w-7 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`data.sections.${index}.heading`}
                        render={({ field: headingField }) => (
                          <FormItem>
                            <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                              Heading
                            </FormLabel>
                            <FormControl>
                              <Input {...headingField} placeholder="e.g., 1. Acceptance of Terms" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.sections.${index}.content`}
                        render={({ field: contentField }) => (
                          <FormItem>
                            <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                              Content
                            </FormLabel>
                            <FormControl>
                              <Textarea {...contentField} rows={4} placeholder="Section content text..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel style={{ color: '#898989', fontWeight: '400', fontSize: '12px' }}>
                            Items (Optional)
                          </FormLabel>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentItems = section.items || []
                              const updatedSections = [...field.value]
                              updatedSections[index].items = [...currentItems, '']
                              field.onChange(updatedSections)
                            }}
                            className="h-6 px-2 text-xs text-[#898989] hover:text-white hover:bg-[#2a2a2a]"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Item
                          </Button>
                        </div>
                        {(section.items || []).map((item: string, itemIndex: number) => (
                          <div key={itemIndex} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const updatedSections = [...field.value]
                                updatedSections[index].items[itemIndex] = e.target.value
                                field.onChange(updatedSections)
                              }}
                              placeholder="Item text"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedSections = [...field.value]
                                updatedSections[index].items = section.items.filter(
                                  (_: string, i: number) => i !== itemIndex
                                )
                                field.onChange(updatedSections)
                              }}
                              className="h-9 w-9 p-0 text-[#898989] hover:text-white hover:bg-[#2a2a2a] shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(!field.value || field.value.length === 0) && (
                    <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                      No sections added yet. Click "Add Section" to get started.
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        )

      default:
        return (
          <div className="p-4 rounded-md border border-[#2a2a2a] bg-[#171717]">
            <p className="text-sm" style={{ color: '#898989' }}>
              Visual editor not available for section type: <strong style={{ color: '#ffffff' }}>{sectionType}</strong>
            </p>
            <p className="text-xs mt-2" style={{ color: '#5a5a5a' }}>
              Please contact the development team to add support for this section type.
            </p>
            <div className="mt-4 p-3 rounded bg-[#212121] border border-[#2a2a2a]">
              <p className="text-xs mb-2" style={{ color: '#898989' }}>Current content:</p>
              <pre className="text-xs overflow-auto max-h-40" style={{ color: '#898989' }}>
                {JSON.stringify(section?.content || {}, null, 2)}
              </pre>
            </div>
          </div>
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
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
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
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} disabled={isEditing} />
                  </FormControl>
                </FormItem>
              )}
            />

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

            {renderTypeSpecificFields()}

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 rounded-lg border" style={{ 
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a'
                }}>
                  <div className="space-y-1 leading-none">
                    <FormLabel style={{ color: '#ffffff', fontWeight: '500', fontSize: '14px' }}>
                      Publish Section
                    </FormLabel>
                    <FormDescription style={{ color: '#898989', fontSize: '12px' }}>
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
                disabled={form.formState.isSubmitting || isPending}
                className="h-10 px-5"
                style={{
                  backgroundColor: (form.formState.isSubmitting || isPending) ? '#171717' : (form.watch('published') ? '#662D91' : '#212121'),
                  borderColor: '#2a2a2a',
                  color: (form.formState.isSubmitting || isPending) ? '#5a5a5a' : '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600'
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


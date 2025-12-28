/**
 * Blog Post Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { blogPostSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer (blog posts may be handled differently)
const BlogPostRenderer: React.ComponentType<{ data: z.infer<typeof blogPostSectionSchema>['data'] }> = () => {
  return <div>Blog Post Section (Renderer to be implemented)</div>
}

// Placeholder editor
const BlogPostEditor: React.ComponentType<{
  value: z.infer<typeof blogPostSectionSchema>['data']
  onChange: (data: z.infer<typeof blogPostSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Blog Post Editor (Placeholder)</p>
    </div>
  )
}

const blogPostDataSchema = blogPostSectionSchema.shape.data

const defaultData: z.infer<typeof blogPostDataSchema> = {
  title: 'New Blog Post',
  slug: 'new-blog-post',
  excerpt: 'Enter a brief excerpt for this blog post...',
  content: 'Enter the full content of your blog post here...',
  category_id: undefined,
  author: undefined,
  publish_date: undefined,
  read_time: undefined,
  featured_image: undefined,
}

export const blogPostContract: SectionContract<z.infer<typeof blogPostDataSchema>> = {
  type: 'blog-post',
  schema: blogPostDataSchema,
  defaultData,
  editor: BlogPostEditor,
  renderer: BlogPostRenderer,
  metadata: {
    label: 'Blog Post',
    description: 'Blog post content section',
    icon: 'file-text',
    category: 'content',
  },
}


/**
 * FAQ Category Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { faqCategorySectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const FaqCategoryRenderer: React.ComponentType<{ data: z.infer<typeof faqCategorySectionSchema>['data'] }> = () => {
  return <div>FAQ Category Section (Renderer to be implemented)</div>
}

// Placeholder editor
const FaqCategoryEditor: React.ComponentType<{
  value: z.infer<typeof faqCategorySectionSchema>['data']
  onChange: (data: z.infer<typeof faqCategorySectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">FAQ Category Editor (Placeholder)</p>
    </div>
  )
}

const faqCategoryDataSchema = faqCategorySectionSchema.shape.data

const defaultData: z.infer<typeof faqCategoryDataSchema> = faqCategoryDataSchema.parse({})

export const faqCategoryContract: SectionContract<z.infer<typeof faqCategoryDataSchema>> = {
  type: 'faq-category',
  schema: faqCategoryDataSchema,
  defaultData,
  editor: FaqCategoryEditor,
  renderer: FaqCategoryRenderer,
  metadata: {
    label: 'FAQ Category',
    description: 'Section displaying a category of frequently asked questions',
    icon: 'help-circle',
    category: 'content',
  },
}

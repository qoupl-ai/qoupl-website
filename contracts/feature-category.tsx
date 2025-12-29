/**
 * Feature Category Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { featureCategorySectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const FeatureCategoryRenderer: React.ComponentType<{ data: z.infer<typeof featureCategorySectionSchema>['data'] }> = () => {
  return <div>Feature Category Section (Renderer to be implemented)</div>
}

// Placeholder editor
const FeatureCategoryEditor: React.ComponentType<{
  value: z.infer<typeof featureCategorySectionSchema>['data']
  onChange: (data: z.infer<typeof featureCategorySectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Feature Category Editor (Placeholder)</p>
    </div>
  )
}

const featureCategoryDataSchema = featureCategorySectionSchema.shape.data

const defaultData: z.infer<typeof featureCategoryDataSchema> = featureCategoryDataSchema.parse({})

export const featureCategoryContract: SectionContract<z.infer<typeof featureCategoryDataSchema>> = {
  type: 'feature-category',
  schema: featureCategoryDataSchema,
  defaultData,
  editor: FeatureCategoryEditor,
  renderer: FeatureCategoryRenderer,
  metadata: {
    label: 'Feature Category',
    description: 'Section displaying a category of product features',
    icon: 'star',
    category: 'content',
  },
}

/**
 * Pricing Info Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { pricingInfoSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const PricingInfoRenderer: React.ComponentType<{ data: z.infer<typeof pricingInfoSectionSchema>['data'] }> = () => {
  return <div>Pricing Info Section (Renderer to be implemented)</div>
}

// Placeholder editor
const PricingInfoEditor: React.ComponentType<{
  value: z.infer<typeof pricingInfoSectionSchema>['data']
  onChange: (data: z.infer<typeof pricingInfoSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Pricing Info Editor (Placeholder)</p>
    </div>
  )
}

const pricingInfoDataSchema = pricingInfoSectionSchema.shape.data

const defaultData: z.infer<typeof pricingInfoDataSchema> = {
  title: undefined,
  items: [],
}

export const pricingInfoContract: SectionContract<z.infer<typeof pricingInfoDataSchema>> = {
  type: 'pricing-info',
  schema: pricingInfoDataSchema,
  defaultData,
  editor: PricingInfoEditor,
  renderer: PricingInfoRenderer,
  metadata: {
    label: 'Pricing Info',
    description: 'Section displaying pricing information and details',
    icon: 'info',
    category: 'commerce',
  },
}


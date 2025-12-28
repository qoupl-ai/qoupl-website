/**
 * Pricing FAQ Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { pricingFaqSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const PricingFaqRenderer: React.ComponentType<{ data: z.infer<typeof pricingFaqSectionSchema>['data'] }> = () => {
  return <div>Pricing FAQ Section (Renderer to be implemented)</div>
}

// Placeholder editor
const PricingFaqEditor: React.ComponentType<{
  value: z.infer<typeof pricingFaqSectionSchema>['data']
  onChange: (data: z.infer<typeof pricingFaqSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Pricing FAQ Editor (Placeholder)</p>
    </div>
  )
}

const pricingFaqDataSchema = pricingFaqSectionSchema.shape.data

const defaultData: z.infer<typeof pricingFaqDataSchema> = {
  title: undefined,
  faqs: [],
  cta: undefined,
}

export const pricingFaqContract: SectionContract<z.infer<typeof pricingFaqDataSchema>> = {
  type: 'pricing-faq',
  schema: pricingFaqDataSchema,
  defaultData,
  editor: PricingFaqEditor,
  renderer: PricingFaqRenderer,
  metadata: {
    label: 'Pricing FAQ',
    description: 'Section displaying frequently asked questions about pricing',
    icon: 'help-circle',
    category: 'commerce',
  },
}


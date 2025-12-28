/**
 * Pricing Plans Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { pricingPlansSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const PricingPlansRenderer: React.ComponentType<{ data: z.infer<typeof pricingPlansSectionSchema>['data'] }> = () => {
  return <div>Pricing Plans Section (Renderer to be implemented)</div>
}

// Placeholder editor
const PricingPlansEditor: React.ComponentType<{
  value: z.infer<typeof pricingPlansSectionSchema>['data']
  onChange: (data: z.infer<typeof pricingPlansSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Pricing Plans Editor (Placeholder)</p>
    </div>
  )
}

const pricingPlansDataSchema = pricingPlansSectionSchema.shape.data

const defaultData: z.infer<typeof pricingPlansDataSchema> = {
  plans: [],
}

export const pricingPlansContract: SectionContract<z.infer<typeof pricingPlansDataSchema>> = {
  type: 'pricing-plans',
  schema: pricingPlansDataSchema,
  defaultData,
  editor: PricingPlansEditor,
  renderer: PricingPlansRenderer,
  metadata: {
    label: 'Pricing Plans',
    description: 'Section displaying pricing plan options',
    icon: 'credit-card',
    category: 'commerce',
  },
}


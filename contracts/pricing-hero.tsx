/**
 * Pricing Hero Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { pricingHeroSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const PricingHeroRenderer: React.ComponentType<{ data: z.infer<typeof pricingHeroSectionSchema>['data'] }> = () => {
  return <div>Pricing Hero Section (Renderer to be implemented)</div>
}

// Placeholder editor
const PricingHeroEditor: React.ComponentType<{
  value: z.infer<typeof pricingHeroSectionSchema>['data']
  onChange: (data: z.infer<typeof pricingHeroSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Pricing Hero Editor (Placeholder)</p>
    </div>
  )
}

const pricingHeroDataSchema = pricingHeroSectionSchema.shape.data

const defaultData: z.infer<typeof pricingHeroDataSchema> = {
  title: undefined,
  subtitle: undefined,
  badge: undefined,
}

export const pricingHeroContract: SectionContract<z.infer<typeof pricingHeroDataSchema>> = {
  type: 'pricing-hero',
  schema: pricingHeroDataSchema,
  defaultData,
  editor: PricingHeroEditor,
  renderer: PricingHeroRenderer,
  metadata: {
    label: 'Pricing Hero',
    description: 'Hero section for pricing page',
    icon: 'tag',
    category: 'commerce',
  },
}


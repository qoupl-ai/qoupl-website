/**
 * Hero Section Contract
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'
import { heroSectionSchema } from '@/lib/validation/section-schemas'

// Lazy-load renderer component with proper type wrapper
const HeroComponent = dynamic(() => import('@/components/sections/animated-hero'), {
  ssr: true,
})

// Wrap the component to match the expected contract interface
const HeroRenderer: React.ComponentType<{ 
  data: z.infer<typeof heroSectionSchema>['data'] 
}> = ({ data }) => {
  return <HeroComponent data={data} />
}

// Placeholder editor component (to be replaced when CMS editor is refactored)
const HeroEditor: React.ComponentType<{
  value: z.infer<typeof heroSectionSchema>['data']
  onChange: (data: z.infer<typeof heroSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Hero Section Editor (Placeholder)</p>
      <p className="text-xs mt-2">Editor will be implemented in CMS refactor</p>
    </div>
  )
}

// Extract data schema from full section schema
const heroDataSchema = heroSectionSchema.shape.data

// Default data
const defaultData: z.infer<typeof heroDataSchema> = heroDataSchema.parse({})

export const heroContract: SectionContract<z.infer<typeof heroDataSchema>> = {
  type: 'hero',
  schema: heroDataSchema,
  defaultData,
  editor: HeroEditor,
  renderer: HeroRenderer,
  metadata: {
    label: 'Hero Section',
    description: 'Main hero section with title, subtitle, CTA, and background images',
    icon: 'sparkles',
    category: 'layout',
  },
}

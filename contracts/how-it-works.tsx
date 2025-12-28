/**
 * How It Works Section Contract
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'
import { howItWorksSectionSchema } from '@/lib/validation/section-schemas'

// Lazy-load renderer component with proper type wrapper
const HowItWorksComponent = dynamic(() => import('@/components/sections/how-it-works'), {
  ssr: true,
})

// Wrap the component to match the expected contract interface
const HowItWorksRenderer: React.ComponentType<{ 
  data: z.infer<typeof howItWorksSectionSchema>['data'] 
}> = ({ data }) => {
  return <HowItWorksComponent data={data} />
}

// Placeholder editor
const HowItWorksEditor: React.ComponentType<{
  value: z.infer<typeof howItWorksSectionSchema>['data']
  onChange: (data: z.infer<typeof howItWorksSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">How It Works Editor (Placeholder)</p>
    </div>
  )
}

const howItWorksDataSchema = howItWorksSectionSchema.shape.data

const defaultData: z.infer<typeof howItWorksDataSchema> = {
  title: undefined,
  steps: [],
}

export const howItWorksContract: SectionContract<z.infer<typeof howItWorksDataSchema>> = {
  type: 'how-it-works',
  schema: howItWorksDataSchema,
  defaultData,
  editor: HowItWorksEditor,
  renderer: HowItWorksRenderer,
  metadata: {
    label: 'How It Works',
    description: 'Step-by-step explanation section',
    icon: 'play-circle',
    category: 'content',
  },
}


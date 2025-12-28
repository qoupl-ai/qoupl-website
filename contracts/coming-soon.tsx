/**
 * Coming Soon Section Contract
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'
import { comingSoonSectionSchema } from '@/lib/validation/section-schemas'

// Lazy-load renderer component with proper type wrapper
const ComingSoonComponent = dynamic(() => import('@/components/sections/coming-soon'), {
  ssr: true,
})

// Wrap the component to match the expected contract interface
const ComingSoonRenderer: React.ComponentType<{ 
  data: z.infer<typeof comingSoonSectionSchema>['data'] 
}> = ({ data }) => {
  return <ComingSoonComponent data={data} />
}

// Placeholder editor
const ComingSoonEditor: React.ComponentType<{
  value: z.infer<typeof comingSoonSectionSchema>['data']
  onChange: (data: z.infer<typeof comingSoonSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Coming Soon Editor (Placeholder)</p>
    </div>
  )
}

const comingSoonDataSchema = comingSoonSectionSchema.shape.data

const defaultData: z.infer<typeof comingSoonDataSchema> = {
  title: undefined,
  subtitle: undefined,
  badge: undefined,
  cta: undefined,
  platforms: undefined,
  stats: undefined,
  screenshots: undefined,
}

export const comingSoonContract: SectionContract<z.infer<typeof comingSoonDataSchema>> = {
  type: 'coming-soon',
  schema: comingSoonDataSchema,
  defaultData,
  editor: ComingSoonEditor,
  renderer: ComingSoonRenderer,
  metadata: {
    label: 'Coming Soon',
    description: 'Coming soon section with platform availability',
    icon: 'clock',
    category: 'cta',
  },
}


/**
 * Testimonials Section Contract
 */

import React from 'react'
import { z } from 'zod'
import dynamic from 'next/dynamic'
import type { SectionContract } from './types'
import { testimonialsSectionSchema } from '@/lib/validation/section-schemas'

// Lazy-load renderer component with proper type wrapper
const TestimonialsComponent = dynamic(() => import('@/components/sections/testimonials'), {
  ssr: true,
})

// Wrap the component to match the expected contract interface
const TestimonialsRenderer: React.ComponentType<{ 
  data: z.infer<typeof testimonialsSectionSchema>['data'] 
}> = ({ data }) => {
  return <TestimonialsComponent data={data} />
}

// Placeholder editor
const TestimonialsEditor: React.ComponentType<{
  value: z.infer<typeof testimonialsSectionSchema>['data']
  onChange: (data: z.infer<typeof testimonialsSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Testimonials Editor (Placeholder)</p>
    </div>
  )
}

const testimonialsDataSchema = testimonialsSectionSchema.shape.data

const defaultData: z.infer<typeof testimonialsDataSchema> = {
  title: undefined,
  subtitle: undefined,
  badge: undefined,
  testimonials: [],
  stats: undefined,
}

export const testimonialsContract: SectionContract<z.infer<typeof testimonialsDataSchema>> = {
  type: 'testimonials',
  schema: testimonialsDataSchema,
  defaultData,
  editor: TestimonialsEditor,
  renderer: TestimonialsRenderer,
  metadata: {
    label: 'Testimonials',
    description: 'Customer testimonials and reviews section',
    icon: 'quote',
    category: 'social',
  },
}


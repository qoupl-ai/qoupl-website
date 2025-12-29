/**
 * Why Join Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { whyJoinSectionSchema } from '@/lib/validation/section-schemas'

const whyJoinDataSchema = whyJoinSectionSchema.shape.data

// Placeholder renderer
const WhyJoinRenderer: React.ComponentType<{ data: z.infer<typeof whyJoinDataSchema> }> = () => {
  return <div>Why Join Section (Renderer to be implemented)</div>
}

// Placeholder editor
const WhyJoinEditor: React.ComponentType<{
  value: z.infer<typeof whyJoinDataSchema>
  onChange: (data: z.infer<typeof whyJoinDataSchema>) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Why Join Editor (Placeholder)</p>
    </div>
  )
}

const defaultData: z.infer<typeof whyJoinDataSchema> = whyJoinDataSchema.parse({})

export const whyJoinContract: SectionContract<z.infer<typeof whyJoinDataSchema>> = {
  type: 'why-join',
  schema: whyJoinDataSchema,
  defaultData,
  editor: WhyJoinEditor,
  renderer: WhyJoinRenderer,
  metadata: {
    label: 'Why Join',
    description: 'Section displaying reasons to join',
    icon: 'users',
    category: 'content',
  },
}

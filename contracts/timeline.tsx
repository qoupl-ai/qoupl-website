/**
 * Timeline Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { timelineSectionSchema } from '@/lib/validation/section-schemas'

const timelineDataSchema = timelineSectionSchema.shape.data

// Placeholder renderer
const TimelineRenderer: React.ComponentType<{ data: z.infer<typeof timelineDataSchema> }> = () => {
  return <div>Timeline Section (Renderer to be implemented)</div>
}

// Placeholder editor
const TimelineEditor: React.ComponentType<{
  value: z.infer<typeof timelineDataSchema>
  onChange: (data: z.infer<typeof timelineDataSchema>) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Timeline Editor (Placeholder)</p>
    </div>
  )
}

const defaultData: z.infer<typeof timelineDataSchema> = timelineDataSchema.parse({})

export const timelineContract: SectionContract<z.infer<typeof timelineDataSchema>> = {
  type: 'timeline',
  schema: timelineDataSchema,
  defaultData,
  editor: TimelineEditor,
  renderer: TimelineRenderer,
  metadata: {
    label: 'Timeline',
    description: 'Timeline section displaying chronological events',
    icon: 'calendar',
    category: 'content',
  },
}

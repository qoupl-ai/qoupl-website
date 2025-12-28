/**
 * Values Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'

// Schema for values section
const valuesDataSchema = z.object({
  values: z.array(z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
    color: z.string().optional(),
  })),
})

// Placeholder renderer
const ValuesRenderer: React.ComponentType<{ data: z.infer<typeof valuesDataSchema> }> = () => {
  return <div>Values Section (Renderer to be implemented)</div>
}

// Placeholder editor
const ValuesEditor: React.ComponentType<{
  value: z.infer<typeof valuesDataSchema>
  onChange: (data: z.infer<typeof valuesDataSchema>) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Values Editor (Placeholder)</p>
    </div>
  )
}

const defaultData: z.infer<typeof valuesDataSchema> = {
  values: [],
}

export const valuesContract: SectionContract<z.infer<typeof valuesDataSchema>> = {
  type: 'values',
  schema: valuesDataSchema,
  defaultData,
  editor: ValuesEditor,
  renderer: ValuesRenderer,
  metadata: {
    label: 'Values',
    description: 'Section displaying company values',
    icon: 'heart',
    category: 'content',
  },
}


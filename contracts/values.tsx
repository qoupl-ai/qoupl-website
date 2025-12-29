/**
 * Values Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { valuesSectionSchema } from '@/lib/validation/section-schemas'

const valuesDataSchema = valuesSectionSchema.shape.data

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

const defaultData: z.infer<typeof valuesDataSchema> = valuesDataSchema.parse({})

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

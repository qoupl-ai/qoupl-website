/**
 * Free Messages Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { freeMessagesSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const FreeMessagesRenderer: React.ComponentType<{ data: z.infer<typeof freeMessagesSectionSchema>['data'] }> = () => {
  return <div>Free Messages Section (Renderer to be implemented)</div>
}

// Placeholder editor
const FreeMessagesEditor: React.ComponentType<{
  value: z.infer<typeof freeMessagesSectionSchema>['data']
  onChange: (data: z.infer<typeof freeMessagesSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Free Messages Editor (Placeholder)</p>
    </div>
  )
}

const freeMessagesDataSchema = freeMessagesSectionSchema.shape.data

const defaultData: z.infer<typeof freeMessagesDataSchema> = {
  count: 3,
  title: undefined,
  description: undefined,
}

export const freeMessagesContract: SectionContract<z.infer<typeof freeMessagesDataSchema>> = {
  type: 'free-messages',
  schema: freeMessagesDataSchema,
  defaultData,
  editor: FreeMessagesEditor,
  renderer: FreeMessagesRenderer,
  metadata: {
    label: 'Free Messages',
    description: 'Section displaying free message count information',
    icon: 'message-circle',
    category: 'commerce',
  },
}


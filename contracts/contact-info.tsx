/**
 * Contact Info Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { contactInfoSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const ContactInfoRenderer: React.ComponentType<{ data: z.infer<typeof contactInfoSectionSchema>['data'] }> = () => {
  return <div>Contact Info Section (Renderer to be implemented)</div>
}

// Placeholder editor
const ContactInfoEditor: React.ComponentType<{
  value: z.infer<typeof contactInfoSectionSchema>['data']
  onChange: (data: z.infer<typeof contactInfoSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Contact Info Editor (Placeholder)</p>
    </div>
  )
}

const contactInfoDataSchema = contactInfoSectionSchema.shape.data

const defaultData: z.infer<typeof contactInfoDataSchema> = {
  title: undefined,
  items: undefined,
}

export const contactInfoContract: SectionContract<z.infer<typeof contactInfoDataSchema>> = {
  type: 'contact-info',
  schema: contactInfoDataSchema,
  defaultData,
  editor: ContactInfoEditor,
  renderer: ContactInfoRenderer,
  metadata: {
    label: 'Contact Info',
    description: 'Section displaying contact information items',
    icon: 'phone',
    category: 'content',
  },
}


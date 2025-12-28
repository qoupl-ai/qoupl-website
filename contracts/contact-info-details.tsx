/**
 * Contact Info Details Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { contactInfoDetailsSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const ContactInfoDetailsRenderer: React.ComponentType<{ data: z.infer<typeof contactInfoDetailsSectionSchema>['data'] }> = () => {
  return <div>Contact Info Details Section (Renderer to be implemented)</div>
}

// Placeholder editor
const ContactInfoDetailsEditor: React.ComponentType<{
  value: z.infer<typeof contactInfoDetailsSectionSchema>['data']
  onChange: (data: z.infer<typeof contactInfoDetailsSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Contact Info Details Editor (Placeholder)</p>
    </div>
  )
}

const contactInfoDetailsDataSchema = contactInfoDetailsSectionSchema.shape.data

const defaultData: z.infer<typeof contactInfoDetailsDataSchema> = {
  title: undefined,
  description: undefined,
  items: undefined,
  faq_link: undefined,
}

export const contactInfoDetailsContract: SectionContract<z.infer<typeof contactInfoDetailsDataSchema>> = {
  type: 'contact-info-details',
  schema: contactInfoDetailsDataSchema,
  defaultData,
  editor: ContactInfoDetailsEditor,
  renderer: ContactInfoDetailsRenderer,
  metadata: {
    label: 'Contact Info Details',
    description: 'Detailed contact information section with cards',
    icon: 'contact',
    category: 'content',
  },
}


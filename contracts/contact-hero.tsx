/**
 * Contact Hero Section Contract
 */

import React from 'react'
import { z } from 'zod'
import type { SectionContract } from './types'
import { contactHeroSectionSchema } from '@/lib/validation/section-schemas'

// Placeholder renderer
const ContactHeroRenderer: React.ComponentType<{ data: z.infer<typeof contactHeroSectionSchema>['data'] }> = () => {
  return <div>Contact Hero Section (Renderer to be implemented)</div>
}

// Placeholder editor
const ContactHeroEditor: React.ComponentType<{
  value: z.infer<typeof contactHeroSectionSchema>['data']
  onChange: (data: z.infer<typeof contactHeroSectionSchema>['data']) => void
  sectionId?: string
}> = () => {
  return (
    <div className="p-4 border rounded">
      <p className="text-sm text-muted-foreground">Contact Hero Editor (Placeholder)</p>
    </div>
  )
}

const contactHeroDataSchema = contactHeroSectionSchema.shape.data

const defaultData: z.infer<typeof contactHeroDataSchema> = {
  title: undefined,
  subtitle: undefined,
  badge: undefined,
}

export const contactHeroContract: SectionContract<z.infer<typeof contactHeroDataSchema>> = {
  type: 'contact-hero',
  schema: contactHeroDataSchema,
  defaultData,
  editor: ContactHeroEditor,
  renderer: ContactHeroRenderer,
  metadata: {
    label: 'Contact Hero',
    description: 'Hero section for contact page',
    icon: 'mail',
    category: 'layout',
  },
}

